# School Hub API

A standalone REST API service built with Node.js and Nitro for managing students, classes, and class assignments. This API provides a complete backend solution with OpenAPI documentation and Scalar API explorer, optimized for deployment on Vercel.

## 🚀 Features

- **RESTful API** - Complete CRUD operations for students and classes
- **Type Safety** - Built with TypeScript and Zod validation
- **OpenAPI 3.0** - Auto-generated API documentation
- **Scalar Documentation** - Beautiful interactive API explorer
- **CORS Support** - Ready for frontend integration
- **Supabase Integration** - Database operations through Supabase
- **Nitro Framework** - Modern server toolkit for universal deployment
- **Vercel Ready** - Zero-config deployment to Vercel

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or later)
- npm or yarn package manager
- Supabase project with the required schema

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the environment example file and configure your settings:

```bash
cp env.example .env
```

Update `.env` with your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# CORS Configuration
CORS_ORIGIN=http://localhost:9000

# Vercel Configuration (for ISR)
VERCEL_BYPASS_TOKEN=your-bypass-token
```

### 3. Database Schema

Make sure your Supabase database has the required schema. Run the SQL from `../frontend/supabase-schema.sql` in your Supabase SQL editor.

## 🚦 Running the API

### Development Mode

Start the development server with auto-reload:

```bash
npm run dev
```

### Production Mode

Build and preview the production version:

```bash
npm run build
npm run preview
```

The API will be available at:
- **Home Page**: http://localhost:3000 - Beautiful landing page with API overview
- **Interactive Documentation**: http://localhost:3000/docs - Scalar API explorer
- **OpenAPI Spec**: http://localhost:3000/api/openapi.json - Raw OpenAPI specification
- **Health Check**: http://localhost:3000/api/v1/health - API status endpoint

## 📖 API Documentation

### Interactive Documentation

Visit the following URLs to explore the API:

- **Scalar UI**: http://localhost:3000/docs (Modern, beautiful interface)

### Generate Static Documentation

To generate API documentation files:

```bash
npm run docs
```

This creates documentation files in the `docs/` directory.

## 🔌 API Endpoints

### Students

- `GET /api/v1/students` - Get all students
- `GET /api/v1/students/{id}` - Get student by ID
- `POST /api/v1/students` - Create a new student
- `PUT /api/v1/students/{id}` - Update a student
- `DELETE /api/v1/students/{id}` - Delete a student
- `POST /api/v1/students/{studentId}/assign-class` - Assign student to class
- `DELETE /api/v1/students/{studentId}/classes/{classId}` - Remove student from class

### Classes

- `GET /api/v1/classes` - Get all classes
- `GET /api/v1/classes/{id}` - Get class by ID
- `POST /api/v1/classes` - Create a new class
- `PUT /api/v1/classes/{id}` - Update a class
- `DELETE /api/v1/classes/{id}` - Delete a class
- `GET /api/v1/classes/{id}/students` - Get students in a class

## 📝 Example Usage

### Create a Student

```bash
curl -X POST http://localhost:8000/api/v1/students \
  -H "Content-Type: application/json" \
  -d '{"firstName": "John", "lastName": "Doe"}'
```

### Get All Students

```bash
curl http://localhost:8000/api/v1/students
```

### Create a Class

```bash
curl -X POST http://localhost:8000/api/v1/classes \
  -H "Content-Type: application/json" \
  -d '{"name": "Mathematics 101", "description": "Basic algebra and geometry"}'
```

### Assign Student to Class

```bash
curl -X POST http://localhost:8000/api/v1/students/{studentId}/assign-class \
  -H "Content-Type: application/json" \
  -d '{"classId": "{classId}"}'
```

## 🏗️ Project Structure

```
backend/
├── package.json             # Node.js dependencies and scripts
├── nitro.config.ts          # Nitro configuration
├── tsconfig.json            # TypeScript configuration
├── vercel.json              # Vercel deployment configuration
├── env.example              # Environment variables template
├── README.md               # This file
└── src/
    ├── index.ts             # Main application entry point
    ├── generate-docs.js     # Static documentation generator
    ├── api/                 # Nitro API routes
    │   └── v1/
    │       ├── students/    # Student API endpoints
    │       └── classes/     # Class API endpoints
    ├── services/
    │   ├── supabase.ts      # Supabase client configuration
    │   ├── students.ts      # Student business logic
    │   └── classes.ts       # Class business logic
    └── types/
        ├── api.ts           # API type definitions
        └
    └── types/
        ├── database.ts     # Database type definitions
        └── api.ts          # API request/response types
```

## 🔧 Development

### Adding New Endpoints

1. Define request/response schemas in `src/types/api.ts`
2. Add business logic to the appropriate service in `src/services/`
3. Create route handlers in `src/routes/`
4. Register routes in `src/main.ts`

### Type Safety

The API uses Zod for runtime validation and TypeScript for compile-time type safety. All request bodies and responses are validated automatically.

### Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes and error messages.

## 🚀 Deployment

### Environment Variables

Make sure to set the following environment variables in your deployment:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `PORT` (optional, defaults to 8000)
- `HOST` (optional, defaults to localhost)
- `CORS_ORIGIN` (set to your frontend URL)

### Vercel Deployment

This API is optimized for deployment on Vercel with zero configuration:

1. **Push to GitHub** - Push your code to a GitHub repository
2. **Connect to Vercel** - Import your repository in the Vercel dashboard
3. **Configure Environment Variables** - Add your Supabase credentials in the Vercel project settings:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `CORS_ORIGIN`
   - `VERCEL_BYPASS_TOKEN` (optional, for ISR)
4. **Deploy** - Vercel will automatically build and deploy your API

### Manual Deployment

For manual deployment, build the project and deploy the `.output` directory:

```bash
npm run build
```

The built output in `.output/` can be deployed to any Node.js hosting platform.

### Docker Deployment

You can create a `Dockerfile` for containerized deployment:

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]
```

## 🤝 Integration with Frontend

To use this API with your Quasar frontend, update your frontend API service to point to this backend instead of directly connecting to Supabase.

Example frontend configuration:

```typescript
// In your frontend api.ts
const API_BASE_URL = 'http://localhost:3000/api/v1';

export class StudentsAPI {
  static async getAll(): Promise<Student[]> {
    const response = await fetch(`${API_BASE_URL}/students`);
    const result = await response.json();
    return result.data;
  }
  
  // ... other methods
}
```

## 📄 License

This project is part of the School Hub application for recruitment purposes.
