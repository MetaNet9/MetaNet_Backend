// seller.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    OneToMany
  } from 'typeorm';
  import { User } from 'src/users/user.entity';
  import { Transaction } from 'src/transaction/entities/transaction.entity';
  
  @Entity('seller')
  export class Seller {
    @PrimaryGeneratedColumn()
    id: number;
  
    @OneToOne(() => User, (user) => user.seller)
    @JoinColumn()
    user: User;  // Reference to the associated user
  
    @Column({ type: 'varchar', length: 255 })
    displayName: string;
  
    @Column({ type: 'text' })
    biography: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    profilePicture: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    personalWebsite: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    twitterUsername: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    facebookUsername: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    linkedInUsername: string;
  
    @Column('simple-array')
    skills: string[];
  
    @Column({ type: 'varchar', length: 15, nullable: true })
    contactNumber: string;
  
    @Column({ type: 'varchar', length: 255 })
    email: string;
  
    @Column({ type: 'varchar', length: 255 })
    password: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @Column({ type: 'varchar', length: 255 })
    bankName: string;
  
    @Column({ type: 'varchar', length: 255 })
    accountNumber: string;
  
    @Column({ type: 'varchar', length: 255 })
    branch: string;
  
    @Column({ type: 'varchar', length: 255 })
    accountName: string;

    // make a column to save account balance. default is 0
    @Column({ type: 'float', default: 0 })
    accountBalance: number;

    @OneToMany(() => Transaction, (transaction) => transaction.seller)
    transactions: Transaction[];
    
  }
  