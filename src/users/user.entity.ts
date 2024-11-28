// users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn  } from 'typeorm';
import { Seller } from 'src/seller/entities/seller.entity';

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  SELLER = 'seller',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({
    type: 'simple-array',
    default: UserRole.USER,
  })
  roles: UserRole[];

  @OneToOne(() => Seller, (seller) => seller.user, { nullable: true })
  @JoinColumn()
  seller: Seller | null;  // Optional relationship with Seller

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ nullable: true })
  contactNo: string;

}
