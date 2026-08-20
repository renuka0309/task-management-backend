import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { SubtasksModule } from './subtasks/subtasks.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [TasksModule, PrismaModule, ProjectsModule, SubtasksModule, CommentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
