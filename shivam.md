# Topcoder Lookups API

## Overview

This is a modernized version of the Topcoder Lookups API built with NestJS, TypeScript, Prisma, and PostgreSQL. The project migrates from a complex DynamoDB/Elasticsearch architecture to a simpler, more maintainable stack while preserving all existing functionality. The API provides reference data for Topcoder applications including countries, educational institutions, and devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Framework
- **NestJS**: Modern Node.js framework providing dependency injection, decorators, and modular architecture
- **TypeScript**: Full type safety throughout the application
- **Express**: Underlying HTTP server (via NestJS platform-express)

### Database Layer
- **PostgreSQL**: Primary database for storing all reference data
- **Prisma ORM**: Type-safe database client with schema management and migrations
- **Connection Pooling**: Handled by Prisma for optimal performance

### Authentication & Authorization
- **JWT Strategy**: Passport-based JWT authentication compatible with existing Topcoder infrastructure
- **Role-based Access**: Admin users and M2M (machine-to-machine) clients support
- **Guard System**: NestJS guards for protecting endpoints and enforcing permissions

## Key Components

### Core Modules
1. **Countries Module**: Manages country reference data with CRUD operations
2. **Educational Institutions Module**: Handles educational institution data with country relationships
3. **Devices Module**: Manages device information including manufacturer, OS, and browser details
4. **Auth Module**: Provides JWT authentication and user validation
5. **Prisma Module**: Global database service module

### Data Models
- **Country**: Name, country code, flag emoji with audit fields
- **Educational Institution**: Name, location, type with foreign key to Country
- **Device**: Type, manufacturer, model, OS, browser specifications

### API Structure
- **RESTful Endpoints**: Standard HTTP methods (GET, POST, PATCH, DELETE)
- **Pagination**: Skip/take pattern with configurable limits
- **Filtering**: Search and field-specific filters
- **Sorting**: Configurable order by field and direction
- **Response Format**: Consistent success/error response structure

## Data Flow

### Request Processing
1. **Authentication**: JWT token validation via Passport strategy
2. **Authorization**: Role-based access control through guards
3. **Validation**: DTO validation using class-validator
4. **Business Logic**: Service layer processing
5. **Database Operations**: Prisma ORM queries
6. **Response Transformation**: Consistent response format via interceptors

### Error Handling
- Global exception filter for consistent error responses
- Prisma error handling for database constraints
- Validation error formatting
- HTTP status code mapping

### Data Migration
- Scripts to migrate from DynamoDB to PostgreSQL
- Preservation of existing data structure and relationships
- Batch processing for large datasets
- Error handling and rollback capabilities

## External Dependencies

### Database
- PostgreSQL 12+ for data storage
- Prisma for ORM and schema management

### Authentication
- JWT for token-based authentication
- Passport.js for authentication strategies
- Compatible with existing Topcoder auth infrastructure

### Documentation
- Swagger/OpenAPI for interactive API documentation
- Automatic schema generation from DTOs

### Development Tools
- Jest for unit and E2E testing
- TypeScript compiler for type checking
- NestJS CLI for scaffolding and development

## Deployment Strategy

### Environment Configuration
- Environment-based configuration using @nestjs/config
- Database connection via DATABASE_URL
- JWT secrets and auth configuration
- CORS configuration for cross-origin requests

### Database Management
- Prisma migrations for schema changes
- Seed scripts for initial data setup
- Connection pooling for production performance

### API Versioning
- Global prefix `/api/v1` for all endpoints
- Swagger documentation at `/api/docs`
- Consistent response format across all endpoints

### Production Considerations
- Global validation pipes for input sanitization
- Exception filters for error handling
- Request/response transformation interceptors
- Configurable CORS for security
- Health checks and monitoring endpoints (can be added)

### Testing Strategy
- Unit tests for services and controllers
- E2E tests for complete API workflows
- Test database setup with Prisma
- Mock data for testing scenarios

The architecture emphasizes simplicity, maintainability, and type safety while preserving backward compatibility with existing Topcoder systems. The migration from DynamoDB to PostgreSQL reduces operational complexity while the NestJS framework provides a solid foundation for future enhancements.