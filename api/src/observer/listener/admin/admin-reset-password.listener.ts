import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MailService } from "../../../module/mail/mail.service";
import { AdminResetPasswordEvent } from "../../../observer/event/admin/admin-reset-password.event";


export const ADMIN_RESET_PASSWORD_LISTENER = "admin.reset.password";

@Injectable()
export class AdminResetPasswordListener {
  constructor(public readonly mailService: MailService) {}

  @OnEvent(ADMIN_RESET_PASSWORD_LISTENER)
  handleAdminResetPasswordEvent(event: AdminResetPasswordEvent) {
    this.mailService.adminResetPasswordMail(
      event.id,
      event.receiver_email,
      event.receiver_name,
      event.reset_code
    );
  }
}
