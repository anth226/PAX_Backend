import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("password_resets")
export class PasswordResetsEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column()
  user_type: string;

  @Column()
  reset_code: number;

  @Column()
  is_used: number;

  @Column({ type: "datetime", nullable: true })
  created_at: Date;

  @Column({ type: "datetime", nullable: true })
  updated_at: Date;
}
