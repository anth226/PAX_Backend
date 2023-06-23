import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";

export const LmsModuleList = [AuthModule];
@Module({
  imports: LmsModuleList,
  controllers: [],
})
export class LmsModule {}
