import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { join } from "path";
import { ConfigService } from "@nestjs/config";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailLogEntity } from "./entities/mail-log.entity";
import { TwingAdapter } from "src/adapters/twing.adapter";
@Module({
  imports: [
    TypeOrmModule.forFeature([MailLogEntity]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get("MAIL_HOST"),
          secure: false,
          auth: {
            user: config.get("MAIL_USER"),
            pass: config.get("MAIL_PASSWORD"),
          },
        },
        defaults: {
          from: `"Islamic Foundation" <${config.get("MAIL_FROM")}>`,
        },
        template: {
          dir: `${process.cwd()}/templates/`,
          adapter: new TwingAdapter(),
        },
        // template: {
        //   dir: join(__dirname, "./templates"),
        //   adapter: new HandlebarsAdapter(),
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService, ConfigService],
  exports: [MailService],
})
export class MailModule {}
