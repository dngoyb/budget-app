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

    const expense: Expense = await this.prisma.expense.create({
      data: {
        amount,
        category,
        description,
        date: new Date(date),
        userId,
      },
    });

    return expense;
  }

  async findByUser(userId: string): Promise<Expense[]> {
    const expenses: Expense[] = await this.prisma.expense.findMany({
      where: {
        userId: userId,
      },
      orderBy: [{ date: 'desc' }],
    });

    return expenses;
  }

  async findByMonthYear(
    userId: string,
    month: number,
    year: number,
  ): Promise<Expense[]> {
    const expenses: Expense[] = await this.prisma.expense.findMany({
      where: {
        userId: userId,
        date: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      orderBy: [{ date: 'desc' }],
    });

    return expenses;
  }

  async findByCategory(userId: string, category: string): Promise<Expense[]> {
    const expenses: Expense[] = await this.prisma.expense.findMany({
      where: {
        userId: userId,
        category: {
          contains: category,
          mode: 'insensitive',
        },
      },
      orderBy: [{ date: 'desc' }],
    });

    return expenses;
  }
}
