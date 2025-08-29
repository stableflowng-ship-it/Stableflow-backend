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

@Entity()
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

  @Column({ default: false })
  is_active: boolean;

  @Column({
    type: "enum",
    enum: Object.values(OnboardingStep),
    default: OnboardingStep.NOT_STARTED,
  })
  onboarding_step: OnboardingStep;

  // Category relationship
  // @ManyToOne(() => Category, (category) => category.businesses, {
  //   nullable: true,
  //   eager: true,
  // })
  // @JoinColumn({ name: "categoryId" })
  // category: Category;

  @Column({ nullable: true })
  category_id: string;

  @Column({ nullable: true })
  category_name: string;

  // Owner relationship
  @ManyToOne(() => User)
  @JoinColumn({ name: "ownerId" })
  owner: User;

  @Column()
  owner_id: string;

  @OneToMany(() => Transaction, (transaction) => transaction.business)
  transactions: Transaction[];

  // Bank details relationship
  @OneToOne(() => BankDetails, (bankDetails) => bankDetails.business, {
    eager: true,
    cascade: true,
  })
  bankDetails: BankDetails;

  @UpdateDateColumn()
  update_at: Date;

  @CreateDateColumn()
  created_on: Date
}