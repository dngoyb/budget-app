import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createIncomeDto: CreateIncomeDto) {
    const { amount, month, year, source } = createIncomeDto;

    return this.prisma.income.create({
      data: {
        amount,
        month,
        year,
        source,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async findByUser(userId: string) {
    const incomes = await this.prisma.income.findMany({
      where: { userId },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    if (incomes.length === 0) {
      throw new NotFoundException(
        `No income records found for user with ID ${userId}`,
      );
    }

    return incomes;
  }

  async findOneById(id: string) {
    const income = await this.prisma.income.findUnique({
      where: { id },
    });

    if (!income) {
      throw new NotFoundException(`Income record with ID ${id} not found`);
    }

    return income;
  }

  async findOneByUserAndMonthYear(userId: string, month: number, year: number) {
    return this.prisma.income.findMany({
      where: { userId, month, year },
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  async getTotalIncomeByMonthYear(userId: string, year: number, month: number) {
    const result = await this.prisma.income.aggregate({
      _sum: { amount: true },
      where: { userId, year, month },
    });

    return result._sum.amount || 0;
  }

  async updateIncomeById(id: string, updateIncomeDto: UpdateIncomeDto) {
    const existingIncome = await this.prisma.income.findUnique({
      where: { id },
    });

    if (!existingIncome) {
      throw new NotFoundException(`Income with ID ${id} not found`);
    }

    return this.prisma.income.update({
      where: { id },
      data: updateIncomeDto,
    });
  }

  async deleteIncomeById(id: string) {
    const existingIncome = await this.prisma.income.findUnique({
      where: { id },
    });

    if (!existingIncome) {
      throw new NotFoundException(`Income with ID ${id} not found`);
    }

    return this.prisma.income.delete({
      where: { id },
    });
  }
}
