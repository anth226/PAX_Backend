import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { I18nService } from "nestjs-i18n";
import { RedisService } from "nestjs-redis";
import LanguageDto from "src/common/dto/lang.dto";
import { PayloadResponseDTO } from "src/common/dto/payload-response.dto";
import { ValidationException } from "src/common/exceptions/validationException";
import { DtoValidationPipe } from "src/common/pipes/dtoValidation.pipe";
import { AdminAuthDto } from "../../dto/auth.dto";
import { PasswordForgotDto } from "../../dto/password-forgot.dto";
import { PasswordForgotTokenOtpCheckDto } from "../../dto/PwsReseTokenCheck.dto";
import { PasswordForgotTokenDto } from "../../dto/PwsResetOtpToken.dto";
import { UriTokenIdDTO } from "../../dto/uri-token-id.dto";
import { AdminAuthService } from "../../services/auth.service";

@ApiTags("auth")
@Controller("v1/admin/auth")
export class AdminAuthController {
  constructor(
    private readonly authService: AdminAuthService,
    private readonly redisService: RedisService,
    private readonly i18n: I18nService
  ) {}

  @Post("/")
  @ApiResponse({
    description: "Successfully logged In.",
    status: HttpStatus.OK,
  })
  @ApiBadRequestResponse({ description: "Validation error" })
  @ApiForbiddenResponse({ description: "Invalid credentials / inactive" })
  @ApiInternalServerErrorResponse({ description: "Internal Server Error." })
  @ApiBody({ type: AdminAuthDto })
  async auth(@Body(new DtoValidationPipe()) authData: AdminAuthDto) {
    const auth = await this.authService.auth(authData);

    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: "Successfully logged in",
      data: { auth },
      error: {},
    });
  }
  @Post("/password_forgot")
  @ApiResponse({
    description: "We have e-mailed your Verification Code .",
    status: HttpStatus.OK,
  })
  async passwordForgot(
    @Query() query: LanguageDto,
    @Body(new DtoValidationPipe()) passwordForgotDto: PasswordForgotDto
  ) {
    const existUser = await this.authService.getUserByEmail(passwordForgotDto);
    if (!existUser) {
      throw new ValidationException([
        {
          field: "identifier",
          message: await this.i18n.t("validation.COMMON.USER_NOT_FOUND", {
            lang: query.lang,
          }),
        },
      ]);
    }
    const [token] = await this.authService.passwordForgotOtp(
      passwordForgotDto,
      query.lang
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: "We have e-mailed your Verification Code",
      data: { token },
      error: {},
    });
  }

  @Put("reset-pwd-req-otp-check/:token")
  async resetPWDWithOtpCheck(
    @Param() param: UriTokenIdDTO,
    @Query() query: LanguageDto,
    @Body() passwordForgotTokenOtp: PasswordForgotTokenOtpCheckDto
  ) {
    const c = await this.authService.resetPWDWithOtpCheck(
      param.token,
      passwordForgotTokenOtp,
      query.lang
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: "Otp Has been verified ",
      data: { ...c },
      error: {},
    });
  }

  @Get("reset-pwd-req-token-check/:token")
  async resetPWDWithTokenCheck(@Param() param: UriTokenIdDTO) {
    const c = await this.authService.resetPWDWithTokenCheck(param.token);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: "Token Has been verified ",
      data: c,
      error: {},
    });
  }

  @Put("reset-pwd-req/:token")
  async resetPWDWithOtpToken(
    @Param() param: UriTokenIdDTO,
    @Query() query: LanguageDto,
    @Body() userPWDResetDTO: PasswordForgotTokenDto
  ) {
    const c = await this.authService.resetPWDWithOtpToken(
      param.token,
      userPWDResetDTO,
      query.lang
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: "Password Has been Changes Please login ",
      data: { ...c },
      error: {},
    });
  }

 
}
