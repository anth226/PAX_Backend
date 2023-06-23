import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { PasswordForgotDto } from "../dto/password-forgot.dto";
import { PasswordResetsEntity } from "../../../../common/shared/password-reset/password-resets.entity";
import { PasswordRestDto } from "../dto/password-rest.dto";
import { ResetVerificationDto } from "../dto/reset-verification.dto";
import { I18nService } from "nestjs-i18n";
import { RedisService } from "nestjs-redis";
import { Repository } from "typeorm";
import { ADMIN_JWT_SECRET } from "../../../../common/configs/config";
import { AdminUserDto } from "../../../../common/dto/admin-user.dto";
import { UserEntity } from "../../../../common/entity/users/admin/user.entity";
import { CustomException } from "../../../../common/exceptions/customException";
import getDate from "../../../../common/function/getDate";
import { PasswordForgotTokenDto } from "../dto/PwsResetOtpToken.dto";
import { AdminAuthReturnDto } from "../dto/auth-return.dto";
import { AdminAuthDto } from "../dto/auth.dto";
import { PasswordForgotTokenOtpCheckDto } from "../dto/PwsReseTokenCheck.dto";
import { ValidationException } from "src/common/exceptions/validationException";
import { isActive } from "src/common/queries/is-active-status.query";
import { FindUserByEmailDto } from "../dto/find-user-by-email.dto";
import { FindUserByPasswordDto } from "../dto/find-user-by-password.dto";
import { USER_RESET_PASSWORD_LISTENER } from "../../../../observer/listener/admin/user-reset-password.listener";
import { UserResetPasswordEvent } from "../../../../observer/event/admin/admin-reset-password.event";
import { UserLoginOtpEvent } from "src/observer/event/admin/user-login-otp.event";
import { USER_LOGIN_OTP_LISTENER } from "src/observer/listener/admin/user-login-otp.listener";
@Injectable()
export class AdminAuthService {
  private readonly secrets: string[];
  private readonly algorithm = "aes-256-cbc";
  private readonly salt = process.env.CRYPTO_SALT;
  constructor(
    @InjectRepository(UserEntity)
    private readonly adminUserRepository: Repository<UserEntity>,
    @InjectRepository(PasswordResetsEntity)
    private readonly passwordResetsRepository: Repository<PasswordResetsEntity>,
    private eventEmitter: EventEmitter2,
    private readonly i18n: I18nService,
    private readonly redisService: RedisService
  ) {
    this.secrets = process.env.CRYPTO_SECRET?.split(",");
  }

  async auth(auth: AdminAuthDto): Promise<AdminAuthReturnDto> {
    try {
      //find user with identifier
      const user = await this.adminUserRepository.findOne({
        where: [{ email: auth.identifier }, { phone: auth.identifier }],
      });
      //if not found throw an error
      if (!user) throw new ForbiddenException("User not found");
      //if inactive then throw an error
      // if (user.status === 0)
      //   throw new ForbiddenException(
      //     "You are inactive, please contact with admin"
      //   );
      //check password is valid
      const match = await bcrypt.compare(auth.password, user.password);
      //if not match then throw an error
      if (!match)
        throw new ForbiddenException(
          "Email/Mobile Number or Password doesn't match"
        );
      const token = this.login(user, user.user_type);
      const user_id = user.id;
      return {
        user_id,
        user_type: user.user_type,
        email: user.email,
        token,
        roles: [],
        role: [],
      };
    } catch (error) {
      // throw the error to custom exception
      throw new CustomException(error);
    }
  }

  private login(user: UserEntity, role: string): string {
    const payload = {
      id: user.id,
      user_type: role,
    };
    return jwt.sign(payload, ADMIN_JWT_SECRET);
  }

  async passwordReset(passwordRestDto: PasswordRestDto) {
    try {
      const { id, reset_code, password } = passwordRestDto;
      const findUser = await this.passwordResetsRepository.findOne({
        where: { is_used: 0, id: id },
      });
      if (!findUser) {
        throw new ForbiddenException("User not found");
      }

      if (findUser.reset_code != reset_code) {
        throw new ForbiddenException("OTP not matched. please try another");
      }
      const resetCodeTimeVerification =
        await this.passwordResetsRepository.findOne({
          where: {
            id: id,
            // status: 2,
            //  created_at: Raw(alias=> `${alias} >= 'NOW() - INTERVAL 10 MINUTE'`)
          },
        });

      if (resetCodeTimeVerification) {
        const salt = bcrypt.genSaltSync(10);
        const passwordBcrypt = bcrypt.hashSync(password, salt);
        await this.adminUserRepository.update(
          { id: findUser.userId },
          { password: passwordBcrypt }
        );
        await this.passwordResetsRepository.update({ id: id }, { is_used: 1 });

        const user = await this.adminUserRepository.findOne({
          where: { id: findUser.userId },
        });
      }
    } catch (error) {
      throw new CustomException(error);
    }
  }
  async resetPasswordCodeCheck(
    resetVerificationDto: ResetVerificationDto,
    adminUser: AdminUserDto,
    lang: string
  ) {
    try {
      const { reset_code } = resetVerificationDto;
      const findCode = await this.passwordResetsRepository.findOne({
        where: { is_used: 0, reset_code: reset_code },
      });
      if (!findCode) {
        throw new ForbiddenException(
          await this.i18n.t("validation.COMMON.No_Data", {
            lang,
          })
        );
      }
      if (findCode.reset_code != reset_code) {
        throw new ForbiddenException(
          await this.i18n.t("validation.COMMON.OTP_MESSAGE", {
            lang,
          })
        );
      }
    } catch (error) {
      throw new CustomException(error);
    }
  }
  //Find User By email
  public async getUserByEmail(
    FindUserByEmail: FindUserByEmailDto
  ): Promise<any> {
    const { identifier } = FindUserByEmail;
    const findUser = await this.adminUserRepository.findOne({
      where: { email: identifier },
    });
    // console.log("ffff",findUser);
    return findUser;
  }

  //Find User By password
  public async getUserByPassword(
    FindUserByPassword: FindUserByPasswordDto,
    lang?: string
  ): Promise<any> {
    const { email, password } = FindUserByPassword;
    const user = await this.adminUserRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      console.log("ddd", user);
      new ForbiddenException("ddd doesn't match");
    }
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new ForbiddenException("Password doesn't match");
      if (match) {
        //storing otp in redis server that will expired after 2 minutes//
        const rIndex = Math.floor(
          Math.random() * Math.floor(this.secrets.length)
        );
        const token = crypto
          .createHmac("sha256", this.secrets[rIndex])
          .update(
            JSON.stringify({
              nonce: getDate().getTime(),
              email: user.email,
            })
          )
          .digest("hex");

        const password = this.secrets[rIndex];
        const key = crypto.scryptSync(password, this.salt, 24);
        const iv = crypto.randomBytes(16);
        const otp = `${parseInt(
          crypto.randomBytes(8).toString("hex"),
          16
        )}`.substring(0, 6);
        const newResetOtp = {
          nonce: getDate().getTime(),
          token: token,
          otp: otp,
          email: user.email,
          expire: process.env.EXPIRED_LOGIN_OTP_TIME,
        };

        const status = await this.redisService
          .getClient("REDIS_REGISTER")
          .set(
            token,
            JSON.stringify(newResetOtp),
            "EX",
            process.env.EXPIRED_LOGIN_OTP_TIME
          );
        ///storing otp in redis server that will expired after 2 minutes//
        this.eventEmitter.emit(
          USER_LOGIN_OTP_LISTENER,
          new UserLoginOtpEvent({
            receiver_email: newResetOtp.email,
            reset_code: otp,
          })
        );
      }
      return true;
    } else {
      return false;
    }
  }

  async passwordForgotOtp(
    passwordForgotDto: PasswordForgotDto,
    lang?: string
  ): Promise<[string]> {
    const rIndex = Math.floor(Math.random() * Math.floor(this.secrets.length));
    const token = crypto
      .createHmac("sha256", this.secrets[rIndex])
      .update(
        JSON.stringify({
          nonce: getDate().getTime(),
          email: passwordForgotDto.identifier,
        })
      )
      .digest("hex");

    const password = this.secrets[rIndex];
    const key = crypto.scryptSync(password, this.salt, 24);
    const iv = crypto.randomBytes(16);
    const otp = `${parseInt(
      crypto.randomBytes(8).toString("hex"),
      16
    )}`.substring(0, 6);
    const newResetOtp = {
      nonce: getDate().getTime(),
      token: token,
      otp: otp,
      email: passwordForgotDto.identifier,
      expire: process.env.EXPIRED_RESET_TIME,
    };

    const status = await this.redisService
      .getClient("REDIS_REGISTER")
      .set(
        token,
        JSON.stringify(newResetOtp),
        "EX",
        process.env.EXPIRED_RESET_TIME
      );
    this.eventEmitter.emit(
      USER_RESET_PASSWORD_LISTENER,
      new UserResetPasswordEvent({
        id: newResetOtp.token,
        receiver_email: newResetOtp.email,
        reset_code: otp,
      })
    );

    if (status !== "OK") {
      throw new BadRequestException(`${token} not found`);
    }
    return [token];
  }

  async resetPWDWithOtpToken(
    id: string,
    userPwdChangeReq: PasswordForgotTokenDto,
    lang?: string
  ): Promise<any> {
    try {
      const encStr = await this.redisService
        .getClient("REDIS_REGISTER")
        .get(id);
      const redisData = JSON.parse(encStr);
      if (!encStr) {
        throw new NotFoundException(
          await this.i18n.translate("validation.COMMON.TOKEN_SESSION_EXPIRED", {
            lang: lang,
          })
        );
      }
      if (redisData.otp === userPwdChangeReq.otp) {
        const userInfo = await this.adminUserRepository.findOne({
          where: { email: redisData.email },
        });
        if (!userInfo) {
          throw new NotFoundException(
            await this.i18n.translate("validation.COMMON.USER_NOT_FOUND", {
              lang: lang,
            })
          );
        }
        try {
          const updateAt = new Date();
          const userUpdate = await this.adminUserRepository.update(
            { id: userInfo.id },
            {
              password: await bcrypt.hash(userPwdChangeReq.password, 12),
              updated_by: userInfo.id,
              updated_at: updateAt,
            }
          );

          await this.redisService.getClient("REDIS_REGISTER").del(id);
          return {
            id: userInfo.id,
            updateAt: updateAt,
            updateBy: userInfo.id,
            email: userInfo.email,
          };
        } catch (error) {
          throw new CustomException(error);
        }
      }
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async resetPWDWithOtpCheck(
    id: string,
    passwordForgotTokenOtpCheckDto: PasswordForgotTokenOtpCheckDto,
    lang?: string
  ): Promise<any> {
    const encStr = await this.redisService.getClient("REDIS_REGISTER").get(id);
    const redisData = JSON.parse(encStr);
    if (!encStr) {
      //sorry for app work i give validation Exception instead  we now give validation
      throw new ValidationException([
        {
          field: "password",
          message: await this.i18n.t("validation.COMMON.OTP_NOT_MATCH_MSG", {
            lang: lang,
          }),
        },
      ]);
    }
    if (redisData.otp === passwordForgotTokenOtpCheckDto.otp) {
      try {
        return {
          otp: redisData.otp,
          email: redisData.email,
          token: redisData.token,
        };
      } catch (error) {
        throw new CustomException(error);
      }
    } else {
      throw new ValidationException([
        {
          field: "otp",
          message: await this.i18n.t("validation.COMMON.OTP_NOT_MATCH_MSG", {
            lang: lang,
          }),
        },
      ]);
    }
  }
  async resetPWDWithTokenCheck(id: string): Promise<any> {
    try {
      const encStr = await this.redisService
        .getClient("REDIS_REGISTER")
        .get(id);
      const redisData = JSON.parse(encStr);
      if (!encStr) {
        return false;
      }
      try {
        return true;
      } catch (error) {
        throw new CustomException(error);
      }

      throw new BadRequestException(
        await this.i18n.translate("validation.COMMON.OTP_NOT_MATCH_MSG")
      );
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
