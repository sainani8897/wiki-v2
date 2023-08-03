class NotFoundException extends Error {
  constructor(message) {
    super(message);

    // assign the error class name in your custom error (as a shortcut)
    this.name = this.constructor.name;

    //assign the Status Code.
    this.status = 404;

    // capturing the stack trace keeps the reference to your error class
    Error.captureStackTrace(this, this.constructor);

    // you may also assign additional properties to your error
    // this.isSleepy = true;
  }

  statusCode() {
    return this.status;
  }
}

module.exports = NotFoundException;
