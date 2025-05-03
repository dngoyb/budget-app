import {
  Controller,
  Post,
  Body,
  Get,
  NotFoundException,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from '../../generated/prisma/client';

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
  async findAll() {
    const userId = 'cma6tfkxy0002ctojy4dauemc';

    const expenses: Expense[] = await this.expenseService.findByUser(userId);

    return expenses;
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
}
