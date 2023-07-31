import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Comment } from '@prisma/client';
import { CreateCommentDto } from '../dto/CreateComment.dto';
import { PatchCommentDto } from '../dto/PatchComment.dto';
import { TrimSpaces } from 'src/utils/helpers';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to get a comment by its ID
  async getCommentById(commentId: number): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }

    return comment;
  }

  // Method to get all comments for a specific post
  async GetAllPostComments(postId: number): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { postId: postId },
    });

    if (!comments) {
      throw new NotFoundException('Comments not found.');
    }

    return comments;
  }

  // Method to get all comments made by a specific user
  async GetAllUserComments(userId: number): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { userId: userId },
    });

    if (!comments) {
      throw new NotFoundException('User has no comments found.');
    }

    return comments;
  }

  // Method to get the most recent comments up to a specified limit
  async GetRecentComments(limit: number): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      orderBy: { creationDate: 'desc' },
      take: limit,
    });

    if (!comments) {
      throw new NotFoundException('Comments not found.');
    }

    return comments;
  }

  // Method to get the most popular comments based on the number of likes up to a specified limit
  async GetPopularComments(limit: number): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      orderBy: { likes: 'desc' },
      take: limit,
    });

    if (!comments) {
      throw new NotFoundException('Comments not found.');
    }

    return comments;
  }

  // Method to count the number of comments for a specific post
  async CountPostComments(postId: number): Promise<number> {
    const count = await this.prisma.comment.count({
      where: { postId: postId },
    });

    return count;
  }
}
