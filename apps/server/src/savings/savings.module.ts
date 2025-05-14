import { Module } from '@nestjs/common';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SavingsController],
  providers: [SavingsService, PrismaService],
})
export class SavingsModule {}
