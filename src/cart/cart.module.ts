import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartItemService, CartService } from './services';
import { Cart, CartItem } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), OrderModule],
  providers: [CartService, CartItemService],
  controllers: [CartController],
})
export class CartModule { }