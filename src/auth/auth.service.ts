import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/services/users.service';
import { User } from '../users/entities';

type LoginType = 'jwt' | 'basic' | 'default';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(name: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOne(name);

    // Create new user if not exist
    if (!user) {
      return await this.usersService.createOne({ name, password });
    }

    if (user.password === password) {
      return user;
    }

    return null;
  }

  async login(user: { name: string; password: string }, type: LoginType) {
    const LOGIN_MAP = {
      jwt: this.loginJWT,
      basic: this.loginBasic,
      default: this.loginJWT,
    };
    const login = (LOGIN_MAP[type] ?? LOGIN_MAP.default).bind(this);

    return await login(user);
  }

  async loginJWT(user: User) {
    const payload = { username: user.name, sub: user.id };

    return {
      token_type: 'Bearer',
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginBasic(user: User) {
    // const payload = { username: user.name, sub: user.id };

    function encodeUserToken(user) {
      const { id, name, password } = user;
      const buf = Buffer.from([name, password].join(':'), 'utf8');

      return buf.toString('base64');
    }

    return {
      token_type: 'Basic',
      access_token: encodeUserToken(user),
    };
  }
}
