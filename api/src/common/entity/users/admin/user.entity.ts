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
import { UserLoginCodeEntity } from "src/module/admin/auth/entity/user-login-code.entity";

@Entity("users")
export class UserEntity extends CommonEntity {
  @Column({ nullable: true })
  phone: string;
  @Column({ type: String, nullable: true })
  email: string;
  @Column({ nullable: true })
  password: string;
  @Column({ nullable: true })
  username: string;

  @Column({
    nullable: true,
    // type: "set",
    // enum: AdminUserTypeEnum,
    // default: AdminUserTypeEnum.ADDITIONALDIRECTOR,
  })
  user_type: string;
  @Column({ type: "varchar", nullable: true })
  individualAccount: string;
  @JoinColumn({ name: "employeeId" })
  employee: string;
  @Column({ nullable: true })
  photo: string;
  @Column({ nullable: true })
  namePreferred: string;
  @Column({ nullable: true })
  namePrefix: string;
  @Column({ nullable: true })
  nameFirst: string;
  @Column({ nullable: true })
  nameMiddle: string;
  @Column({ nullable: true })
  nameLast: string;
  @Column({ nullable: true })
  nameSuffix: string;
  @OneToMany((type) => UserLoginCodeEntity, (code) => code.id)
  codes: UserLoginCodeEntity[];
}
