import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { AdminUserTypeEnum } from "../../../enums/admin/user-type.enum";
import { CommonEntity } from "../../../../common/common.entity";


@Entity("admin_users")
export class AdminUserEntity extends CommonEntity {
  @Column({ nullable: false })
  phone: string;

  @Column({ type: String, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    nullable: true,
    // type: "set",
    // enum: AdminUserTypeEnum,
    // default: AdminUserTypeEnum.ADDITIONALDIRECTOR,
  })
  user_type: string;
  @Column({ type: "varchar", nullable: true })
  user_number: string;
  @JoinColumn({ name: "employeeId" })
  employee: string;

  @Column({ nullable: true })
  roleId: string;


}
