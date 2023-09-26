import "dotenv/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "../app.module";
import ModuleList from "./module-list";

export default async function swagger(app) {
  for (const ModuleItem of ModuleList) {
    //swagger config
    const config = new DocumentBuilder()
      .setTitle("NOTE Crude")
      .setDescription("NOTE Crude API description")
      .setVersion("1.0")
      .addBearerAuth(
        { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        "JWT"
      )
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      include: [...ModuleItem.Module],
    });
    SwaggerModule.setup(
      "api-doc/" + ModuleItem.url.trim().replace(/^\//, ""),
      app,
      document,
      {
        swaggerOptions: {
          persistAuthorization: true,
        },
      }
    );
  }
}
