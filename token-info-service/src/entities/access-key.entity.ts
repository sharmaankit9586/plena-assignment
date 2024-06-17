import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AccessKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @Column()
  rateLimit: number;

  @Column()
  expiration: Date;

  @Column()
  userId: string;

  @Column({ default: true })
  isActive: boolean
}
