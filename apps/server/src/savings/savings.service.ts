import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSavingsDto } from './dto/create-savings.dto';
import { UpdateSavingsDto } from './dto/update-savings.dto';

@Injectable()
export class SavingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createSavingsDto: CreateSavingsDto) {
    const { amount, date, description } = createSavingsDto;

    return this.prisma.savings.create({
      data: {
        amount,
        date: new Date(date),
        description,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async findByUserAndPeriod(userId: string, startDate: Date, endDate: Date) {
    return this.prisma.savings.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async findById(id: string) {
    const savings = await this.prisma.savings.findUnique({
      where: { id },
    });

    if (!savings) {
      throw new NotFoundException(`Savings entry with ID ${id} not found`);
    }

    return savings;
  }

  async getTotalSavingsByMonthYear(
    userId: string,
    year: number,
    month: number,
  ) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const result = await this.prisma.savings.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    return result._sum.amount || 0;
  }

  async updateById(id: string, updateSavingsDto: UpdateSavingsDto) {
    const existingSavings = await this.prisma.savings.findUnique({
      where: { id },
    });

    if (!existingSavings) {
      throw new NotFoundException(`Savings entry with ID ${id} not found`);
    }

    return this.prisma.savings.update({
      where: { id },
      data: updateSavingsDto,
    });
  }

  async deleteById(id: string) {
    const existingSavings = await this.prisma.savings.findUnique({
      where: { id },
    });

    if (!existingSavings) {
      throw new NotFoundException(`Savings entry with ID ${id} not found`);
    }

    return this.prisma.savings.delete({
      where: { id },
    });
  }
}
