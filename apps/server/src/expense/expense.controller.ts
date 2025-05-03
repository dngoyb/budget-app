import {
  Controller,
  Post,
  Body,
  Get,
  NotFoundException,
  ParseIntPipe,
  Param,
  Patch,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from '../../generated/prisma/client';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  async create(@Body() createExpenseDto: CreateExpenseDto): Promise<Expense> {
    // TODO: Get the actual userId from the authenticated user.
    // For now, we'll use a specific user ID for testing, similar to the BudgetController.
    const userId = 'cma6tfkxy0002ctojy4dauemc'; // Replace with logic to get authenticated user ID

    const newExpense: Expense = await this.expenseService.create(
      userId,
      createExpenseDto,
    );

    return newExpense;
  }

  @Get()
  async findAll(): Promise<Expense[]> {
    const userId = 'cma6tfkxy0002ctojy4dauemc';

    const expenses: Expense[] = await this.expenseService.findByUser(userId);

    return expenses;
  }

  @Get('category/:categoryName')
  async findByCategory(
    @Param('categoryName') categoryName: string,
  ): Promise<Expense[]> {
    const userId = 'cma6tfkxy0002ctojy4dauemc';

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
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ): Promise<Expense[]> {
    const userId = 'cma6tfkxy0002ctojy4dauemc';

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
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const userId = 'cma6tfkxy0002ctojy4dauemc';

    const updatedExpense: Expense = await this.expenseService.update(
      id,
      userId,
      updateExpenseDto,
    );

    return updatedExpense;
  }
}
