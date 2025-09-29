import { Module } from '@nestjs/common';
import { FileExplorerController } from './file-explorer.controller';
import { FileExplorerService } from './file-explorer.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FileExplorerController],
  providers: [FileExplorerService],
})
export class FileExplorerModule {}