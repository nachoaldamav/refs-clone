#pragma once
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <stdbool.h>
#include "statusCodes.h"

EXTERN_C
_Success_(return == Success)
ReflinkError reflink(_In_z_ PCWSTR oldpath, _In_z_ PCWSTR newpath);