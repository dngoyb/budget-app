import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BudgetModule } from './budget/budget.module';
@Module({
  imports: [PrismaModule, AuthModule, BudgetModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
// This code defines the main application module for a NestJS application.
