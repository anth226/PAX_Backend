import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";
import { MailLogEntity } from "src/module/mail/entities/mail-log.entity";
import { MailService } from "src/module/mail/mail.service";
import { UserResetPasswordListener } from "./listener/admin/user-reset-password.listener";
import { UserLoginOtpListener } from "./listener/admin/user-login-otp.listener";

@Module({
  imports: [TypeOrmModule.forFeature([MailLogEntity])],
  providers: [
    //listeners
    UserResetPasswordListener,
    UserLoginOtpListener,
    //service
    MailService,
  ],
})
export class ObserverModule {}
