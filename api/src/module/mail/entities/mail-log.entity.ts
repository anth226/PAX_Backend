import { CommonEntity } from "src/common/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: "mail_logs" })
export class MailLogEntity extends CommonEntity {
  @Column({ type: "json", nullable: true })
  success: string;

  @Column({ type: "json", nullable: true })
  error: string;

  @Column({
    type: "longtext",
    nullable: true,
  })
  message: string;

  @Column({ nullable: true })
  email_sent_to: string;
}
