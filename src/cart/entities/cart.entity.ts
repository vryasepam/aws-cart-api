import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { CartItem } from './cartItem.entity';
import { User } from 'src/users';

export enum CartStatus {
    OPEN = 'OPEN',
    ORDERED = 'ORDERED',
}

@Entity({ name: 'carts' })
export class Cart extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    User: User;

    @Column({ type: 'timestamp', name: 'created_at', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', name: 'updated_at', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'enum', enum: CartStatus, default: CartStatus.OPEN })
    status: CartStatus;

    @OneToMany(
        () => CartItem,
        (cartItem) => cartItem.Cart
    )
    Items: CartItem[];
}
