import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from '../../generated/prisma/client';

@Injectable()
export class ExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    const { amount, category, description, date } = createExpenseDto;

    const expenseDate = new Date(date);
    if (isNaN(expenseDate.getTime())) {
      throw new Error('Invalid date');
    }

    const expense: Expense = await this.prisma.expense.create({
      data: {
        amount,
        category,
        description,
        date: expenseDate,
        userId,
      },
    });

    return expense;
  }
}
