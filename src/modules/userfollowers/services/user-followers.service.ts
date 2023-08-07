import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFollowers } from '@prisma/client';
import { TrimSpaces } from 'src/utils/helpers';

@Injectable()
export class UserFollowersService {
  constructor(private readonly prisma: PrismaService) {}

}
