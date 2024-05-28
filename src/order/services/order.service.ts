import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Order } from '../entities';
import { Cart } from 'src/cart/entities';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>
  ) {}

  async findById(orderId: string): Promise<Order> {
    return await this.orderRepository.findOne({ where: { id: orderId }, relations: { Cart: true } });
  }

  async create(entityManager: EntityManager, Cart: Cart): Promise<Order> {
    const { id } = await entityManager
      .create(Order, { User: { id: Cart.User.id }, Cart, payment: {}, delivery: {} })
      .save();

    return await entityManager.findOne(Order, { where: { id }, relations: { Cart: true } });
  }
}