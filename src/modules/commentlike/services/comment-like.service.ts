import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentLike } from '@prisma/client';
import { CreateCommentLikeDto } from '../dto/CreateCommentLike.dto';
import { TrimSpaces } from 'src/utils/helpers';

@Injectable()
export class CommentLikeService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to get Account Likes In Comment
  async AccountLikesInComment(commentId: number): Promise<number> {
    // const comment = await this.prisma.comment.findMany({
    //   where: { id: commentId },
    //   include: {
    //     commentLikes: true,
    //   },
    // });

    // if (!comment) {
    //   throw new NotFoundException('Comentário não encontrado.');
    // }

    // return

    // const comment = await this.prisma.comment.findMany({
    //   where: { id: commentId },
    //   include: {
    //     commentLikes: true,
    //   },
    // });

    // if (!comment) {
    //   throw new NotFoundException('Comentário não encontrado.');
    // }

    // return
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        commentLikes: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comentário não encontrado.');
    }

    return comment.commentLikes.length;
  }

  // Method to like comments
  async LikeComments(userId: number, commentId: number): Promise<CommentLike> {
    const commentlike = await this.prisma.commentLike.create({
      data: {
        userId: userId,
        commentId: commentId,
      },
    });

    return commentlike;
  }

  // Method to remove likes on specific comment
  async RemoveLikeOnComment(
    userId: number,
    commentId: number,
  ): Promise<CommentLike> {
    const deletedCommentLike = await this.prisma.commentLike.deleteMany({
      where: {
        userId: userId,
        commentId: commentId,
      },
    });

    if (deletedCommentLike.count === 0) {
      throw new NotFoundException('Comentário não encontrado.');
    }

    return deletedCommentLike[0];
  }
}
