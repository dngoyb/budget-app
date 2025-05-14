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
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('incomes')
@UseGuards(JwtAuthGuard)
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  async create(
    @Req() req: { user: { id: string } },
    @Body() createIncomeDto: CreateIncomeDto,
  ) {
    const userId = req.user.id;
    return this.incomeService.create(userId, createIncomeDto);
  }

  @Get()
  async findAll(@Req() req: { user: { id: string } }) {
    const userId = req.user.id;
    const incomes = await this.incomeService.findByUser(userId);

    if (!incomes || incomes.length === 0) {
      throw new NotFoundException(
        `No income records found for user with ID ${userId}`,
      );
    }

    return incomes;
  }

  @Get(':year/:month')
  async findOneByMonthYear(
    @Req() req: { user: { id: string } },
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    const userId = req.user.id;
    const income = await this.incomeService.findOneByUserAndMonthYear(
      userId,
      month,
      year,
    );

    if (!income) {
      throw new NotFoundException(
        `Income record for ${month}/${year} not found for user with ID ${userId}`,
      );
    }

    return income;
  }
}
