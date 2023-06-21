import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  ValidationPipeOptions,
  Optional,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { ParamValidationException } from "../exceptions/paramValidationException";
import {
  IValidationError,
  ValidationException,
} from "../exceptions/validationException";
import { CustomException } from "../exceptions/customException";

@Injectable()
export class DtoValidationPipe implements PipeTransform<any> {
  options: ValidationPipeOptions;

  constructor(@Optional() options?: ValidationPipeOptions) {
    this.options = options || {};
    this.options = {
      stopAtFirstError: true,
      ...this.options,
    };
  }
  async transform(value: any, { metatype, type }: ArgumentMetadata) {
    try {
      if (type === "body" || type === "param") {
        this.options = {
          whitelist: true,
          forbidNonWhitelisted: true,
          ...this.options,
        };
      }
      if (!metatype || !this.toValidate(metatype)) {
        return value;
      }

      const object = plainToClass(metatype, value);
      const errors = await validate(object, this.options);

      if (errors.length > 0) {
        const validationErrors: IValidationError[] = [];
        for (const [index, error] of errors.entries()) {
          const property = error.property;
          const errorCollection = [];
          //if (error.children && error.children.length) {
          if (
            !error.constraints ||
            Object.keys(error.constraints).length === 0
          ) {
            this.findChildError(errorCollection, error.children, property);
          } else {
            errorCollection.push({
              field: error.property,
              message: error.constraints[Object.keys(error.constraints)[0]],
            });
          }
          validationErrors.push(...errorCollection);
        }

        if (type === "param") {
          throw new ParamValidationException(
            validationErrors.map((error) => error.message)
          );
        } else {
          throw new ValidationException(validationErrors);
        }
      }
      return value;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
  private findChildError(errorCollection, errors, property) {
    for (const [index, error] of errors.entries()) {
      //if (error.children && error.children.length) {
      if (!error.constraints || Object.keys(error.constraints).length === 0) {
        const nProperty = "." + error.property;
        const sProperty = "[" + error.property + "]";
        const newProperty = isNaN(error.property) ? nProperty : sProperty;
        this.findChildError(
          errorCollection,
          error.children,
          property + newProperty
        );
      } else {
        errorCollection.push({
          field: property + "." + error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        });
      }
    }
  }
}
