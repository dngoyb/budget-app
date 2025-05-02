import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';

@Injectable()
export class BudgetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createBudgetDto: CreateBudgetDto) {
    const { amount, month, year } = createBudgetDto;

    const existingBudget = await this.prisma.budget.findUnique({
      where: {
        userId_month_year: {
          userId: userId,
          month: month,
          year: year,
        },
      },
    });

    if (existingBudget) {
      throw new ConflictException(
        `Budget for ${month}/${year} already exists for this user.`,
      );
    }

    const budget = await this.prisma.budget.create({
      data: {
        amount,
        month,
        year,
        userId,
      },
    });

    return budget;
  }

  async findByUser(userId: string) {
    const budgets = await this.prisma.budget.findMany({
      where: {
        userId: userId,
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    if (budgets.length === 0) {
      throw new NotFoundException(
        `No budgets found for user with ID ${userId}`,
      );
    }

    return budgets;
  }

  async findOneByUserAndMonthYear(userId: string, month: number, year: number) {
    const budget = await this.prisma.budget.findUnique({
      where: {
        userId_month_year: {
          userId: userId,
          month: month,
          year: year,
        },
      },
    });
    return budget;
  }
}
