export enum ReflinkStatusCodes {
  Success = 0, // Operation was successful
  SourceFileInvalid, // Could not open the source file
  DestinationFileInvalid, // Could not create the destination file
  VolumeInfoFailed, // Failed to retrieve volume information
  FileSizeRetrievalFailed, // Failed to retrieve the source file size
  FileBasicInfoRetrievalFailed, // Failed to retrieve basic file info
  GetIntegrityFailed, // Failed to get file integrity information
  SetSparseFailed, // Failed to set the destination file as sparse
  SetIntegrityFailed, // Failed to set integrity information
  SetFileSizeFailed, // Failed to set destination file size
  DuplicateExtentsFailed, // Failed to duplicate extents
  SetSparseFalseFailed, // Failed to set sparse to false
  SetFileBasicInfoFailed, // Failed to set basic file information
  FlushBuffersFailed, // Failed to flush file buffers
  SetDispositionFailed, // Failed to set file disposition
  ParentDirectoryInvalid, // Could not open the parent directory
  FileAlreadyExists, // The destination file already exists
}

const ErrorCodes = {
  0: 'REFLINK_STATUS_SUCCESS',
  1: 'REFLINK_STATUS_SOURCE_FILE_INVALID',
  2: 'REFLINK_STATUS_DESTINATION_FILE_INVALID',
  3: 'REFLINK_STATUS_VOLUME_INFO_FAILED',
  4: 'REFLINK_STATUS_FILE_SIZE_RETRIEVAL_FAILED',
  5: 'REFLINK_STATUS_FILE_BASIC_INFO_RETRIEVAL_FAILED',
  6: 'REFLINK_STATUS_GET_INTEGRITY_FAILED',
  7: 'REFLINK_STATUS_SET_SPARSE_FAILED',
  8: 'REFLINK_STATUS_SET_INTEGRITY_FAILED',
  9: 'REFLINK_STATUS_SET_FILE_SIZE_FAILED',
  10: 'REFLINK_STATUS_DUPLICATE_EXTENTS_FAILED',
  11: 'REFLINK_STATUS_SET_SPARSE_FALSE_FAILED',
  12: 'REFLINK_STATUS_SET_FILE_BASIC_INFO_FAILED',
  13: 'REFLINK_STATUS_FLUSH_BUFFERS_FAILED',
  14: 'REFLINK_STATUS_SET_DISPOSITION_FAILED',
  15: 'REFLINK_STATUS_PARENT_DIRECTORY_INVALID',
  16: 'REFLINK_STATUS_FILE_ALREADY_EXISTS',
};

export function getErrorMessage(
  code: ReflinkStatusCodes,
  src: string,
  dest: string
): string {
  switch (code) {
    case ReflinkStatusCodes.SourceFileInvalid:
      return `${ErrorCodes[code]}: ${src} is not a valid file`;
    case ReflinkStatusCodes.DestinationFileInvalid:
      return `${ErrorCodes[code]}: ${dest} is invalid or already exists.`;
    case ReflinkStatusCodes.VolumeInfoFailed:
      return `${ErrorCodes[code]}: Failed to retrieve volume information`;
    case ReflinkStatusCodes.FileSizeRetrievalFailed:
      return `${ErrorCodes[code]}: Failed to retrieve the source file size`;
    case ReflinkStatusCodes.FileBasicInfoRetrievalFailed:
      return `${ErrorCodes[code]}: Failed to retrieve basic file info`;
    case ReflinkStatusCodes.GetIntegrityFailed:
      return `${ErrorCodes[code]}: Failed to get file integrity information`;
    case ReflinkStatusCodes.SetSparseFailed:
      return `${ErrorCodes[code]}: Failed to set the destination file as sparse`;
    case ReflinkStatusCodes.SetIntegrityFailed:
      return `${ErrorCodes[code]}: Failed to set integrity information`;
    case ReflinkStatusCodes.SetFileSizeFailed:
      return `${ErrorCodes[code]}: Failed to set destination file size`;
    case ReflinkStatusCodes.DuplicateExtentsFailed:
      return `${ErrorCodes[code]}: Failed to duplicate extents`;
    case ReflinkStatusCodes.SetSparseFalseFailed:
      return `${ErrorCodes[code]}: Failed to set sparse to false`;
    case ReflinkStatusCodes.SetFileBasicInfoFailed:
      return `${ErrorCodes[code]}: Failed to set basic file information`;
    case ReflinkStatusCodes.FlushBuffersFailed:
      return `${ErrorCodes[code]}: Failed to flush file buffers`;
    case ReflinkStatusCodes.SetDispositionFailed:
      return `${ErrorCodes[code]}: Failed to set file disposition`;
    case ReflinkStatusCodes.ParentDirectoryInvalid:
      return `${ErrorCodes[code]}: Could not open the parent directory`;
    case ReflinkStatusCodes.FileAlreadyExists:
      return `${ErrorCodes[code]}: The destination file already exists`;
    default:
      return `${ErrorCodes[code]}: Unknown error`;
  }
}
