import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { QueryDeviceDto } from './dto/query-device.dto';
import { Device } from './entities/device.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { Public } from '../common/decorators/auth.decorator';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';

@ApiTags('devices')
@Controller('devices')
@UseGuards(JwtAuthGuard)
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new device' })
  @ApiResponse({
    status: 201,
    description: 'Device created successfully',
    type: Device,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  create(@Body() createDeviceDto: CreateDeviceDto): Promise<Device> {
    return this.devicesService.create(createDeviceDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all devices with optional filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Devices retrieved successfully',
  })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'manufacturer', required: false, type: String })
  @ApiQuery({ name: 'os', required: false, type: String })
  @ApiQuery({ name: 'browser', required: false, type: String })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'orderDirection', required: false, enum: ['asc', 'desc'] })
  findAll(@Query() query: QueryDeviceDto): Promise<PaginatedResponse<Device>> {
    return this.devicesService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a device by ID' })
  @ApiResponse({
    status: 200,
    description: 'Device retrieved successfully',
    type: Device,
  })
  @ApiResponse({ status: 404, description: 'Device not found' })
  findOne(@Param('id') id: string): Promise<Device> {
    return this.devicesService.findOne(id);
  }

  @Get('type/:type')
  @Public()
  @ApiOperation({ summary: 'Get devices by type' })
  @ApiResponse({
    status: 200,
    description: 'Devices retrieved successfully',
  })
  findByType(
    @Param('type') type: string,
    @Query() query: QueryDeviceDto,
  ): Promise<PaginatedResponse<Device>> {
    return this.devicesService.findByType(type, query);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a device' })
  @ApiResponse({
    status: 200,
    description: 'Device updated successfully',
    type: Device,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Device not found' })
  update(
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ): Promise<Device> {
    return this.devicesService.update(id, updateDeviceDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a device' })
  @ApiResponse({ status: 200, description: 'Device deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Device not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.devicesService.remove(id);
  }
}
