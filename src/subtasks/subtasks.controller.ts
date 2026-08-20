import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SubtasksService } from './subtasks.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Controller('tasks/:taskId/subtasks')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Get()
  findAll(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.subtasksService.findAllForTask(taskId);
  }

  @Post()
  create(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() dto: CreateSubtaskDto,
  ) {
    return this.subtasksService.create(taskId, dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSubtaskDto) {
    return this.subtasksService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subtasksService.remove(id);
  }
}