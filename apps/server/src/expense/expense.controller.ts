import { Controller, Post, Body } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    // TODO: Get the actual userId from the authenticated user.
    // For now, we'll use a specific user ID for testing, similar to the BudgetController.
    const userId = 'cma6tfkxy0002ctojy4dauemc'; // Replace with logic to get authenticated user ID

    const newExpense = await this.expenseService.create(
      userId,
      createExpenseDto,
    );

    return newExpense;
  }
}
