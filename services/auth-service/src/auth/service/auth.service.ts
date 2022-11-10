import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from './jwt.service';
import {
  RegisterRequestDto,
  LoginRequestDto,
  ValidateRequestDto,
} from '../auth.dto';
import {
  LoginResponse,
  RegisterResponse,
  ValidateResponse,
} from '../../protos/auth.pb';
import { UserRepository } from '../user-repository';
import { uuid } from '@grpc-monorepo/ts-shared';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  @Inject(UserRepository)
  private readonly userRepository: UserRepository;
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  public async register({
    email,
    password,
  }: RegisterRequestDto): Promise<RegisterResponse> {
    let user = await this.userRepository.findByEmail(email);

    if (user) {
      return {
        status: HttpStatus.CONFLICT,
        error: ['E-Mail already exists'],
        user: null,
      };
    }
    const encodedPassword = this.jwtService.encodePassword(password);

    const createdUser = await this.userRepository.create({
      id: uuid(),
      email,
      password: encodedPassword,
      firstName: '',
      lastName: '',
      role: 'user',
    });

    return {
      status: HttpStatus.CREATED,
      error: null,
      user: JSON.stringify(createdUser),
    };
  }

  public async login({
    email,
    password,
  }: LoginRequestDto): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: ['E-Mail not found'],
        token: null,
      };
    }

    const isPasswordValid: boolean = this.jwtService.isPasswordValid(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: ['Password wrong'],
        token: null,
      };
    }

    const token: string = this.jwtService.generateToken(user);

    return { token, status: HttpStatus.OK, error: null };
  }

  public async validate({
    token,
  }: ValidateRequestDto): Promise<ValidateResponse> {
    const decoded = await this.jwtService.verify<User>(token);

    if (!decoded) {
      return {
        status: HttpStatus.FORBIDDEN,
        error: ['Token is invalid'],
        userId: null,
      };
    }

    const user = await this.jwtService.validateUser(decoded);

    if (!user) {
      return {
        status: HttpStatus.CONFLICT,
        error: ['User not found'],
        userId: null,
      };
    }

    return { status: HttpStatus.OK, error: null, userId: user.id };
  }
}
