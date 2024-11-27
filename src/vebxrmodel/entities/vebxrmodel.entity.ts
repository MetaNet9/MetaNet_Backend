import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Double } from 'typeorm';
import { Category } from 'src/category/category.entity';

@Entity()
export class Vebxrmodel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  modelUrl: string;

  @ManyToOne(() => Category, (category) => category.models)
  @JoinColumn({ name: 'categoryId' }) // Optionally set a custom column name
  category: Category; // Category relationship

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

  @Column()
  modelOwner: number;

  @Column({ type: 'float', default: 0 })
  price: number;

  // total downloads
  @Column({ default: 0 })
  downloads: number;

  // total likes
  @Column({ default: 0 })
  likes: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

}
