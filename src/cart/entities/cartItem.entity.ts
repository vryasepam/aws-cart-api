import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';

@Entity({ name: 'cart_items' })
export class CartItem extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'product_id', nullable: false })
    productId: string;

    @Column({ type: 'int', nullable: false, default: 0 })
    count: number;

    @ManyToOne(
        () => Cart,
        (cart) => cart.Items,
        { nullable: false, onDelete: 'CASCADE', orphanedRowAction: 'delete' }
    )
    @JoinColumn({ name: 'cart_id' })
    Cart: Cart;
}
