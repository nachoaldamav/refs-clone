#include <node_api.h>
#include <Windows.h>
#include <string>
#include "reflink.h"
#include "statusCodes.h"

napi_value ReflinkWrapper(napi_env env, napi_callback_info info) {
    napi_status status;

    size_t argc = 2;
    napi_value args[2];
    status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);

    if (status != napi_ok) {
        napi_throw_error(env, nullptr, "Failed to parse arguments");
        return nullptr;
    }

    // Get the string lengths first
    size_t str_size1, str_size2;
    status = napi_get_value_string_utf16(env, args[0], nullptr, 0, &str_size1);
    status = napi_get_value_string_utf16(env, args[1], nullptr, 0, &str_size2);

    std::wstring oldpath(str_size1, L'\0');
    std::wstring newpath(str_size2, L'\0');

    // Fetch the actual strings
    status = napi_get_value_string_utf16(env, args[0], reinterpret_cast<char16_t*>(&oldpath[0]), str_size1 + 1, &str_size1);
    status = napi_get_value_string_utf16(env, args[1], reinterpret_cast<char16_t*>(&newpath[0]), str_size2 + 1, &str_size2);

    // Call the C++ function
    ReflinkError result = reflink(oldpath.c_str(), newpath.c_str());

    napi_value result_value;
    status = napi_create_int32(env, static_cast<int>(result), &result_value);

    if (status != napi_ok) {
        napi_throw_error(env, nullptr, "Unable to convert enum to napi_value");
        return nullptr;
    }

    return result_value;
}


napi_value Init(napi_env env, napi_value exports) {
    napi_status status;
    napi_value fn;

    status = napi_create_function(env, nullptr, NAPI_AUTO_LENGTH, ReflinkWrapper, nullptr, &fn);
    if (status != napi_ok) return nullptr;

    status = napi_set_named_property(env, exports, "reflink", fn);
    if (status != napi_ok) return nullptr;

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
