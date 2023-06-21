import { Column, Entity, ManyToOne } from "typeorm";
import { CommonEntity } from "../../../../common/common.entity";
import { UserEntity } from "src/common/entity/users/admin/user.entity";

@Entity("user_login_code")
export class UserLoginCodeEntity extends CommonEntity {
  @Column()
  userId: string;
  @ManyToOne((type) => UserEntity, (user) => user.codes)
  user: UserEntity;
  @Column({ type: String, nullable: true })
  is_used: string;
  @Column({ nullable: true, type: "datetime" })
  expired: string;
}
