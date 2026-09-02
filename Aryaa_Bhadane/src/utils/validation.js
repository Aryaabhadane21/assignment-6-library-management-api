/**
 * Formats express-validator error array into clean structured JSON output
 * @param {Array} errors
 * @returns {Array} Formatted error objects
 */
const formatValidationErrors = (errors) => {
  return errors.map((err) => ({
    field: err.param || err.path,
    message: err.msg
  }));
};

module.exports = {
  formatValidationErrors
};
