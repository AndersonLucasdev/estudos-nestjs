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

  // Method to get a comment by its ID
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

    // // Calcula a contagem total de curtidas no comentário
    // const totalLikes = comment.likes.length;

    // // Adicionamos o total de curtidas como uma propriedade no objeto retornado
    // return { ...comment, totalLikes };
  }

//   // Method to get all comments for a specific post
//   async GetAllPostComments(postId: number): Promise<Comment[]> {
//     const comments = await this.prisma.comment.findMany({
//       where: { postId: postId },
//     });

//     if (!comments) {
//       throw new NotFoundException('Comments not found.');
//     }

//     return comments;
//   }

//   // Method to delete a comment by its ID
//   async DeleteComment(id: number): Promise<Comment> {
//     const comment = await this.prisma.comment.findUnique({ where: { id } });
//     if (!comment) {
//       throw new NotFoundException('Comentário não encontrado.');
//     }

//     await this.prisma.comment.delete({ where: { id } });
//     return comment;
//   }

