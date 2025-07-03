// 

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { User } from "../user/user.entities";
import { Transaction } from "../transaction/transaction.entity";
import { BankDetails } from "./bank-details.entity";

export const OnboardingStep = {
  NOT_STARTED: "NOT_STARTED",
  BUSINESS_SETUP: "BUSINESS_SETUP",
  ACCOUNT_SETUP: "ACCOUNT_SETUP",
  APPROVED: "APPROVED",
} as const;

export type OnboardingStep = keyof typeof OnboardingStep;

@Entity("businesses")
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column({ length: 20 })
  phone_number: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({
    type: "enum",
    enum: Object.values(OnboardingStep),
    default: OnboardingStep.NOT_STARTED,
  })
  onboarding_step: OnboardingStep;

  // Blockchain wallet address
  @Column({ nullable: true, length: 42 })
  wallet_address: string;

  // Blockchain wallet ID from BlockRadar
  @Column({ nullable: true, length: 36 })
  address_id: string;

  // Category relationship
  @ManyToOne(() => Category, (category) => category.businesses, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @Column({ nullable: true })
  category_id: string;

  // Owner relationship
  @ManyToOne(() => User)
  @JoinColumn({ name: "ownerId" })
  owner: User;

  @Column()
  owner_id: string;

  // Bank details relationship
  @OneToOne(() => BankDetails, (bankDetails) => bankDetails.business, {
    eager: true,
    cascade: true,
  })
  bankDetails: BankDetails;

  @Column({ default: false })
  is_active: boolean;

  @UpdateDateColumn()
  update_at: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.business)
  transactions: Transaction[];

  @CreateDateColumn()
  created_on: Date
}