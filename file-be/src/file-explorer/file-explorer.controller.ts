import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { FileExplorerService } from './file-explorer.service';
import { UpdateFileNodeDto } from '../dto/update-file-node.dto';
import { InsertNodeDto } from '../dto/insert-node.dto';
import { CreateFileNodeDto } from 'src/dto/create-file-node.dto';

@Controller('api/file-explorer')
export class FileExplorerController {
  constructor(private readonly fileExplorerService: FileExplorerService) { }

  @Get()
  async getFileTree() {
    return this.fileExplorerService.getFileTree();
  }

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createNode(@Body() createNode: CreateFileNodeDto) {
    return this.fileExplorerService.createNode(createNode)
  }


  @Post('insert')
  @HttpCode(HttpStatus.OK)
  async insertNode(@Body() insertNodeDto: InsertNodeDto) {
    return this.fileExplorerService.insertNode(insertNodeDto);
  }

  @Put(':id')
  async updateNode(
    @Param('id') nodeId: string,
    @Body() updateNodeDto: UpdateFileNodeDto,
  ) {
    return this.fileExplorerService.updateNode(nodeId, updateNodeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteNode(@Param('id') nodeId: string) {
    return this.fileExplorerService.deleteNode(nodeId);
  }

  @Get(':id')
  async getNodeById(@Param('id') nodeId: string) {
    return this.fileExplorerService.getNodeById(nodeId);
  }
}