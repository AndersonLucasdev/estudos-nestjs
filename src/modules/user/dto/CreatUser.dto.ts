import { IsString, IsOptional, IsEmail, IsDate, IsEnum } from 'class-validator';
import { Gender } from '@prisma/client';
import { TrimSpaces } from 'src/utils/helpers';
import { CapitalFirstLetter } from 'src/utils/helpers';


export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @IsString()
  @IsOptional()
  profilePhoto?: string;

  @IsDate()
  @IsOptional()
  creationDate?: Date;

  @IsString()
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }

  trimAndCapitalizeFields() {
    this.username = TrimSpaces(this.username);
    this.name = CapitalFirstLetter(this.name);
    this.email = TrimSpaces(this.email);
    this.password = TrimSpaces(this.password)
    this.phone = TrimSpaces(this.phone)
    this.profilePhoto = TrimSpaces(this.profilePhoto)
  }
}



