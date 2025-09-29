import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFileNodeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  isFolder?: boolean;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsOptional()
  content?: string;
}