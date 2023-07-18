import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { DtoValidationPipe } from './pipes/dto-validation.pipe';

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new DtoValidationPipe());
  await app.listen(3000);
}
bootstrap();