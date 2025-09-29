import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class InsertNodeDto {
  @IsString()
  @IsNotEmpty()
  folderId: string;

  @IsString()
  @IsNotEmpty()
  item: string;

  @IsBoolean()
  isFolder: boolean;
}