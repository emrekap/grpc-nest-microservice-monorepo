import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from 'src/config/config.module';
import { DataAccessModule } from 'src/data-access/data-access.module';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { JwtService } from './service/jwt.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserRepository } from './user-repository';

@Module({
  imports: [
    ConfigModule,
    DataAccessModule,
    JwtModule.register({
      secret: 'dev',
      signOptions: { expiresIn: '365d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy, UserRepository],
})
export class AuthModule {}
