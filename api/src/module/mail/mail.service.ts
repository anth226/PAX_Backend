import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
// import { MailParserDto } from './dto/mail-parser.dto';
import { InjectRepository } from "@nestjs/typeorm";
// import { MailLogDto } from './dto/mail-log.dto';
import { Repository } from "typeorm";
import { MailLogEntity } from "./entities/mail-log.entity";
@Injectable()
export class MailService {
  constructor(
    private mailServer: MailerService,
    @InjectRepository(MailLogEntity)
    private readonly mailLogRepository: Repository<MailLogEntity>, // private readonly requestService: RequestService,
    private mailerService: MailerService
  ) {}
  async sendEmailToUser(
    userRegistration: any,
    password: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    Employee_details: {}
  ) {
    this.sendMail(userRegistration, password, Employee_details);
  }

  adminResetPasswordMail(
    id: string,
    receiver_email: string,
    receiver_name: string,
    reset_code: number
  ) {
    const actionUrl =
      process.env.WEBSITE_LINK + "/forgot-password/" + id + "/reset";

    this.mailerService
      .sendMail({
        to: receiver_email,
        // from: '', // by default it comes from .env MAIL_FROM_NAME file
        subject: "OTP For reset password ",
        template: "admin-reset-password-mail",
        context: {
          receiver_name,
          reset_code,
          actionUrl,
        },
      })
      .then(async (res) => {
        await this.mailLogRepository.save({
          email_sent_to: receiver_email,
          message: "OTP For reset password ",
          success: JSON.stringify(res?.response),
          error: null,
        });
      })
      .catch(async (err) => {
        await this.mailLogRepository.save({
          email_sent_to: receiver_email,
          message: "OTP For reset password ",
          success: null,
          error: JSON.stringify(err?.response),
        });
      });
  }

  async sendMail(
    userRegistration: any,
    password: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    Employee_details: {}
  ) {
    try {
      const res = await this.mailerService.sendMail({
        to: userRegistration.email,
        subject: "নতুন ব্যবহারকারীর জন্য নিবন্ধন",
        // generateTextFromHTML: true,
        html: `
           <body style="background: #e2efd9; padding: 50px; ">
           <p>স্বাগত, ${Employee_details["name_bn"]}</p>
                <p>  মসজিদ ভিত্তিক শিশু এবং গণশিক্ষা কার্যক্রম সফটওয়্যার এ আপনাকে স্বাগতম | <br/>
                 আপনার লগইন তথ্য হচ্ছে নিন্মরূপঃ <br/>
          </p>
                 <b>লিংক: ${
                   process.env.WEBSITE_LINK ?? "http://3.109.139.226:3006/"
                 }login</b><br/>
                 <b>ইমেইল:  ${userRegistration.email}</b><br/>
                 <b>ফোন নম্বর: ${userRegistration.phone}</b><br/> 
                 <b>পাসওয়ার্ড: ${password}</b><br/>
          <h4><b style="color:red"> বিঃদ্রঃ সফলভাবে লগইন করার পরে নিরাপত্তার স্বার্থে দয়াকরে আপনার পাসওয়ার্ড পরিবর্তন করে নিন।</b></h4>
           </body>
          `,
      });
      await this.mailLogRepository.save({
        email_sent_to: userRegistration.email,
        message: "নতুন ব্যবহারকারীর জন্য নিবন্ধন ",
        success: JSON.stringify(res),
        error: null,
      });
    } catch (err) {
      await this.mailLogRepository.save({
        email_sent_to: userRegistration.email,
        message: "নতুন ব্যবহারকারীর জন্য নিবন্ধন ",
        error: JSON.stringify(err?.response),
        success: null,
      });
    }
  }

  ///Email Notification For Otp Login User

  userLoginMail(
    receiver_email: string,
    receiver_name: string,
    reset_code: number
  ) {
    this.mailerService
      .sendMail({
        to: receiver_email,
        // from: '', // by default it comes from .env MAIL_FROM_NAME file
        subject: "OTP For reset password ",
        template: "admin-reset-password-mail",
        context: {
          receiver_name,
          reset_code,
        },
      })
      .then(async (res) => {
        await this.mailLogRepository.save({
          email_sent_to: receiver_email,
          message: "OTP For reset password ",
          success: JSON.stringify(res?.response),
          error: null,
        });
      })
      .catch(async (err) => {
        await this.mailLogRepository.save({
          email_sent_to: receiver_email,
          message: "OTP For reset password ",
          success: null,
          error: JSON.stringify(err?.response),
        });
      });
  }

}
