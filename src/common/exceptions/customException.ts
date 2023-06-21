import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { CustomInternalServerException } from "./customInternalServerException";
import { ValidationException } from "./validationException";
import { ParamValidationException } from "./paramValidationException";

export class CustomException extends HttpException {
  constructor(error) {
    if (error instanceof HttpException === false) {
      if (error?.errno === 1451) {
        throw new BadRequestException(
          "This data used anywhere. You can not remove this parent data."
        );
      }
      throw new CustomInternalServerException(error);
    } else if (error instanceof ValidationException) {
      throw error;
    } else if (error instanceof ParamValidationException) {
      throw error;
    }
    super(error, error.status);
  }
}
