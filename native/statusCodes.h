#ifndef STATUS_CODES_H
#define STATUS_CODES_H

enum ReflinkError {
    Success = 0,                 // Operation was successful
    SourceFileInvalid,           // Could not open the source file
    DestinationFileInvalid,      // Could not create the destination file
    VolumeInfoFailed,            // Failed to retrieve volume information
    FileSizeRetrievalFailed,     // Failed to retrieve the source file size
    FileBasicInfoRetrievalFailed,// Failed to retrieve basic file info
    GetIntegrityFailed,          // Failed to get file integrity information
    SetSparseFailed,             // Failed to set the destination file as sparse
    SetIntegrityFailed,          // Failed to set integrity information
    SetFileSizeFailed,           // Failed to set destination file size
    DuplicateExtentsFailed,      // Failed to duplicate extents
    SetSparseFalseFailed,        // Failed to set sparse to false
    SetFileBasicInfoFailed,      // Failed to set basic file information
    FlushBuffersFailed,          // Failed to flush file buffers
    SetDispositionFailed,        // Failed to set file disposition
    ParentDirectoryDoesntExist, // The parent directory does not exist
    FileAlreadyExists,       // The destination file already exists
};

#endif // STATUS_CODES_H