import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, BaseEntity } from 'typeorm';
import { Item } from './Item';
import { Order } from './Order';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @OneToMany(() => Order, order => order.user)
  orders: Order[]

  @Column()
  username: string

  @Column()
  password: string
}

