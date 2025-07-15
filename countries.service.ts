import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { QueryCountryDto } from './dto/query-country.dto';
import { Country } from './entities/country.entity';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class CountriesService {
  private readonly logger = new Logger(CountriesService.name);

  constructor(private prisma: PrismaService) {}

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    try {
      const country = await this.prisma.country.create({
        data: {
          ...createCountryDto,
          createdBy: 'system', // In a real app, this would come from the authenticated user
        },
      });
      
      this.logger.log(`Created country: ${country.name} (${country.countryCode})`);
      return country;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Country with ${error.meta?.target} already exists`,
          );
        }
      }
      throw error;
    }
  }

  async findAll(query: QueryCountryDto): Promise<PaginatedResponse<Country>> {
    const { skip = 0, take = 20, search, orderBy = 'name', orderDirection = 'asc' } = query;

    const where: Prisma.CountryWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { countryCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderByClause: Prisma.CountryOrderByWithRelationInput = {};
    if (orderBy) {
      orderByClause[orderBy] = orderDirection;
    }

    const [countries, total] = await Promise.all([
      this.prisma.country.findMany({
        where,
        skip,
        take,
        orderBy: orderByClause,
      }),
      this.prisma.country.count({ where }),
    ]);

    return {
      data: countries,
      total,
      skip,
      take,
      hasNext: skip + take < total,
      hasPrevious: skip > 0,
    };
  }

  async findOne(id: string): Promise<Country> {
    const country = await this.prisma.country.findUnique({
      where: { id },
      include: {
        educationalInstitutions: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
          },
        },
      },
    });

    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }

    return country;
  }

  async findByCode(countryCode: string): Promise<Country> {
    const country = await this.prisma.country.findUnique({
      where: { countryCode: countryCode.toUpperCase() },
    });

    if (!country) {
      throw new NotFoundException(`Country with code ${countryCode} not found`);
    }

    return country;
  }

  async update(id: string, updateCountryDto: UpdateCountryDto): Promise<Country> {
    await this.findOne(id); // Check if country exists

    try {
      const country = await this.prisma.country.update({
        where: { id },
        data: {
          ...updateCountryDto,
          updatedBy: 'system', // In a real app, this would come from the authenticated user
        },
      });

      this.logger.log(`Updated country: ${country.name} (${country.countryCode})`);
      return country;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Country with ${error.meta?.target} already exists`,
          );
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const country = await this.findOne(id); // Check if country exists

    await this.prisma.country.delete({
      where: { id },
    });

    this.logger.log(`Deleted country: ${country.name} (${country.countryCode})`);
  }
}
