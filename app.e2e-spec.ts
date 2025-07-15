import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Countries API', () => {
    it('/api/v1/countries (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/countries')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('total');
        });
    });

    it('/api/v1/countries/:id (GET)', async () => {
      // Create a test country first
      const country = await prisma.country.create({
        data: {
          name: 'Test Country',
          countryCode: 'TC',
          countryFlag: '🧪',
        },
      });

      return request(app.getHttpServer())
        .get(`/api/v1/countries/${country.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.name).toBe('Test Country');
          expect(res.body.data.countryCode).toBe('TC');
        });
    });
  });

  describe('Educational Institutions API', () => {
    it('/api/v1/educational-institutions (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/educational-institutions')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('total');
        });
    });
  });

  describe('Devices API', () => {
    it('/api/v1/devices (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/devices')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('total');
        });
    });
  });

  describe('API Documentation', () => {
    it('/api/docs (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/docs')
        .expect(200);
    });
  });
});
