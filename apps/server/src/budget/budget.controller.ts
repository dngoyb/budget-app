import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  async create(@Body() createBudgetDto: CreateBudgetDto) {
    const userId = 'placeholder-user-id';
    const newBudget = await this.budgetService.create(userId, createBudgetDto);

    return newBudget;
  }

  @Get()
  async findAll() {
    const userId = 'placeholder-user-id';
    const budgets = await this.budgetService.findByUser(userId);

    if (!budgets || budgets.length === 0) {
      throw new NotFoundException(
        `No budgets found for user with ID ${userId}`,
      );
    }

    return budgets;
  }

  @Get(':year/:month')
  async findOneByMonthYear(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    // TODO: Get the actual userId from the authenticated user.
    // For now, use the same placeholder.
    const userId = 'placeholder-user-id'; // Replace with logic to get authenticated user ID

    // Call the findOneByUserAndMonthYear method in the BudgetService
    const budget = await this.budgetService.findOneByUserAndMonthYear(
      userId,
      month,
      year,
    );

    if (!budget) {
      throw new NotFoundException(
        `Budget for ${month}/${year} not found for user with ID ${userId}`,
      );
    }

    return budget;
  }
}
