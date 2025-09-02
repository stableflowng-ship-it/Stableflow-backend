// 
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from "typeorm";
import { Business } from "../business/business.entity";
// Commenting out import since offramp is in skeleton form
// import { OfframpAttempt } from './offramp-attempt.entity';

export enum TransactionStatus {
  UNSETTLED = "UNSETTLED", // Transaction received but not processed
  PROCESSING = "PROCESSING", // Transaction is being processed
  SETTLED = "SETTLED", // Transaction successfully processed and settled
  FAILED = "FAILED", // Transaction processing failed
  REFUNDED = "REFUNDED", // Transaction was refunded
  EXPIRED = "EXPIRED"
}

export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  OFFRAMP = "OFFRAMP",
}

@Entity({ name: "transactions" })
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'OFFRAMP';

  @Column({ nullable: false, unique: true })
  @Index()
  transaction_id: string;

  @Column({ nullable: true }) // remove the nullable in new db
  reference: string

  @Column({ nullable: false })
  business_id: string;

  @Column({ type: "float", default: 0 })
  token_amount: number;

  @Column({ type: "float", nullable: true })
  fiat_amount: number;

  @Column({ nullable: true })
  fiat_currency: string;

  @Column()
  token: string;

  @Column()
  token_logo: string;

  @Column({ nullable: false })
  chain: string;

  @Column({
    default: TransactionStatus.UNSETTLED,
  })
  status: string;

  @Column({ nullable: true })
  txHash: string;

  @Column({ nullable: true })
  gatewayTxId: string;

  @Column({ nullable: true })
  senderAddress: string;

  @Column({ nullable: true })
  businessAddress: string;

  @Column({ nullable: true })
  address_id: string;

  @Column({ nullable: true })
  wallet_id: string;

  @Column({ type: "float", nullable: true })
  exchange_rate: number;

  @Column({ nullable: true })
  settlement_provider: string;

  @Column({ nullable: true })
  settlementReference: string;

  @Column({ nullable: true })
  offrampOrderId: string;

  @Column({ default: false })
  isSettled: boolean;

  @Column({ nullable: true })
  settledAt: Date;

  @Column({ nullable: true })
  processedAt: Date;

  @Column({ type: "jsonb", nullable: true })
  metadata: any;

  @Column({ nullable: true, type: "jsonb" })
  settlementData: any;

  @CreateDateColumn()
  receivedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Business)
  @JoinColumn({ name: "business_id" })
  business: Business;
}
