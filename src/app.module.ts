import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AdminModule } from "./module/admin/admin.module";
import { PublicModule } from "./module/public/public.module";
import { I18nModule, AcceptLanguageResolver, QueryResolver } from "nestjs-i18n";
import * as path from "path";
import { LogApiGatewayRequestResponseEntity } from "./common/shared/log-api-gateway-request-response.entity";
import { RedisModule } from "nestjs-redis";
import { MailModule } from "./module/mail/mail.module";
import { HttpExceptionFilter } from "./common/shared/filters/http-exception.filter";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ObserverModule } from "./observer/observer.module";
import { PayloadLoggingInterceptor } from "./common/interceptors/payload-logging.interceptor";
@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      insecureAuth: false,
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      synchronize:
        process.env.SYNCHRONIZE && process.env.SYNCHRONIZE === "true",
      logging: ["error"], // IF true THEN WILL LOG DATABASE SCHEMA
      dropSchema: false,
      entities: ["dist/**/*.entity.js"],
      extra: {
        charset: "utf8_general_ci",
      },
    }),
    TypeOrmModule.forFeature([LogApiGatewayRequestResponseEntity]),
    RedisModule.register([
      {
        url: process.env.REDIS_SESSION,
        name: "REDIS_SESSION",
      },
      {
        url: process.env.REDIS_TMP_FILE,
        name: "REDIS_TMP_FILE",
      },
      {
        url: process.env.REDIS_REGISTER,
        name: "REDIS_REGISTER",
      },
      ,
    ]),
    AdminModule,
    PublicModule,
    MailModule,
    ObserverModule,
    I18nModule.forRoot({
      fallbackLanguage: "en",
      fallbacks: {
        "en-*": "en",
        "fr-*": "fr",
        "bn-*": "bn",
      },
      loaderOptions: {
        path: path.join(__dirname, "../src/i18n/"),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ["lang"] },
        AcceptLanguageResolver,
      ],
    }),
  ],

  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: PayloadLoggingInterceptor,
    // },
  ],
})
export class AppModule {}
