import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findOne(name: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { name } });
  }

  async createOne(newUser: { name: string; password: string }): Promise<User> {
    const { name } = await this.userRepository.create(newUser).save();

    return await this.findOne(name);
  }
}