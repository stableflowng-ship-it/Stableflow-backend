// 
// src/auth/entities/auth.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export const UserType = {
  USER: "USER",
  BUSINESS_OWNER: "BUSINESS_OWNER",
  ADMIN: "ADMIN",
} as const;

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({select: false})
  password: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ default: false })
  is_email_verified: boolean;

  @Column({ default: false })
  is_phone_verified: boolean;

  @Column({ default: UserType.USER })
  account_type: string

  // @Column({ nullable: true })
  // wallet_address: string;

  // @Column({ type: "text", nullable: true })
  // encryptedMnemonic?: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
