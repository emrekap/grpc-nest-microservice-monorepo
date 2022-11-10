import { Injectable } from "@nestjs/common";
import { PrismaService } from "../data-access/prisma.service";

@Injectable()
export class ServiceRepository {
  constructor(private readonly prismaService: PrismaService) {}
}
