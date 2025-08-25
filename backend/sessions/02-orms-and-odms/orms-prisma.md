# ⚡ ORMs with Prisma & PostgreSQL

<div align="center">

![Prisma Banner](https://media2.dev.to/dynamic/image/width=1280,height=720,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fia59h9w7j10soivayn70.png)

*Master Type-Safe Database Access with Modern ORM Technology*

[![Prisma](https://img.shields.io/badge/Prisma-5.0%2B-purple.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13%2B-blue.svg)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)

</div>

## 📖 Table of Contents

- [What is Prisma?](#what-is-prisma)
- [Core Concepts](#core-concepts)
- [Setting Up the Environment](#setting-up-the-environment)
- [Schema Definition](#schema-definition)
- [Migrations](#migrations)
- [CRUD Operations](#crud-operations)
- [Relations and Includes](#relations-and-includes)
- [Building a Complete API](#building-a-complete-api)
- [Best Practices](#best-practices)
- [Exercises](#exercises)

## 🤔 What is Prisma?

> **Prisma** is a next-generation ORM that makes database access easy with an auto-generated and type-safe client tailored to your database schema.

### The Prisma Toolkit 🛠️

| **Component** | **Purpose** | **Benefits** |
|:-------------:|:-----------:|:------------:|
| **Prisma Client** | Type-safe database client | Auto-completion, Type safety |
| **Prisma Migrate** | Database schema migration | Version control, Safe deployments |
| **Prisma Studio** | Database GUI | Visual data management |

### Why Choose Prisma? 🎯

```javascript
// Traditional ORM approach
const user = await User.findOne({
  where: { email: userEmail },
  include: ['posts', 'profile']
}); // No type safety, runtime errors possible

// Prisma approach
const user = await prisma.user.findUnique({
  where: { email: userEmail },
  include: { 
    posts: true, 
    profile: true 
  }
}); // Fully type-safe, auto-completion, compile-time checks
```

### Key Benefits ✨

- **🛡️ Type Safety**: Auto-generated types based on your database schema
- **🚀 Developer Experience**: Excellent auto-completion and IntelliSense
- **🔄 Database Agnostic**: Works with PostgreSQL, MySQL, SQLite, MongoDB
- **📊 Visual Database Browser**: Built-in Prisma Studio
- **🔧 Migration System**: Safe, versioned database schema changes
- **⚡ Performance**: Optimized queries and connection pooling

## 🧩 Core Concepts

### The Prisma Workflow

| Concept | Description | Example |
|---------|-------------|---------|
| **Schema** | Single source of truth for database structure | `schema.prisma` file |
| **Models** | Represent database tables | `model User { ... }` |
| **Relations** | Define relationships between models | `@relation` attribute |
| **Prisma Client** | Auto-generated, type-safe database client | `prisma.user.findMany()` |
| **Migrations** | Version-controlled database schema changes | `prisma migrate dev` |

## 🛠️ Setting Up the Environment

### 1. Project Initialization

```bash
# Create new project
mkdir prisma-course-api && cd prisma-course-api

# Initialize npm and TypeScript
npm init -y
npm install typescript ts-node @types/node --save-dev
npx tsc --init

# Install Prisma and dependencies
npm install prisma @prisma/client
npm install express cors helmet morgan dotenv
npm install -D @types/express @types/cors nodemon

# Create directory structure
mkdir src src/routes src/controllers src/utils
touch src/app.ts src/server.ts .env
```

### 2. TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. Initialize Prisma

```bash
# Initialize Prisma with PostgreSQL
npx prisma init --datasource-provider postgresql
```

### 4. Environment Configuration

```bash
# .env
DATABASE_URL="postgresql://username:password@localhost:5432/course_api_db"
PORT=3000
NODE_ENV=development
```

## 📋 Schema Definition

### Complete Course Management Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User model for instructors and students
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  avatar    String?
  bio       String?
  role      UserRole @default(STUDENT)
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  instructedCourses Course[]     @relation("Instructor")
  enrollments       Enrollment[]
  
  @@map("users")
}

// Course model
model Course {
  id          Int     @id @default(autoincrement())
  title       String
  description String?
  slug        String  @unique
  
  // Content and metadata
  category    Category
  difficulty  Difficulty @default(BEGINNER)
  
  // Pricing
  price       Decimal    @default(0) @db.Decimal(10, 2)
  currency    String     @default("USD")
  
  // Status
  isPublished Boolean @default(false)
  
  // SEO and marketing
  tags              String[]
  prerequisites     String[]
  learningOutcomes  String[]
  
  // Statistics
  enrollmentCount Int     @default(0)
  averageRating   Decimal @default(0) @db.Decimal(3, 2)
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  instructor   User         @relation("Instructor", fields: [instructorId], references: [id])
  instructorId Int
  lessons      Lesson[]
  enrollments  Enrollment[]
  
  // Indexes
  @@index([category, difficulty])
  @@index([isPublished, createdAt])
  @@map("courses")
}

// Lesson model
model Lesson {
  id          Int     @id @default(autoincrement())
  title       String
  description String?
  content     String
  
  // Lesson type and media
  type        LessonType @default(TEXT)
  videoUrl    String?
  duration    Int?       // Duration in seconds
  
  // Ordering
  order       Int
  isPreview   Boolean    @default(false)
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  course   Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
  courseId Int
  
  // Ensure unique ordering within course
  @@unique([courseId, order])
  @@index([courseId, order])
  @@map("lessons")
}

// Course enrollment
model Enrollment {
  id           Int      @id @default(autoincrement())
  enrolledAt   DateTime @default(now())
  completedAt  DateTime?
  progress     Decimal  @default(0) @db.Decimal(5, 2) // Percentage 0-100
  
  // Relations
  user     User   @relation(fields: [userId], references: [id])
  userId   Int
  course   Course @relation(fields: [courseId], references: [id])
  courseId Int
  
  // Prevent duplicate enrollments
  @@unique([userId, courseId])
  @@map("enrollments")
}

// Enums
enum UserRole {
  STUDENT
  INSTRUCTOR
  ADMIN
}

enum Category {
  PROGRAMMING
  DESIGN
  BUSINESS
  MARKETING
  LIFESTYLE
  SCIENCE
}

enum Difficulty {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum LessonType {
  TEXT
  VIDEO
  QUIZ
  ASSIGNMENT
}
```

## 🔄 Migrations

### Creating and Running Migrations

```bash
# Create and apply first migration
npx prisma migrate dev --name init

# Generate Prisma Client after schema changes
npx prisma generate

# Reset database (development only)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

## 📝 CRUD Operations

### Setting Up Prisma Client

```typescript
// src/utils/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
```

### Course Controller with Advanced CRUD

```typescript
// src/controllers/courseController.ts
import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { Prisma } from '@prisma/client';

export class CourseController {
  // Get all courses with filtering and pagination
  static async getAllCourses(req: Request, res: Response) {
    try {
      const {
        page = '1',
        limit = '10',
        category,
        difficulty,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Build where clause
      const where: Prisma.CourseWhereInput = {
        isPublished: true,
        ...(category && { category: category as any }),
        ...(difficulty && { difficulty: difficulty as any }),
        ...(search && {
          OR: [
            { title: { contains: search as string, mode: 'insensitive' } },
            { description: { contains: search as string, mode: 'insensitive' } },
            { tags: { has: search as string } }
          ]
        })
      };

      // Build orderBy clause
      const orderBy: Prisma.CourseOrderByWithRelationInput = {
        [sortBy as string]: sortOrder === 'desc' ? 'desc' : 'asc'
      };

      // Execute queries
      const [courses, total] = await Promise.all([
        prisma.course.findMany({
          where,
          orderBy,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          include: {
            instructor: {
              select: { id: true, name: true, avatar: true }
            },
            _count: {
              select: { lessons: true, enrollments: true }
            }
          }
        }),
        prisma.course.count({ where })
      ]);

      res.json({
        success: true,
        data: {
          courses,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
            hasNext: Number(page) * Number(limit) < total,
            hasPrev: Number(page) > 1
          }
        }
      });

    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch courses'
      });
    }
  }

  // Get single course with lessons
  static async getCourseById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const course = await prisma.course.findUnique({
        where: { id: Number(id) },
        include: {
          instructor: {
            select: { id: true, name: true, avatar: true, bio: true }
          },
          lessons: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              description: true,
              type: true,
              order: true,
              duration: true,
              isPreview: true
            }
          },
          _count: {
            select: { lessons: true, enrollments: true }
          }
        }
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      res.json({
        success: true,
        data: course
      });

    } catch (error) {
      console.error('Error fetching course:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch course'
      });
    }
  }

  // Create new course
  static async createCourse(req: Request, res: Response) {
    try {
      const {
        title,
        description,
        category,
        difficulty,
        price,
        tags,
        instructorId
      } = req.body;

      // Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const course = await prisma.course.create({
        data: {
          title,
          description,
          slug: `${slug}-${Date.now()}`,
          category,
          difficulty,
          price: price ? Number(price) : 0,
          tags: tags || [],
          instructorId: Number(instructorId)
        },
        include: {
          instructor: {
            select: { id: true, name: true, avatar: true }
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: course
      });

    } catch (error) {
      console.error('Error creating course:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return res.status(400).json({
            success: false,
            message: 'Course with this slug already exists'
          });
        }
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create course'
      });
    }
  }

  // Delete course
  static async deleteCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.course.delete({
        where: { id: Number(id) }
      });

      res.json({
        success: true,
        message: 'Course deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting course:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return res.status(404).json({
            success: false,
            message: 'Course not found'
          });
        }
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete course'
      });
    }
  }
}
```

## 🔗 Relations and Includes

### Advanced Relationship Queries

```typescript
// Complex includes with nested relations
const courseWithEverything = await prisma.course.findUnique({
  where: { id: courseId },
  include: {
    instructor: {
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true
      }
    },
    lessons: {
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        type: true,
        order: true,
        duration: true,
        isPreview: true
      }
    },
    enrollments: {
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      },
      take: 20
    },
    _count: {
      select: {
        lessons: true,
        enrollments: true
      }
    }
  }
});

// Aggregation queries
const courseStats = await prisma.course.aggregate({
  where: { isPublished: true },
  _count: { id: true },
  _avg: { 
    price: true,
    averageRating: true 
  },
  _max: { 
    enrollmentCount: true 
  }
});

// Group by queries
const coursesByCategory = await prisma.course.groupBy({
  by: ['category'],
  where: { isPublished: true },
  _count: { id: true },
  _avg: { averageRating: true }
});
```

## 🏗️ Building a Complete API

### Express App with Type Safety

```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { courseRoutes } from './routes/courses';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/courses', courseRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handlers
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

export default app;
```

### Course Routes

```typescript
// src/routes/courses.ts
import { Router } from 'express';
import { CourseController } from '../controllers/courseController';

const router = Router();

router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);
router.post('/', CourseController.createCourse);
router.delete('/:id', CourseController.deleteCourse);

export { router as courseRoutes };
```

## 🚀 Best Practices

### Performance Optimization

| Technique | Description | Example |
|-----------|-------------|---------|
| **Select Fields** | Only fetch needed fields | `select: { id: true, title: true }` |
| **Pagination** | Always paginate large datasets | `skip` and `take` |
| **Indexing** | Use database indexes | `@@index([category, difficulty])` |
| **Connection Pooling** | Configure connection pool | Database URL parameters |

### Security Best Practices

```typescript
// Input validation with Zod
import { z } from 'zod';

const createCourseSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  category: z.enum(['PROGRAMMING', 'DESIGN', 'BUSINESS']),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  instructorId: z.number().int().positive()
});

// Validation middleware
export const validateCreateCourse = (req: Request, res: Response, next: NextFunction) => {
  try {
    createCourseSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }
    next(error);
  }
};
```

### Error Handling

```typescript
// Error handling middleware
import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  // Prisma specific errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return res.status(409).json({
          success: false,
          message: 'Resource already exists'
        });
      
      case 'P2025':
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
    }
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};
```

## 🧪 Exercises

### Exercise 1: Basic Setup (Beginner)
1. Initialize TypeScript project with Prisma
2. Create User and Post schema
3. Run first migration
4. Explore Prisma Studio

### Exercise 2: Advanced Relations (Intermediate)
1. Create User, Post, Comment models
2. Implement relationships
3. Add complex queries with includes
4. Implement pagination and filtering

### Exercise 3: Production API (Advanced)
1. Implement complete schema from guide
2. Add authentication and authorization
3. Create comprehensive API endpoints
4. Add validation and error handling
5. Write comprehensive tests

---

<div align="center">

**Congratulations! You've mastered both ORMs and ODMs** 🎉

[← Back to Mongoose & MongoDB](./odms-mongoose.md) | [← Back to Introduction](./intro.md) | [← Back to Main Course](./README.md)


### 🏆 **Workshop Complete!**

</div>