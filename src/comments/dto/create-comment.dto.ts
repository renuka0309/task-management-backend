import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsInt()
  @IsOptional()
  parentCommentId?: number;
}