import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  findAllForTask(taskId: number) {
    return this.prisma.comment.findMany({
      where: { taskId, parentCommentId: null },
      include: { replies: true },
      orderBy: { id: 'asc' },
    });
  }

  create(taskId: number, dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        text: dto.text,
        author: dto.author ?? 'You',
        timestamp: 'just now',
        taskId,
        parentCommentId: dto.parentCommentId,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.comment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Comment ${id} not found`);
    await this.prisma.comment.delete({ where: { id } });
    return { deleted: true };
  }
}