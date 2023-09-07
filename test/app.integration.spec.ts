import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

describe('App', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return "Hello, World!" from the root endpoint', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(HttpStatus.OK)
      .expect('Hello, World!');
  });

  it('should handle 404 errors gracefully', () => {
    return request(app.getHttpServer())
      .get('/nonexistent-route')
      .expect(HttpStatus.NOT_FOUND)
      .expect({ statusCode: HttpStatus.NOT_FOUND, message: 'Rota não encontrada!' });
  });

  
});