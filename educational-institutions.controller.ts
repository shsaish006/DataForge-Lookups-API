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
import { EducationalInstitutionsService } from './educational-institutions.service';
import { CreateEducationalInstitutionDto } from './dto/create-educational-institution.dto';
import { UpdateEducationalInstitutionDto } from './dto/update-educational-institution.dto';
import { QueryEducationalInstitutionDto } from './dto/query-educational-institution.dto';
import { EducationalInstitution } from './entities/educational-institution.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { Public } from '../common/decorators/auth.decorator';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';

@ApiTags('educational-institutions')
@Controller('educational-institutions')
@UseGuards(JwtAuthGuard)
export class EducationalInstitutionsController {
  constructor(
    private readonly educationalInstitutionsService: EducationalInstitutionsService,
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new educational institution' })
  @ApiResponse({
    status: 201,
    description: 'Educational institution created successfully',
    type: EducationalInstitution,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  create(
    @Body() createEducationalInstitutionDto: CreateEducationalInstitutionDto,
  ): Promise<EducationalInstitution> {
    return this.educationalInstitutionsService.create(createEducationalInstitutionDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all educational institutions with optional filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Educational institutions retrieved successfully',
  })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'countryId', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'orderDirection', required: false, enum: ['asc', 'desc'] })
  findAll(
    @Query() query: QueryEducationalInstitutionDto,
  ): Promise<PaginatedResponse<EducationalInstitution>> {
    return this.educationalInstitutionsService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get an educational institution by ID' })
  @ApiResponse({
    status: 200,
    description: 'Educational institution retrieved successfully',
    type: EducationalInstitution,
  })
  @ApiResponse({ status: 404, description: 'Educational institution not found' })
  findOne(@Param('id') id: string): Promise<EducationalInstitution> {
    return this.educationalInstitutionsService.findOne(id);
  }

  @Get('country/:countryId')
  @Public()
  @ApiOperation({ summary: 'Get educational institutions by country' })
  @ApiResponse({
    status: 200,
    description: 'Educational institutions retrieved successfully',
  })
  findByCountry(
    @Param('countryId') countryId: string,
    @Query() query: QueryEducationalInstitutionDto,
  ): Promise<PaginatedResponse<EducationalInstitution>> {
    return this.educationalInstitutionsService.findByCountry(countryId, query);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update an educational institution' })
  @ApiResponse({
    status: 200,
    description: 'Educational institution updated successfully',
    type: EducationalInstitution,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Educational institution not found' })
  update(
    @Param('id') id: string,
    @Body() updateEducationalInstitutionDto: UpdateEducationalInstitutionDto,
  ): Promise<EducationalInstitution> {
    return this.educationalInstitutionsService.update(id, updateEducationalInstitutionDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete an educational institution' })
  @ApiResponse({ status: 200, description: 'Educational institution deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Educational institution not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.educationalInstitutionsService.remove(id);
  }
}
