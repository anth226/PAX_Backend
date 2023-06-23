import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MailService } from "../../../module/mail/mail.service";
import { UserResetPasswordEvent } from "../../../observer/event/admin/admin-reset-password.event";


export const USER_RESET_PASSWORD_LISTENER = "user.reset.password";

@Injectable()
export class UserResetPasswordListener {
  constructor(public readonly mailService: MailService) {}

  @OnEvent(USER_RESET_PASSWORD_LISTENER)
  handleAdminResetPasswordEvent(event: UserResetPasswordEvent) {
    this.mailService.adminResetPasswordMail(
      event.id,
      event.receiver_email,
      event.receiver_name,
      event.reset_code
    );
  }
}
