class ValidationException extends Error {
  constructor(message,error={}) {
    super(message);

    // assign the error class name in your custom error (as a shortcut)
    this.name = this.constructor.name;

    //assign the Status Code.
    this.status = 400;

    // capturing the stack trace keeps the reference to your error class
    Error.captureStackTrace(this, this.constructor);

    // you may also assign additional properties to your error
    this.error = error;
  }

  statusCode() {
    return this.status;
  }
}

module.exports = ValidationException;
