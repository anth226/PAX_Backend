import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class CommonEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ default: 1, comment: "" })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column({ default: null })
  created_by: string;

  @Column({ default: null })
  updated_by: string;

  @Column({ default: null })
  deleted_by: string;
}
