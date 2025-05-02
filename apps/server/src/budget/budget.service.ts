import { Injectable, ConflictException } from '@nestjs/common';
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
}
