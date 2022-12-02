import { Injectable } from '@nestjs/common';
import { PaidPlanType, UserRoleEnum } from '@prisma/client';
import { PrismaService } from '../data-access/prisma.service';

export type CreateUserArgs = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: UserRoleEnum;
  avatarImageUrl?: string;
  welcomeExperienceShown?: boolean;
  isDisabled?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  paidPlan?: PaidPlanType;
};

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  public create(data: CreateUserArgs) {
    return this.prismaService.user.create({
      data: {
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      },
    });
  }

  public findById(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }
}
