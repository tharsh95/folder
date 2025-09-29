import { Module } from '@nestjs/common';
import { FileExplorerModule } from './file-explorer/file-explorer.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [FileExplorerModule,PrismaModule],
})
export class AppModule {}