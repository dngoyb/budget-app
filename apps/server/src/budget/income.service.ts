import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto } from './dto/create-income.dto';

@Injectable()
export class IncomeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createIncomeDto: CreateIncomeDto) {
    const { amount, month, year, source } = createIncomeDto;

    const income = await this.prisma.income.create({
      data: {
        amount,
        month,
        year,
        source,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return income;
  }

  async findByUser(userId: string) {
    const incomes = await this.prisma.income.findMany({
      where: {
        userId: userId,
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    if (incomes.length === 0) {
      throw new NotFoundException(
        `No income records found for user with ID ${userId}`,
      );
    }

    return incomes;
  }

  async findOneByUserAndMonthYear(userId: string, month: number, year: number) {
    const income = await this.prisma.income.findFirst({
      where: {
        userId,
        month,
        year,
      },
    });
    return income;
  }

  async getTotalIncomeByMonthYear(userId: string, year: number, month: number) {
    const result = await this.prisma.income.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        year,
        month,
      },
    });

    return result._sum.amount || 0;
  }
}
