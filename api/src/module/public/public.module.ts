import { Module } from "@nestjs/common";
import { LmsModule } from "../lms/lms.module";

export const PublicModuleList = [LmsModule];
@Module({
  imports: PublicModuleList,
})
export class PublicModule {}
