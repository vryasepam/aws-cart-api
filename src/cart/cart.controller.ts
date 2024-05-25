import { Controller, Get, Delete, Put, Body, Req, Post, HttpStatus } from '@nestjs/common';

import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { CartService, CartItemService } from "./services";
import { DataSource } from 'typeorm';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private dataSource: DataSource,
    private cartService: CartService,
    private cartItemService: CartItemService,
    private orderService: OrderService
  ) {}

  @Get()
  async findUserCart(@Req() req: AppRequest) {
    const cart = await this.cartService.findOrCreateByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart },
    };
  }

  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body) {
    // TODO: validate body payload...
    const userId = getUserIdFromRequest(req);
    const { action, productId } = body;

    let cart = await this.cartService.findOrCreateByUserId(userId);

    if (action === 'add') {
      await this.cartItemService.increaseOrAdd(cart, productId);
    }
    if (action === 'reduce') {
      await this.cartItemService.reduceOrDelete(cart, productId);
    }

    cart = await this.cartService.findById(cart.id);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart },
    };
  }

  @Delete()
  async clearUserCart(@Req() req: AppRequest) {
    await this.cartService.removeByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body) {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);

    if (!cart?.Items?.length) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode;
      return {
        statusCode,
        message: 'Cart is empty',
      };
    }

    const order = await this.dataSource.transaction(async (transactionEntityManager) => {
      await this.cartService.completeByUserId(transactionEntityManager, userId);
      return await this.orderService.create(transactionEntityManager, cart);
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order },
    };
  }
}