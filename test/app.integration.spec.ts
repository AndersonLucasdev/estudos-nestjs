import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { INestApplication } from '@nestjs/common';
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

//   it('should create a task', async () => {
//     const task = { title: 'Test Task' };
    
//     const response = await request(app.getHttpServer())
//       .post('/tasks')
//       .send(task)
//       .expect(201);

//     expect(response.body.title).toBe(task.title);
//   });

});