import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from '../../generated/prisma/client';
import { UpdateExpenseDto } from './dto/update-expense.dto';

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

  async update(
    id: string,
    userId: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const updateData = { ...updateExpenseDto };
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    try {
      const updatedExpense: Expense = await this.prisma.expense.update({
        where: {
          id: id,
          userId: userId,
        },
        data: updateData,
      });
      return updatedExpense;
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as { code?: string }).code === 'string' &&
        (error as { code?: string }).code === 'P2025'
      ) {
        throw new NotFoundException(
          `Expense with ID "${id}" not found for this user.`,
        );
      }
      throw error;
    }
  }
}
