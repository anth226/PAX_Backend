import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomInternalServerException extends HttpException {
  /**
   * Instantiate a `CustomInternalServerException` Exception.
   *
   * @example
   * `throw new CustomInternalServerException(error)`
   *
   */
  constructor(error) {
    super(error, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
