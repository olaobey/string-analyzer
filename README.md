# String Analyzer Service (NestJS + TypeORM + PostgreSQL)

A RESTful API that analyzes strings and stores computed properties.

## Features
- **POST /api/v1/strings** Analyze & store string (id = SHA-256)
- **GET /api/v1/strings/:string_value** Retrieve by *original string*
- **GET /api/v1/strings** Filtered listing (`is_palindrome`, `min_length`, `max_length`, `word_count`, `contains_character`)
- **GET /api/v1/strings/filter-by-natural-language?query=...** Natural language filtering (heuristics)
- **DELETE /api/v1/strings/:string_value** Delete by *original string*
- **Swagger Docs** at `/docs`
- **Validation & Error Handling** per spec
- **Docker** for API + Postgres
- **Unit Tests** for core logic

## Stack
- Node.js 20, NestJS 10, TypeScript
- TypeORM 0.3, PostgreSQL 16 (JSONB for frequency map)
- class-validator / transformer, Swagger

## Run locally (no Docker)
1. `cp .env.example .env` and update values if needed
2. Ensure Postgres is running and DB exists: