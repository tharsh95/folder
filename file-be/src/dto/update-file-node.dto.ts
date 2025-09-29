import { IsString, IsOptional } from 'class-validator';

export class UpdateFileNodeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  content?: string;
}