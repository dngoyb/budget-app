import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
// This code defines the main application module for a NestJS application.
