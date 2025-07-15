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
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { QueryCountryDto } from './dto/query-country.dto';
import { Country } from './entities/country.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { Public } from '../common/decorators/auth.decorator';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';

@ApiTags('countries')
@Controller('countries')
@UseGuards(JwtAuthGuard)
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new country' })
  @ApiResponse({
    status: 201,
    description: 'Country created successfully',
    type: Country,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  create(@Body() createCountryDto: CreateCountryDto): Promise<Country> {
    return this.countriesService.create(createCountryDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all countries with optional filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Countries retrieved successfully',
  })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'orderDirection', required: false, enum: ['asc', 'desc'] })
  findAll(@Query() query: QueryCountryDto): Promise<PaginatedResponse<Country>> {
    return this.countriesService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a country by ID' })
  @ApiResponse({
    status: 200,
    description: 'Country retrieved successfully',
    type: Country,
  })
  @ApiResponse({ status: 404, description: 'Country not found' })
  findOne(@Param('id') id: string): Promise<Country> {
    return this.countriesService.findOne(id);
  }

  @Get('code/:countryCode')
  @Public()
  @ApiOperation({ summary: 'Get a country by country code' })
  @ApiResponse({
    status: 200,
    description: 'Country retrieved successfully',
    type: Country,
  })
  @ApiResponse({ status: 404, description: 'Country not found' })
  findByCode(@Param('countryCode') countryCode: string): Promise<Country> {
    return this.countriesService.findByCode(countryCode);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a country' })
  @ApiResponse({
    status: 200,
    description: 'Country updated successfully',
    type: Country,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  update(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    return this.countriesService.update(id, updateCountryDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a country' })
  @ApiResponse({ status: 200, description: 'Country deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.countriesService.remove(id);
  }
}
