/**
 * Safely converts value to string and trims it
 * @param {any} value - Value to convert and trim
 * @returns {string} - Trimmed string or empty string
 */
function safeTrim(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

/**
 * Validates language information
 * 1st Language, 2nd Language, and 3rd Language are mandatory
 * @param {Object} formData - Form data containing language information
 * @returns {Object} - Object with validation errors { fieldName: errorMessage }
 */
export function validateLanguageInfo(formData) {
  const errors = {};

  // 1st Language is required
  const firstLanguage = safeTrim(formData.firstLanguage);
  if (!firstLanguage) {
    errors.firstLanguage = "1st Language is required";
  }

  // 2nd Language is required
  const secondLanguage = safeTrim(formData.secondLanguage);
  if (!secondLanguage) {
    errors.secondLanguage = "2nd Language is required";
  }

  // 3rd Language is required
  const thirdLanguage = safeTrim(formData.thirdLanguage);
  if (!thirdLanguage) {
    errors.thirdLanguage = "3rd Language is required";
  }

  return errors;
}
