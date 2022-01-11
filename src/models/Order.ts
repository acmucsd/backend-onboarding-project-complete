import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, BaseEntity } from 'typeorm';
import { Item } from './Item';
import { User } from './User';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @ManyToOne(() => Item)
  item: Item

  @ManyToOne(() => User)
  user: User

  @CreateDateColumn()
  createdAt: number
}