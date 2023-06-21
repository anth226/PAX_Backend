import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";

import { I18nService, I18nValidationException } from "nestjs-i18n";
import { CustomException } from "src/common/exceptions/customException";
import { CustomInternalServerException } from "src/common/exceptions/customInternalServerException";
import { ValidationException } from "src/common/exceptions/validationException";
import numberConverter from "src/common/function/NumberConverter";
import { TypeORMError } from "typeorm";

export function getLangFromRequest(request: any) {
  return (
    request?.headers?.lang ||
    request?.body?.lang ||
    request?.query?.lang ||
    "en"
  );
}

/**
 * HttpExceptionFilter user for All error payload responce format
 *
 * @example add to app.module
 * @date 2020-10-09T12:11:13.305Z
 * @class HttpExceptionFilter
 * @since 1.0.0
 * @version 1.0.0
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * init logger
   *
   * @constructor
   * @author asraful
   * @since 1.0.0
   * @version 1.0.0
   * @date 2020-10-07T12:11:13.305Z
   */
  constructor(private readonly i18n: I18nService) {}

  /**
   * `catch` override method
   *
   * @date 2020-10-08T12:11:13.305Z
   * @since 1.0.0
   * @version 1.0.0
   * @override
   * @param  {HttpException} exception
   * @param  {ArgumentsHost} host
   */
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let errors = [];
    const request = ctx.getRequest<Request>();
    let status = 500;
    const systemError = [];

    if (
      exception instanceof CustomInternalServerException ||
      exception instanceof BadRequestException ||
      exception instanceof TypeError ||
      exception instanceof TypeORMError ||
      exception instanceof UnauthorizedException
    ) {
      systemError.push({
        name: "",
        message: [exception.message],
      });
    } else if (
      exception instanceof CustomException ||
      exception instanceof NotFoundException
    ) {
      status = exception?.getStatus();
      errors = exception.getResponse()?.["error"] ?? [];
      systemError.push({
        name: "",
        message: [exception.message],
      });
    } else if (exception instanceof ValidationException) {
      status = exception?.getStatus();
      errors = exception.getResponse()?.["errors"] ?? [];
      for (const error of errors) {
        systemError.push({
          name: error.field,
          message: [error.message],
        });
      }
    } else if (exception instanceof ForbiddenException) {
      status = exception?.getStatus();
      errors = exception.getResponse()?.["errors"] ?? [];
      for (const error of errors) {
        systemError.push({
          name: error.field,
          message: [error.message],
        });
      }
    } else if (exception instanceof I18nValidationException) {
      status = exception?.getStatus();
      for (const error of exception.errors) {
        const errorMessages = Object.values(error.constraints);
        const dtoMessages = [];
        for (const errorMessage of errorMessages) {
          const message = await this.i18n.translate(
            errorMessage?.split("|")[0]?.toString(),
            {
              lang: getLangFromRequest(request),
            }
          );
          let numberTranslate;
          if (errorMessage?.split("|")[1]) {
            numberTranslate = numberConverter(
              getLangFromRequest(request),
              Number(JSON.parse(errorMessage?.split("|")[1])?.constraints?.[0])
            );
          }

          dtoMessages.push(
            message
              .toString()
              .replace("{constraints.0}", numberTranslate?.toString() || "")
          );
        }
        systemError.push({
          name: error?.property,
          message: dtoMessages,
        });
      }
    }

    const payload = {
      response: {
        statusCode: status,
        message: `error`,
        meta: {},
        data: {},
        error: {
          count: systemError.length,
          errorMessages: systemError,
        },
      },
    };
    response.status(status).json(payload);
  }
}
