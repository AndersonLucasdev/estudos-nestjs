import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UsePipes,
  NotFoundException,
  HttpStatus,
  ConflictException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { PostService } from '../service/post.service';
import { CreatePostDto } from '../dto/CreatePost.dto';
import { PatchPostDto } from '../dto/PatchPost.dto';
import { DtoValidationPipe } from 'src/pipes/dto-validation.pipe';


@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getAllPosts() {
    try {
      const post = await this.postService.GetAllPosts();
      return { post };
    } catch (error) {
      throw new NotFoundException('Não existem posts.');
    }
  }

  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postService.GetPostById(id);
    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }
    return { post };
  }
}
