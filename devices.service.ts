import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { QueryDeviceDto } from './dto/query-device.dto';
import { Device } from './entities/device.entity';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class DevicesService {
  private readonly logger = new Logger(DevicesService.name);

  constructor(private prisma: PrismaService) {}

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const device = await this.prisma.device.create({
      data: {
        ...createDeviceDto,
        createdBy: 'system',
      },
    });

    this.logger.log(`Created device: ${device.manufacturer} ${device.model}`);
    return device;
  }

  async findAll(query: QueryDeviceDto): Promise<PaginatedResponse<Device>> {
    const {
      skip = 0,
      take = 20,
      search,
      type,
      manufacturer,
      os,
      browser,
      orderBy = 'createdAt',
      orderDirection = 'desc',
    } = query;

    const where: Prisma.DeviceWhereInput = {};

    if (search) {
      where.OR = [
        { type: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { os: { contains: search, mode: 'insensitive' } },
        { browser: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = { contains: type, mode: 'insensitive' };
    }

    if (manufacturer) {
      where.manufacturer = { contains: manufacturer, mode: 'insensitive' };
    }

    if (os) {
      where.os = { contains: os, mode: 'insensitive' };
    }

    if (browser) {
      where.browser = { contains: browser, mode: 'insensitive' };
    }

    const orderByClause: Prisma.DeviceOrderByWithRelationInput = {};
    if (orderBy) {
      orderByClause[orderBy] = orderDirection;
    }

    const [devices, total] = await Promise.all([
      this.prisma.device.findMany({
        where,
        skip,
        take,
        orderBy: orderByClause,
      }),
      this.prisma.device.count({ where }),
    ]);

    return {
      data: devices,
      total,
      skip,
      take,
      hasNext: skip + take < total,
      hasPrevious: skip > 0,
    };
  }

  async findOne(id: string): Promise<Device> {
    const device = await this.prisma.device.findUnique({
      where: { id },
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    return device;
  }

  async findByType(
    type: string,
    query: QueryDeviceDto,
  ): Promise<PaginatedResponse<Device>> {
    return this.findAll({ ...query, type });
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto): Promise<Device> {
    await this.findOne(id); // Check if device exists

    const device = await this.prisma.device.update({
      where: { id },
      data: {
        ...updateDeviceDto,
        updatedBy: 'system',
      },
    });

    this.logger.log(`Updated device: ${device.manufacturer} ${device.model}`);
    return device;
  }

  async remove(id: string): Promise<void> {
    const device = await this.findOne(id); // Check if device exists

    await this.prisma.device.delete({
      where: { id },
    });

    this.logger.log(`Deleted device: ${device.manufacturer} ${device.model}`);
  }
}
