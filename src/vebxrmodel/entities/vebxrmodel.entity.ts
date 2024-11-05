import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vebxrmodel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column()
  tags: string;

  @Column({ default: 'No' })
  downloadType: string;

  @Column({ nullable: true })
  triangleCount: number;

  @Column({ nullable: true })
  format: string;

  @Column({ nullable: true })
  license: string;

  @Column({ nullable: true })
  vertices: number;

  @Column({ nullable: true })
  textures: string;

  @Column({ nullable: true })
  uvLayers: number;

  @Column({ nullable: true })
  materials: string;

  @Column({ default: false })
  pbr: boolean;

  @Column({ default: false })
  animation: boolean;

  @Column({ default: false })
  vertexColors: boolean;

  @Column({ default: false })
  riggedGeometry: boolean;

  @Column({ default: false })
  morphGeometry: boolean;
}
