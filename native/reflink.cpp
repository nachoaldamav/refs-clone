#define WIN32_LEAN_AND_MEAN
#define STRICT_GS_ENABLED
#define _ATL_NO_AUTOMATIC_NAMESPACE
#define _ATL_NO_DEFAULT_LIBS
#define _ATL_NO_WIN_SUPPORT
#define _CRTDBG_MAP_ALLOC
#include <atlbase.h>
#include <windows.h>
#include <winioctl.h>
#include <algorithm>
#include "reflink.h"
#include <crtdbg.h>
#include "statusCodes.h"
#include <string>
#include <Shlwapi.h>  // For PathRemoveFileSpecW
#pragma comment(lib, "Shlwapi.lib")

ReflinkError checkDirectoryAndFile(PCWSTR newpath) {
	// Copy path to a mutable buffer so we can modify it
	WCHAR dirPath[MAX_PATH];
	wcscpy_s(dirPath, newpath);

	// Remove the file part to get the directory path
	PathRemoveFileSpecW(dirPath);

	// Check if the directory exists
	DWORD dirAttr = GetFileAttributesW(dirPath);
	if (dirAttr == INVALID_FILE_ATTRIBUTES || !(dirAttr & FILE_ATTRIBUTE_DIRECTORY)) {
		return ParentDirectoryDoesntExist;
	}

	// Check if the file already exists
	DWORD fileAttr = GetFileAttributesW(newpath);
	if (fileAttr != INVALID_FILE_ATTRIBUTES) {
		return FileAlreadyExists;
	}

	return Success;
}

constexpr LONG64 inline ROUNDUP(LONG64 file_size, ULONG cluster_size) noexcept
{
	return (file_size + cluster_size - 1) / cluster_size * cluster_size;
}

static_assert(ROUNDUP(5678, 4 * 1024) == 8 * 1024);

_Success_(return == Success)

ReflinkError reflink(_In_z_ PCWSTR oldpath, _In_z_ PCWSTR newpath)
{
	// Check for directory and file existence
    ReflinkError dirAndFileCheck = checkDirectoryAndFile(newpath);
    if (dirAndFileCheck != Success) {
        return dirAndFileCheck;
    }

	ATL::CHandle source(CreateFileW(oldpath, GENERIC_READ, FILE_SHARE_READ, nullptr, OPEN_EXISTING, 0, nullptr));
	if (source == INVALID_HANDLE_VALUE)
	{
		source.Detach();
		return SourceFileInvalid;
	}

	ULONG fs_flags;
	if (!GetVolumeInformationByHandleW(source, nullptr, 0, nullptr, nullptr, &fs_flags, nullptr, 0))
	{
		return VolumeInfoFailed;
	}
	if (!(fs_flags & FILE_SUPPORTS_BLOCK_REFCOUNTING))
	{
		SetLastError(ERROR_NOT_CAPABLE);
		return VolumeInfoFailed;
	}

	FILE_END_OF_FILE_INFO file_size;
	if (!GetFileSizeEx(source, &file_size.EndOfFile))
	{
		return FileSizeRetrievalFailed;
	}
	FILE_BASIC_INFO file_basic;
	if (!GetFileInformationByHandleEx(source, FileBasicInfo, &file_basic, sizeof file_basic))
	{
		return FileBasicInfoRetrievalFailed;
	}
	ULONG junk;
	FSCTL_GET_INTEGRITY_INFORMATION_BUFFER get_integrity;
	if (!DeviceIoControl(source, FSCTL_GET_INTEGRITY_INFORMATION, nullptr, 0, &get_integrity, sizeof get_integrity, &junk, nullptr))
	{
		return GetIntegrityFailed;
	}

#ifdef _DEBUG
	SetFileAttributesW(newpath, FILE_ATTRIBUTE_NORMAL);
	ATL::CHandle destination(CreateFileW(newpath, GENERIC_READ | GENERIC_WRITE | DELETE, 0, nullptr, CREATE_ALWAYS, 0, source));
#else
	ATL::CHandle destination(CreateFileW(newpath, GENERIC_READ | GENERIC_WRITE | DELETE, 0, nullptr, CREATE_NEW, 0, source));
#endif
	if (destination == INVALID_HANDLE_VALUE)
	{
		destination.Detach();
		return DestinationFileInvalid;
	}
	FILE_DISPOSITION_INFO dispose = { TRUE };
	if (!SetFileInformationByHandle(destination, FileDispositionInfo, &dispose, sizeof dispose))
	{
		return SetDispositionFailed;
	}

	if (!DeviceIoControl(destination, FSCTL_SET_SPARSE, nullptr, 0, nullptr, 0, &junk, nullptr))
	{
		return SetSparseFailed;
	}
	FSCTL_SET_INTEGRITY_INFORMATION_BUFFER set_integrity = { get_integrity.ChecksumAlgorithm, get_integrity.Reserved, get_integrity.Flags };
	if (!DeviceIoControl(destination, FSCTL_SET_INTEGRITY_INFORMATION, &set_integrity, sizeof set_integrity, nullptr, 0, nullptr, nullptr))
	{
		return SetIntegrityFailed;
	}
	if (!SetFileInformationByHandle(destination, FileEndOfFileInfo, &file_size, sizeof file_size))
	{
		return SetFileSizeFailed;
	}

	const LONG64 split_threshold = (1LL << 32) - get_integrity.ClusterSizeInBytes;

	DUPLICATE_EXTENTS_DATA dup_extent;
	dup_extent.FileHandle = source;
	for (LONG64 offset = 0, remain = ROUNDUP(file_size.EndOfFile.QuadPart, get_integrity.ClusterSizeInBytes); remain > 0; offset += split_threshold, remain -= split_threshold)
	{
		dup_extent.SourceFileOffset.QuadPart = dup_extent.TargetFileOffset.QuadPart = offset;
		dup_extent.ByteCount.QuadPart = (std::min)(split_threshold, remain);
		_ASSERTE(dup_extent.SourceFileOffset.QuadPart % get_integrity.ClusterSizeInBytes == 0);
		_ASSERTE(dup_extent.ByteCount.QuadPart % get_integrity.ClusterSizeInBytes == 0);
		_ASSERTE(dup_extent.ByteCount.QuadPart <= UINT32_MAX);
		_RPT3(_CRT_WARN, "Remain=%llx\nOffset=%llx\nLength=%llx\n\n", remain, dup_extent.SourceFileOffset.QuadPart, dup_extent.ByteCount.QuadPart);
		if (!DeviceIoControl(destination, FSCTL_DUPLICATE_EXTENTS_TO_FILE, &dup_extent, sizeof dup_extent, nullptr, 0, &junk, nullptr))
		{
			_CrtDbgBreak();
			return DuplicateExtentsFailed;
		}
	}

	if (!(file_basic.FileAttributes & FILE_ATTRIBUTE_SPARSE_FILE))
	{
		FILE_SET_SPARSE_BUFFER set_sparse = { FALSE };
		if (!DeviceIoControl(destination, FSCTL_SET_SPARSE, &set_sparse, sizeof set_sparse, nullptr, 0, &junk, nullptr))
		{
			return SetSparseFalseFailed;
		}
	}

	file_basic.CreationTime.QuadPart = 0;
	if (!SetFileInformationByHandle(destination, FileBasicInfo, &file_basic, sizeof file_basic))
	{
		return SetFileBasicInfoFailed;
	}
	if (!FlushFileBuffers(destination))
	{
		return FlushBuffersFailed;
	}
	dispose = { FALSE };
	SetFileInformationByHandle(destination, FileDispositionInfo, &dispose, sizeof dispose);
	return Success;
}
