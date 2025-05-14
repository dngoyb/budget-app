import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { IncomeModule } from './Income/income.module';
import { ExpenseModule } from './expense/expense.module';
import { SavingsModule } from './savings/savings.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    IncomeModule,
    ExpenseModule,
    SavingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
