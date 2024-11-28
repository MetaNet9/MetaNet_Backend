import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('models')
export class ModelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column('jsonb')
  parameters: any;

  @Column()
  valid: boolean;
}
