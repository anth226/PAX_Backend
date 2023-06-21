import { Column, Entity } from "typeorm";
import { CommonEntity } from "../../../common.entity";
@Entity("contact-us")
export class ContactUsEntity extends CommonEntity {
  @Column({ type: String, nullable: true })
  name: string;
  @Column({ type: String, nullable: true })
  email: string;
  @Column({ type: String, nullable: true })
  message: string;
}
