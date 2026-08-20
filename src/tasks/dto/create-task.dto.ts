import { IsString, IsOptional, IsNotEmpty, IsInt } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  assignee?: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsOptional()
  labels?: string[];

  @IsString()
  @IsOptional()
  reporter?: string;

  @IsString()
  @IsOptional()
  teams?: string;

  @IsInt()
  @IsOptional()
  projectId?: number;
}