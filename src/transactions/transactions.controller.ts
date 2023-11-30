import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { UpdateTransactionDto } from './dto/updateTransaction.dto';
import { GetTransactionDto } from './dto/getAllTransaction.dto';
import { IGetUserAuthInfoRequest } from 'src/interfaces';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  create(
    @Req() req: IGetUserAuthInfoRequest,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(req, createTransactionDto);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  findAll(
    @Query() query: GetTransactionDto,
    @Req() req: IGetUserAuthInfoRequest,
  ) {
    return this.transactionsService.findAll(req);
  }

  @Get('/test-notif')
  test(req: IGetUserAuthInfoRequest) {
    return this.transactionsService.handleNotifications();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
