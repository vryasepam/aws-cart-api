import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart, CartItem } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>
  ) {}

  async findByCartIdAndProductId(cartId: string, productId: string): Promise<CartItem | null> {
    return await this.cartItemRepository.findOneBy({ Cart: { id: cartId }, productId });
  }

  async addItemToCart(cart: Cart, productId: string): Promise<void> {
    const newCartItem = this.cartItemRepository.create({ productId, count: 1, Cart: { id: cart.id } });

    cart.Items = [...cart.Items, newCartItem];

    await newCartItem.save();
    await cart.save();
  }

  async deleteItemFromCart(cartId: string, productId: string): Promise<void> {
    await this.cartItemRepository.delete({ Cart: { id: cartId }, productId });
  }

  async increaseOrAdd(cart: Cart, productId: string): Promise<void> {
    const item = cart.Items.find((i) => i.productId === productId);

    if (item) {
      item.count += 1;
      await item.save();
    } else {
      await this.addItemToCart(cart, productId);
    }

    cart.updatedAt = new Date();
    await cart.save();
  }

  async reduceOrDelete(cart: Cart, productId: string): Promise<void> {
    const item = cart.Items.find((i) => i.productId === productId);

    if (!item) return;

    if (item.count > 1) {
      item.count -= 1;
      await item.save();
    } else {
      await this.deleteItemFromCart(cart.id, productId);
    }

    cart.updatedAt = new Date();
    await cart.save();
  }
}