Challenge Overview
The current lookups-api provides reference data for application use but relies on a complex architecture using DynamoDB and Elasticsearch. This creates maintenance challenges and makes local development difficult due to infrastructure dependencies.

We are revising the lookups-api to reduce complexity by migrating from the current stack to a modern TypeScript/Prisma/PostgreSQL architecture. The goal is to simplify development, improve maintainability, and retain all existing functionality.

Requirements
🔁 Technology Migration
Update the codebase to use TypeScript

Replace Express with the NestJS framework

Replace DynamoDB with PostgreSQL

Implement Prisma as the ORM

Remove all Elasticsearch dependencies

🧩 Schema Definition
Create Prisma schema definitions for all existing models:

Country

Educational Institution

Device

Ensure the schema properly handles all fields from existing models

Implement proper relationships between entities

📦 Data Migration
Develop scripts to migrate data from DynamoDB to PostgreSQL

Ensure all existing data is preserved during migration

The data will be provided in the forum

🔐 API Functionality
Maintain exact API endpoints and functionality

Implement JWT authentication compatible with the existing system

Preserve authorization rules for admin users and M2M clients

Support the same query parameters for filtering and pagination

Maintain consistent response formats

📁 Code Structure
Follow NestJS best practices for project organization

Implement proper separation of concerns (controllers, services, etc.)

Use TypeScript interfaces and type safety throughout

Implement proper error handling and validation

📚 Documentation
Update API documentation with Swagger/OpenAPI

Provide a clear README with setup instructions

Document the data migration process

✅ Testing
Create seed data for testing purposes

Ensure all existing functionality works as expected

Write unit tests for key components

Expected Deliverables
Complete TypeScript/NestJS/Prisma codebase

Prisma schema definitions

Data migration scripts

Updated API documentation

README.md with setup instructions

Submission Guidelines
All source code for the updated application

Migration scripts with documentation

README.md must include:

Setup instructions

Environment variable descriptions

Steps to run the application locally

Testing instructions

Migration process documentation

Postman collection or equivalent API test suite

Final Notes
Ask questions in the forum for clarification if any requirements are unclear

Do not make assumptions about functionality without approval

Maintain clean, structured, and well-documented code

Prisma schema and any related migration files should be well-documented
