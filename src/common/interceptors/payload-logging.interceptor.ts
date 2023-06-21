import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { catchError, map, tap } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import * as winston from "winston";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LogApiGatewayRequestResponseEntity } from "../shared/log-api-gateway-request-response.entity";
/**
 * LoggingInterceptor Use for log every request
 * @class
 * @version 1.0.0
 * @since 1.0.0
 * @author asraful Islam <asraful009@gmail.com>
 * @copyright SIMEC System Ltd 2020
 * @global
 */
@Injectable()
export class PayloadLoggingInterceptor implements NestInterceptor {
  /**
   * @since 1.0.0
   * @name logger
   * @private
   * @constant
   */
  private readonly logger: winston.Logger;

  constructor(
    @InjectRepository(LogApiGatewayRequestResponseEntity)
    private readonly logService: Repository<LogApiGatewayRequestResponseEntity>
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const body = { ...request["body"] };
    if (body.password) body.password = "•••••••••••••";
    if (body.confirm_password) body.confirm_password = "•••••••••••••";

    const logObject: any = {
      url: request["originalUrl"],
      method: request["method"],
      request_json: JSON.stringify(body),
      host_internal_info_json: JSON.stringify({ className, methodName }),
      created_by: request["_user"]?.id,
    };

    return next.handle().pipe(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      tap(() => {}),
      map((payload) => {
        if (
          logObject?.url?.includes("pdf") ||
          logObject?.url?.includes("excel")
        ) {
          return payload;
        }
        logObject.response_code = payload?.response?.statusCode;
        logObject.response_json = JSON.stringify(payload?.response?.data);
        if (request["method"] != "GET") {
          this.logService.save(logObject);
        }

        const responseObject = {
          statusCode: +payload?.response?.statusCode,
          message: payload?.response?.message,
          metadata: payload?.response?.metadata,
          data: payload?.response?.data,
        };

        return {
          response: responseObject,
        };
      }),
      catchError((err) => {
        logObject.response_code = +err?.status;
        logObject.response_json = err?.message;
        logObject.host_internal_error_json = JSON.stringify(err);
        this.logService.save(logObject);

        return throwError(err);
      })
    );
  }
}
