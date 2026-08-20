import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSubtaskDto {
  @IsString()
  @IsNotEmpty()
  task: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  member?: string;

  @IsString()
  @IsOptional()
  dueDate?: string;
}