import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFileNodeDto } from '../dto/create-file-node.dto';
import { UpdateFileNodeDto } from '../dto/update-file-node.dto';
import { InsertNodeDto } from '../dto/insert-node.dto';

@Injectable()
export class FileExplorerService {
  constructor(private prisma: PrismaService) { }

  // Helper function to build tree structure
  private buildTree(nodes: any[]): any {
    const nodeMap = new Map();
    const roots: any[] = [];

    // Create a map of all nodes
    nodes.forEach(node => {
      nodeMap.set(node.id, {
        id: node.id,
        name: node.name,
        isFolder: node.isFolder,
        items: []
      });
    });

    // Build the tree structure
    nodes.forEach(node => {
      const nodeData = nodeMap.get(node.id);
      if (node.parentId) {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.items.push(nodeData);
        }
      } else {
        roots.push(nodeData);
      }
    });
    // if (process.env.TYPE === "SINGLE") {
    //   return roots.length > 0 ? roots[0] : null

    // }
    return roots.length > 0 ? roots : null
  }

  async getFileTree(): Promise<any> {
    const nodes = await this.prisma.fileNode.findMany({
      orderBy: { createdAt: 'asc' }
    });

    // if (nodes.length === 0) {
    //   // Create default root if none exists
    //   const root = await this.prisma.fileNode.create({
    //     data: {
    //       name: 'root',
    //       isFolder: true,
    //     }
    //   });
    //   return {
    //     id: root.id,
    //     name: root.name,
    //     isFolder: root.isFolder,
    //     items: []
    //   };
    // }

    return this.buildTree(nodes);
  }

  async createNode(createNode: CreateFileNodeDto): Promise<any> {
    const { name } = createNode
    const root = await this.prisma.fileNode.create({
      data: {
        name,
        isFolder: true,
      }
    });
    return {
      id: root.id,
      name: root.name,
      isFolder: root.isFolder,
      items: []
    };
  }

  async insertNode(insertNodeDto: InsertNodeDto): Promise<any> {
    const { folderId, item, isFolder } = insertNodeDto;

    const parent = await this.prisma.fileNode.findUnique({
      where: { id: folderId }
    });

    if (!parent) {
      throw new NotFoundException('Parent folder not found');
    }

    if (!parent.isFolder) {
      throw new Error('Cannot add items to a file');
      // return "Cannot add items to a file"
    }

    await this.prisma.fileNode.create({
      data: {
        name: item,
        isFolder,
        parentId: folderId,
      }
    });

    return this.getFileTree();
  }

  async updateNode(nodeId: string, updateNodeDto: UpdateFileNodeDto): Promise<any> {
    const node = await this.prisma.fileNode.findUnique({
      where: { id: nodeId }
    });

    if (!node) {
      throw new NotFoundException('Node not found');
    }

    await this.prisma.fileNode.update({
      where: { id: nodeId },
      data: updateNodeDto
    });

    return this.getFileTree();
  }

  async deleteNode(nodeId: string): Promise<any> {
    const node = await this.prisma.fileNode.findUnique({
      where: { id: nodeId }
    });

    if (!node) {
      throw new NotFoundException('Node not found');
    }

    // Delete all children recursively
    await this.deleteNodeRecursive(nodeId);
    return this.getFileTree();
  }

  private async deleteNodeRecursive(nodeId: string): Promise<void> {
    const children = await this.prisma.fileNode.findMany({
      where: { parentId: nodeId }
    });

    for (const child of children) {
      await this.deleteNodeRecursive(child.id);
    }

    await this.prisma.fileNode.delete({
      where: { id: nodeId }
    });
  }

  async getNodeById(nodeId: string): Promise<any> {
    const node = await this.prisma.fileNode.findUnique({
      where: { id: nodeId, parentId: null }
    });

    if (!node) {
      throw new NotFoundException('Node not found');
    }

    return this.buildNodeRecursive(node.id);
  }

  private async buildNodeRecursive(nodeId: string): Promise<any> {
    const node = await this.prisma.fileNode.findUnique({
      where: { id: nodeId }
    });

    if (!node) {
      throw new NotFoundException('Node not found');
    }

    const children = await this.prisma.fileNode.findMany({
      where: { parentId: nodeId },
      orderBy: { createdAt: 'asc' }
    });

    const items = await Promise.all(children.map(child => this.buildNodeRecursive(child.id)));

    return {
      id: node.id,
      name: node.name,
      isFolder: node.isFolder,
      items
    };
  }
}