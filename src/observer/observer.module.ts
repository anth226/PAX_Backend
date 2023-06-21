import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";
import { MailLogEntity } from "src/module/mail/entities/mail-log.entity";
import { MailService } from "src/module/mail/mail.service";
import { AdminResetPasswordListener } from "./listener/admin/admin-reset-password.listener";
import { TeacherOtpEmailListener } from "./listener/admin/teacher-otp-email.listener";

@Module({
  imports: [TypeOrmModule.forFeature([MailLogEntity])],
  providers: [
    //listeners
    AdminResetPasswordListener,
    TeacherOtpEmailListener,
    //service
    MailService,
  ],
})
export class ObserverModule {}
