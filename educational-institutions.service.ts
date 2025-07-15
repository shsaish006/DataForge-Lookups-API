import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEducationalInstitutionDto } from './dto/create-educational-institution.dto';
import { UpdateEducationalInstitutionDto } from './dto/update-educational-institution.dto';
import { QueryEducationalInstitutionDto } from './dto/query-educational-institution.dto';
import { EducationalInstitution } from './entities/educational-institution.entity';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class EducationalInstitutionsService {
  private readonly logger = new Logger(EducationalInstitutionsService.name);

  constructor(private prisma: PrismaService) {}

  async create(
    createEducationalInstitutionDto: CreateEducationalInstitutionDto,
  ): Promise<EducationalInstitution> {
    const institution = await this.prisma.educationalInstitution.create({
      data: {
        ...createEducationalInstitutionDto,
        createdBy: 'system',
      },
      include: {
        country: true,
      },
    });

    this.logger.log(`Created educational institution: ${institution.name}`);
    return institution;
  }

  async findAll(
    query: QueryEducationalInstitutionDto,
  ): Promise<PaginatedResponse<EducationalInstitution>> {
    const {
      skip = 0,
      take = 20,
      search,
      countryId,
      state,
      city,
      type,
      orderBy = 'name',
      orderDirection = 'asc',
    } = query;

    const where: Prisma.EducationalInstitutionWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (countryId) {
      where.countryId = countryId;
    }

    if (state) {
      where.state = { contains: state, mode: 'insensitive' };
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (type) {
      where.type = { contains: type, mode: 'insensitive' };
    }

    const orderByClause: Prisma.EducationalInstitutionOrderByWithRelationInput = {};
    if (orderBy) {
      orderByClause[orderBy] = orderDirection;
    }

    const [institutions, total] = await Promise.all([
      this.prisma.educationalInstitution.findMany({
        where,
        skip,
        take,
        orderBy: orderByClause,
        include: {
          country: {
            select: {
              id: true,
              name: true,
              countryCode: true,
            },
          },
        },
      }),
      this.prisma.educationalInstitution.count({ where }),
    ]);

    return {
      data: institutions,
      total,
      skip,
      take,
      hasNext: skip + take < total,
      hasPrevious: skip > 0,
    };
  }

  async findOne(id: string): Promise<EducationalInstitution> {
    const institution = await this.prisma.educationalInstitution.findUnique({
      where: { id },
      include: {
        country: true,
      },
    });

    if (!institution) {
      throw new NotFoundException(`Educational institution with ID ${id} not found`);
    }

    return institution;
  }

  async findByCountry(
    countryId: string,
    query: QueryEducationalInstitutionDto,
  ): Promise<PaginatedResponse<EducationalInstitution>> {
    return this.findAll({ ...query, countryId });
  }

  async update(
    id: string,
    updateEducationalInstitutionDto: UpdateEducationalInstitutionDto,
  ): Promise<EducationalInstitution> {
    await this.findOne(id); // Check if institution exists

    const institution = await this.prisma.educationalInstitution.update({
      where: { id },
      data: {
        ...updateEducationalInstitutionDto,
        updatedBy: 'system',
      },
      include: {
        country: true,
      },
    });

    this.logger.log(`Updated educational institution: ${institution.name}`);
    return institution;
  }

  async remove(id: string): Promise<void> {
    const institution = await this.findOne(id); // Check if institution exists

    await this.prisma.educationalInstitution.delete({
      where: { id },
    });

    this.logger.log(`Deleted educational institution: ${institution.name}`);
  }
}
