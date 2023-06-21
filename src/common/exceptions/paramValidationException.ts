import { HttpException, HttpStatus } from "@nestjs/common";

export interface IValidationError {
  field: string;
  message: string;
}
export class ParamValidationException extends HttpException {
  /**
   * Instantiate a `ParamValidationException` Exception.
   *
   * @example
   * `throw new ParamValidationException(errors)`
   *
   */
  constructor(errors: string[]) {
    super({ errors }, HttpStatus.BAD_REQUEST);
  }
}
