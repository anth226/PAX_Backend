import { Module } from "@nestjs/common";

import { AdminModule } from "../admin/admin.module";

export const PublicModuleList = [AdminModule];
@Module({
  imports: PublicModuleList,
})
export class PublicModule {}
