import { Module } from "@nestjs/common";
import { AdminAuthModule } from "./auth/auth.module";

export const AdminModuleList = [
  AdminAuthModule,
];
@Module({
  imports: AdminModuleList,
  controllers: [],
})
export class AdminModule {}
