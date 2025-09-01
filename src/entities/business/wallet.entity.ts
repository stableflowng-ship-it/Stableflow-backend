// 

import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Business } from "./business.entity";
import { CoinNetwork, CoinType } from "../../utils/dataTypes/wallet.datatype";

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  coin_type: CoinType

  @Column()
  logoUrl: string

  @Column()
  network: CoinNetwork

  @Column({ type: 'float', default: 0 })
  amount: number

  // Blockchain wallet address
  @Column({ length: 42, unique: true })
  wallet_address: string;

  // Blockchain wallet ID from BlockRadar
  @Column({ length: 36, unique: true })
  address_id: string;

  @Column({ type: 'jsonb', nullable: true })
  blockchain: any

  @ManyToOne(() => Business)
  business: Business

  @Column({ type: 'uuid' })
  business_id: string

  @CreateDateColumn()
  created_on: Date
}