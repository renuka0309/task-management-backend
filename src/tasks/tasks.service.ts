import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private serialize(task: any) {
    return { ...task, labels: JSON.parse(task.labels || '[]') };
  }

  async findAll() {
    const tasks = await this.prisma.task.findMany({
      include: { subtasks: true, updates: true },
      orderBy: { createdAt: 'asc' },
    });
    return tasks.map((t) => this.serialize(t));
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { subtasks: true, updates: true, comments: true },
    });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return this.serialize(task);
  }

  async create(dto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority ?? 'No priority',
        assignee: dto.assignee,
        date: dto.date,
        labels: JSON.stringify(dto.labels ?? []),
        reporter: dto.reporter,
        teams: dto.teams,
        projectId: dto.projectId,
      },
    });
    return this.serialize(task);
  }

  async update(id: number, dto: UpdateTaskDto) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Task ${id} not found`);

    const data: any = { ...dto };
    if (dto.labels) data.labels = JSON.stringify(dto.labels);

    if (dto.priority !== undefined && dto.priority !== existing.priority) {
      await this.prisma.update.create({
        data: {
          text: `You changed priority from ${existing.priority ?? 'No priority'} to ${dto.priority}`,
          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          taskId: id,
        },
      });
    }

    const task = await this.prisma.task.update({ where: { id }, data });
    return this.serialize(task);
  }

  async remove(id: number) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Task ${id} not found`);
    await this.prisma.task.delete({ where: { id } });
    return { deleted: true };
  }
}