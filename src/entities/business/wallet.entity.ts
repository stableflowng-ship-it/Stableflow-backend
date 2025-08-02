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
  network: CoinNetwork

  // Blockchain wallet address
  @Column({ length: 42 })
  wallet_address: string;

  // Blockchain wallet ID from BlockRadar
  @Column({ length: 36 })
  address_id: string;

  @ManyToOne(() => Business)
  business: Business

  @Column({ type: 'uuid' })
  business_id: string

  @CreateDateColumn()
  created_on: Date
}