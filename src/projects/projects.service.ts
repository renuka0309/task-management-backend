import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { tasks: true },
    });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  create(dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        title: dto.title,
        priority: dto.priority ?? 'No priority',
        lead: dto.lead ?? 'Admin',
        dueDate: dto.dueDate,
      },
    });
  }

  async update(id: number, dto: UpdateProjectDto) {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Project ${id} not found`);
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Project ${id} not found`);
    await this.prisma.project.delete({ where: { id } });
    return { deleted: true };
  }
}