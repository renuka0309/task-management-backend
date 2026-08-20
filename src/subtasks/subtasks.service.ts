import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Injectable()
export class SubtasksService {
  constructor(private prisma: PrismaService) {}

  findAllForTask(taskId: number) {
    return this.prisma.subtask.findMany({ where: { taskId } });
  }

  create(taskId: number, dto: CreateSubtaskDto) {
    return this.prisma.subtask.create({
      data: {
        task: dto.task,
        priority: dto.priority ?? 'No priority',
        member: dto.member,
        dueDate: dto.dueDate,
        taskId,
      },
    });
  }

  async update(id: number, dto: UpdateSubtaskDto) {
    const existing = await this.prisma.subtask.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Subtask ${id} not found`);
    return this.prisma.subtask.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const existing = await this.prisma.subtask.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Subtask ${id} not found`);
    await this.prisma.subtask.delete({ where: { id } });
    return { deleted: true };
  }
}