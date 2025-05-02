import { Controller, Post, Body } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  async create(@Body() createBudgetDto: CreateBudgetDto) {
    // Use @Body to get the request body and validate with CreateBudgetDto
    // TODO: Get the actual userId from the authenticated user.
    // For now, we'll use a placeholder. In a real app with auth,
    // you would get this from the request object populated by your auth guard.
    const userId = 'placeholder-user-id'; // Replace with logic to get authenticated user ID

    // Call the create method in the BudgetService
    const newBudget = await this.budgetService.create(userId, createBudgetDto);

    return newBudget;
  }
}
