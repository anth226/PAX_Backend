import { AdminUserTypeEnum } from "../enums/admin/user-type.enum";

export class AdminUserDto {
  readonly id: string;
  readonly user_type: AdminUserTypeEnum;
  readonly email: string;
}
