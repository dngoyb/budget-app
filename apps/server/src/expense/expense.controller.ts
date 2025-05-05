import {
  Controller,
  Post,
  Body,
  Get,
  NotFoundException,
  ParseIntPipe,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from '../../generated/prisma/client';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  async create(
    @Req() req: { user: { id: string } },
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    const userId = req.user.id;

    const newExpense: Expense = await this.expenseService.create(
      userId,
      createExpenseDto,
    );

    return newExpense;
  }

  @Get()
  async findAll(@Req() req: { user: { id: string } }): Promise<Expense[]> {
    const userId = req.user.id;

    const expenses: Expense[] = await this.expenseService.findByUser(userId);

    return expenses;
  }

  @Get('category/:categoryName')
  async findByCategory(
    @Req() req: { user: { id: string } },
    @Param('categoryName') categoryName: string,
  ): Promise<Expense[]> {
    const userId = req.user.id;

    const expensesByCategory: Expense[] =
      await this.expenseService.findByCategory(userId, categoryName);

    if (expensesByCategory.length === 0) {
      throw new NotFoundException(
        `No expenses found for category "${categoryName}" for user with ID ${userId}`,
      );
    }

    return expensesByCategory;
  }

  @Get(':year/:month')
  async findByMonthYear(
    @Req() req: { user: { id: string } },
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ): Promise<Expense[]> {
    const userId = req.user.id;

    const expensesForMonth: Expense[] =
      await this.expenseService.findByMonthYear(userId, month, year);

    if (expensesForMonth.length === 0) {
      throw new NotFoundException(
        `No expenses found for ${month}/${year} for user with ID ${userId}`,
      );
    }

    return expensesForMonth;
  }

  @Patch(':id')
  async update(
    @Req() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const userId = req.user.id;

    const updatedExpense: Expense = await this.expenseService.update(
      id,
      userId,
      updateExpenseDto,
    );

    return updatedExpense;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Req() req: { user: { id: string } },
    @Param('id') id: string,
  ): Promise<void> {
    const userId = req.user.id;

    await this.expenseService.remove(id, userId);
  }

  @Get('total/:year/:month')
  async getTotalExpensesByMonthYear(
    @Req() req: { user: { id: string } },
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ): Promise<{ total: number }> {
    const userId = req.user.id;

    const totalAmount = await this.expenseService.getTotalExpensesByMonthYear(
      userId,
      month,
      year,
    );

    return { total: totalAmount };
  }
}

// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWFiZjhyaHQwMDAwY3QzcnFmNHFvdXh4IiwiZW1haWwiOiJ0ZXN0dXNlckBleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IFVzZXIiLCJpYXQiOjE3NDY0NzA0MDksImV4cCI6MTc0NjQ3NDAwOX0.V9RLLP8R7dff9PXd-ZGXJvxHwCQZrtijTfxT6M4s8gc';
