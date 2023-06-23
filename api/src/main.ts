import "dotenv/config";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DataTransformGlobalPipe } from "./common/pipes/dataTransformGlobalPipe";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import swagger from "./swagger/swagger";
import {
  i18nValidationErrorFactory,
  I18nValidationPipe,
  I18nValidationExceptionFilter,
  I18nService,
} from "nestjs-i18n";
import { HttpExceptionFilter } from "./common/shared/filters/http-exception.filter";
import { PublicModule } from "./module/public/public.module";

async function bootstrap() {
  const port = process.env.PORT;
  const host = process.env.SYSTEM_HOST;
  const app = await NestFactory.create(AppModule);
  let i18n: I18nService;
  const options = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };

  app.useGlobalPipes(new DataTransformGlobalPipe(), new I18nValidationPipe());
  // app.useGlobalFilters(
  //   new I18nValidationExceptionFilter());

  app.setGlobalPrefix("api");
  app.enableCors(options);
  const config = new DocumentBuilder()
    .setTitle("Islamic Foundation")
    .setDescription("Islamic Foundation API description")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "JWT"
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-doc/", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const secondOptions = new DocumentBuilder()
    .setTitle("Islamic Foundation Landing Page")
    .setDescription("Islamic Foundation API description")
    .setVersion("1.0")
    .build();

  const dogDocument = SwaggerModule.createDocument(app, secondOptions, {
    include: [PublicModule],
  });
  SwaggerModule.setup("api/landing", app, dogDocument);

  await swagger(app);

  await app.listen(port);
  Logger.log(
    `Server is Running(🔥) on http://${host}:${port}/api-doc/lms`,
    "Islamic Foundation -BackendServer"
  );
}
bootstrap();
