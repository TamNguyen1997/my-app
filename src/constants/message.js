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
  CREATE_SUCCESS: "User created successfully!",
  CREATE_FAILED: "Error creating user, please try again.",
  UPDATE_SUCCESS: "User updated successfully!",
  UPDATE_FAILED: "Error updating user, please try again.",
  DELETE_SUCCESS: "User deleted successfully!",
  DELETE_FAILED: "Error deleting user, please try again.",
  USER_NOT_FOUND: "User not found.",
  PASSWORD_CHANGE_SUCCESS: "Password changed successfully!",
  PASSWORD_CHANGE_FAILED: "Error changing password, please try again.",
  PASSWORD_MISMATCH: "Passwords do not match.",
  INCORRECT_PASSWORD: "Current password is incorrect.",
  INVALID_USER_DATA: "Invalid user data provided.",
  USERS_FETCH_SUCCESS: "User data fetched successfully!",
  USERS_FETCH_FAILED: "Error fetching user data, please try again.",
  USERNAME_ALREADY_EXISTS:
    "Username already exists, please choose a different one.",
  EMAIL_ALREADY_EXISTS:
    "Email already exists, please use a different email address.",
  USER_NOT_ACTIVE: "This user account is not active. Please contact support.",
  USER_CREATE_IN_PROGRESS: "Creating user, please wait...",
  USER_UPDATE_IN_PROGRESS: "Updating user, please wait...",
  USER_DELETE_IN_PROGRESS: "Deleting user, please wait...",
};

export const LOGIN_MESSAGE = {
  LOGIN_SUCCESS: "Login successful, welcome back!",
  LOGIN_FAILED: "Login failed, please check your credentials.",
  LOGOUT_SUCCESS: "Logged out successfully!",
  LOGOUT_FAILED: "Error logging out, please try again.",
  SESSION_EXPIRED: "Your session has expired, please log in again.",
  UNAUTHORIZED: "You are not authorized to access this resource.",
  FORGOT_PASSWORD_EMAIL_SENT: "Password reset email sent successfully!",
  RESET_PASSWORD_SUCCESS: "Password reset successfully!",
  RESET_PASSWORD_FAILED: "Error resetting password, please try again.",
  ACCOUNT_LOCKED:
    "Your account has been locked due to multiple failed login attempts. Please try again later.",
  LOGIN_IN_PROGRESS: "Logging you in, please wait...",
  LOGOUT_IN_PROGRESS: "Logout you in, please wait...",
  USER_NOT_LOGGED_IN: "User not logged in",
};
