import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SavingsService } from './savings.service';
import { CreateSavingsDto } from './dto/create-savings.dto';
import { UpdateSavingsDto } from './dto/update-savings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('savings')
@UseGuards(JwtAuthGuard)
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Post()
  async create(
    @Req() req: { user: { id: string } },
    @Body() createSavingsDto: CreateSavingsDto,
  ) {
    const userId = req.user.id;
    return this.savingsService.create(userId, createSavingsDto);
  }

  @Get(':year/:month')
  async findByMonthYear(
    @Req() req: { user: { id: string } },
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    const userId = req.user.id;
    return this.savingsService.findByUserAndPeriod(
      userId,
      new Date(year, month - 1, 1),
      new Date(year, month, 0, 23, 59, 59),
    );
  }

  @Get('total/:year/:month')
  async getTotalByMonthYear(
    @Req() req: { user: { id: string } },
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    const userId = req.user.id;
    const total = await this.savingsService.getTotalSavingsByMonthYear(
      userId,
      year,
      month,
    );
    return { total };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSavingsDto: UpdateSavingsDto,
  ) {
    return this.savingsService.updateById(id, updateSavingsDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.savingsService.deleteById(id);
  }
}
