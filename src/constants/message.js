export const UPLOAD_MESSAGE = {
  FILE_UPLOAD_SUCCESS: "The file was uploaded successfully.",
  FILE_UPLOAD_FAILED: "The file upload failed.",
  INVALID_FILE_TYPE: "Please select a valid Excel file (.xlsx or .xls).",
  FILE_NOT_SELECTED:
    "No file was selected. Please select an Excel file to upload.",
  FILE_TOO_LARGE: "The selected file exceeds the maximum allowed size of 5MB.",
  PROCESSING: "Data is being processed, please wait a moment...",
  UPLOAD_TYPE_ERROR: "Please select an upload type.",
};

export const IMPORT_MESSAGE = {
  IMPORT_SUCCESS: "The import process was completed successfully.",
  IMPORT_FAILED: "An error occurred during the import process.",
  INVALID_UUID_FORMAT: "The provided ID has an invalid UUID format.",
  CATEGORY_NOT_FOUND: "The specified Category ID does not exist.",
  SUB_CATEGORY_NOT_FOUND: "The specified Sub-category ID does not exist.",
  PRODUCT_NOT_FOUND: "The specified Product ID does not exist.",
  FILTER_NOT_FOUND: "The specified Filter ID does not exist.",
  FILTER_VALUE_NOT_FOUND: "The specified Filter-value ID does not exist.",
  BRAND_NOT_FOUND: "The specified Brand ID does not exist.",
  MISSING_REQUIRED_DATA:
    "The product was skipped due to missing required data columns.",
  ERROR_LIMIT_REACHED: "The maximum error limit was reached during the import.",
  DATABASE_ERROR: "A database error occurred during the import process.",
  RECORD_ALREADY_EXISTS:
    "A record with this combination of IDs already exists.",
};

export const HISTORY_MESSAGE = {
  HISTORY_FETCH_SUCCESS: "Import history records retrieved successfully.",
  HISTORY_FETCH_FAILED: "Failed to retrieve import history records.",
  HISTORY_SAVE_SUCCESS: "Import history was saved successfully.",
  HISTORY_SAVE_FAILED: "Failed to save import history.",
};

export const PRODUCT_MESSAGE = {
  PRODUCT_FETCH_SUCCESS: "Product records retrieved successfully.",
  PRODUCT_FETCH_FAILED: "Failed to retrieve product records.",
};

export const EXPORT_MESSAGE = {
  DATA_LIMIT_EXCEEDED: "Data limit exceeded, please request a smaller dataset.",
  INVALID_PARAMETERS: "Invalid parameters provided for export.",
  EXPORT_SUCCESS: "Excel file exported successfully!",
  EXPORT_FAILED: "Error generating Excel file.",
  EXPORT_IN_PROGRESS: "Data is being downloaded, please wait...",
  SELECT_RANGE_ERROR: "Please select a data range for export.",
};

export const USER_MESSAGE = {
  CREATE_SUCCESS: "Tạo user thành công!",
  CREATE_FAILED: "Lỗi tạo user, vui lòng thử lại.",
  UPDATE_SUCCESS: "Cập nhật user thành công!",
  UPDATE_FAILED: "Lỗi cập nhật user, vui lòng thử lại.",
  DELETE_SUCCESS: "Đã xóa thành công user!",
  DELETE_FAILED: "Lỗi xóa user, vui lòng thử lại.",
  USER_NOT_FOUND: "Không tìm thấy user.",
  PASSWORD_CHANGE_SUCCESS: "Cập nhật password thành công!",
  PASSWORD_CHANGE_FAILED: "Error changing password, vui lòng thử lại.",
  PASSWORD_MISMATCH: "Password không trùng nhau, vui lòng kiểm tra lại.",
  INCORRECT_PASSWORD: "Password hiện tại không đúng.",
  INVALID_USER_DATA: "Thông tin user không hợp lệ.",
  USERS_FETCH_SUCCESS: "User data fetched successfully!",
  USERS_FETCH_FAILED: "Error fetching user data, vui lòng thử lại.",
  USERNAME_ALREADY_EXISTS:
    "Username đã tồn tại, vui lòng điền username khác.",
  EMAIL_ALREADY_EXISTS:
    "Email đã tồn tại, vui lòng điền email khác.",
  USER_NOT_ACTIVE: "User này đã bị khóa. Vui lòng liên hệ hỗ trợ.",
  USER_CREATE_IN_PROGRESS: "Đang tạo user, vui lòng đợi...",
  USER_UPDATE_IN_PROGRESS: "Đang chỉnh sửa user, vui lòng đợi...",
  USER_DELETE_IN_PROGRESS: "Đang xóa user, vui lòng đợi...",
};

export const LOGIN_MESSAGE = {
  LOGIN_SUCCESS: "Đăng nhập thành công.",
  DEACTIVATED: "Đăng nhập thất bại, please check your credentials.",
  LOGOUT_SUCCESS: "Đăng xuất thành công!",
  LOGOUT_FAILED: "Lỗi đăng xuất, vui lòng thử lại.",
  SESSION_EXPIRED: "Your session has expired, please log in again.",
  UNAUTHORIZED: "Bạn không có quyền truy cập tài nguyên này.",
  FORGOT_PASSWORD_EMAIL_SENT: "Password reset email sent successfully!",
  RESET_PASSWORD_SUCCESS: "Thay đổi mật khẩu thành công!",
  RESET_PASSWORD_FAILED: "Lỗi thay đổi mật khẩu, vui lòng thử lại.",
  ACCOUNT_LOCKED:
    "Tài khoản của bạn đã bị khóa do đăng nhập quá nhiều lần. Vui lòng thử lại sau.",
  LOGIN_IN_PROGRESS: "Đang đăng nhập, vui lòng đợi...",
  LOGOUT_IN_PROGRESS: "Đang đang xuất, vui lòng đợi...",
  USER_NOT_LOGGED_IN: "User not logged in",
};
