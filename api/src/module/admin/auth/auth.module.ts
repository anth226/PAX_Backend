import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../../common/entity/users/admin/user.entity";
import { AdminAuthController } from "./controllers/auth/auth.controller";
import { AdminAuthService } from "./services/auth.service";
import { ADMIN_JWT_SECRET } from "../../../common/configs/config";
import { PasswordResetsEntity } from "../../../common/shared/password-reset/password-resets.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PasswordResetsEntity]),
    JwtModule.register({
      secret: ADMIN_JWT_SECRET,
      signOptions: { expiresIn: "1" },
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService],
})
export class AdminAuthModule {}
