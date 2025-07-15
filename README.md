🔁 Legacy Lookup API Migration — Modernized to NestJS + Prisma + PostgreSQL
Tech Stack: NestJS, TypeScript, PostgreSQL, Prisma ORM, JWT, REST APIs, OpenAPI

📌 Overview
Migrated a legacy JavaScript/Express-based Lookup API system to a robust, modular, and type-safe backend architecture using NestJS and Prisma. The system handles structured reference data (countries, devices, institutions) and supports full CRUD, filtering, and authentication workflows.

💡 Modernization Highlights
Migrated from legacy JavaScript/Express to TypeScript/NestJS

Replaced DynamoDB and Elasticsearch with PostgreSQL, improving relational data integrity

Implemented fully normalized Prisma models for:

Country

EducationalInstitution

Device

Modularized backend with NestJS modules:

CountriesModule, DevicesModule, EducationalInstitutionsModule, AuthModule

⚙️ Engineering Features
🔧 Bootstrapped NestJS app with modular folder structure and environment configs

📚 Auto-generated full OpenAPI (Swagger) documentation for all routes

🧩 Integrated Prisma ORM with efficient PostgreSQL connection pooling

🧪 Wrote 20+ unit tests and seed scripts to enable CI and test automation

📦 Created custom SQL migration scripts for seamless legacy-to-modern DB transformation

🔐 Retained complete JWT-based authentication, M2M/admin access, and API filters

📘 Delivered 30+ documented endpoints + Postman test suite for validation

📊 Validated SQL via Prisma logging: paginated results, count queries, deep filtering

✅ Key Outcomes
🔁 100% migration completed with feature parity from legacy API

🧩 Designed and deployed normalized Prisma models with referential integrity

⚙️ Improved local dev environment speed by ~70% by removing DynamoDB/ES dependencies

📦 Migrated thousands of records with zero data loss

🔧 Reduced infrastructure complexity by ~60%

📘 Shipped complete API documentation + tests to support new dev onboarding

🧪 Fun Debug Moment
🤯 Faced a live production bug where PostgreSQL admin shut down during a mid-query request!
➤ Diagnosed via Prisma logs and implemented fallback connection handling.

