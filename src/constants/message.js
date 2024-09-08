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
