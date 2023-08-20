class CustomError extends Error {
  constructor(message, statusCode = 400, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

module.exports = CustomError;
