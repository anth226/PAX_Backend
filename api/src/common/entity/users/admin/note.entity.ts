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

@Entity("notes")
export class NoteEntity extends CommonEntity {
  @Column({ type: String, nullable: true })
  name: string;
  @Column({ type: String, nullable: true })
  email: string;
  @Column({ type: String, nullable: true })
  message: string;

}
