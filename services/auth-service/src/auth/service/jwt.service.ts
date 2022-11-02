import { Inject, Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { UserRepository } from '../user-repository';

@Injectable()
export class JwtService {
  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  private readonly jwt: Jwt;

  constructor(jwt: Jwt) {
    this.jwt = jwt;
  }

  // Decoding the JWT Token
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  // Get User by User ID we get from decode()
  public async validateUser(decoded: any) {
    return this.userRepository.findById(decoded.id);
  }

  // Generate JWT Token
  public generateToken(user: User): string {
    return this.jwt.sign({ id: user.id, email: user.email });
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  public async verify<T extends object>(token: string): Promise<T> {
    try {
      return this.jwt.verify<T>(token);
    } catch (err) {}
  }
}
