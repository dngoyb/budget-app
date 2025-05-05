import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('budget')
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  async create(
    @Req() req: { user: { id: string } },
    @Body() createBudgetDto: CreateBudgetDto,
  ) {
    const userId = req.user.id;
    const newBudget = await this.budgetService.create(userId, createBudgetDto);

    return newBudget;
  }

  @Get()
  async findAll(@Req() req: { user: { id: string } }) {
    const userId = req.user.id;
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
    @Req() req: { user: { id: string } },
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    const userId = req.user.id;

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
