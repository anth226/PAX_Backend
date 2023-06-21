import { HttpException, HttpStatus } from "@nestjs/common";

export interface IValidationError {
  field: string;
  message: string;
}
export class ValidationException extends HttpException {
  /**
   * Instantiate a `ValidationException` Exception.
   *
   * @example
   * `throw new ValidationException(errors)`
   *
   */
  constructor(errors: IValidationError[]) {
    super({ errors }, HttpStatus.BAD_REQUEST);
  }
}
