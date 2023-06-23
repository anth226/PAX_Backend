import { AdminUserTypeEnum } from "../../../../common/enums/admin/user-type.enum";

export class AdminAuthReturnDto {
  user_id: string;
  userType?: string;
  user_type: string;
  employee_id?: string;
  // userTypes: string[];
  name_en?: string;
  name_bn?: string;
  email: string;
  designation_en?: string;
  designation_bn?: string;
  office_type?: number;
  profile_pic?: string;
  token: string;
  roles: any;
  role: any;
  // eslint-disable-next-line @typescript-eslint/ban-types
  center?: {};
}
