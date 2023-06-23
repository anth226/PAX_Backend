import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MailService } from "../../../module/mail/mail.service";
import { UserLoginOtpEvent } from "src/observer/event/admin/user-login-otp.event";


export const USER_LOGIN_OTP_LISTENER = "user.login.otp";

@Injectable()
export class UserLoginOtpListener {
  constructor(public readonly mailService: MailService) {}

  @OnEvent(USER_LOGIN_OTP_LISTENER)
  handleAdminUserLoginOtpEvent(event: UserLoginOtpEvent) {
    this.mailService.userLoginMail(
      event.receiver_email,
      event.receiver_name,
      event.reset_code
    );
  }
}
