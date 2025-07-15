import { Module } from '@nestjs/common';
import { EducationalInstitutionsController } from './educational-institutions.controller';
import { EducationalInstitutionsService } from './educational-institutions.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [EducationalInstitutionsController],
  providers: [EducationalInstitutionsService],
  exports: [EducationalInstitutionsService],
})
export class EducationalInstitutionsModule {}
