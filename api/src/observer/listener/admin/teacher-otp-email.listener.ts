import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { TeacherOtpEmailEvent } from "src/observer/event/teacher/teacher-otp-email.event";
import { MailService } from "../../../module/mail/mail.service";

export const TEACHER_OTP_EMAIL_LISTENER = "teacher.otp.email";
@Injectable()
export class TeacherOtpEmailListener {
  constructor(public readonly mailService: MailService) {}

  @OnEvent(TEACHER_OTP_EMAIL_LISTENER)
  handleTeacherOtpEmailEvent(event: TeacherOtpEmailEvent) {
    this.mailService.teacherOtpMail(
      event.name_bn,
      event.receiver_email,
      event.receiver_name,
      event.code
    );
  }
}
