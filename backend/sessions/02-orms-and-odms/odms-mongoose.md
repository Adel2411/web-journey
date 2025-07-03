# 🍃 ODMs with Mongoose & MongoDB

<div align="center">

![Mongoose Banner](https://miro.medium.com/v2/resize:fit:1050/1*OYpEW3PMltGC2MVvJ-5QTw.png)

*Master Object-Document Mapping with the most popular Node.js ODM*

[![Mongoose](https://img.shields.io/badge/Mongoose-8.0%2B-red.svg)](https://mongoosejs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0%2B-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18%2B-blue.svg)](https://expressjs.com/)

</div>

## 📖 Table of Contents

- [🍃 ODMs with Mongoose \& MongoDB](#-odms-with-mongoose--mongodb)
  - [📖 Table of Contents](#-table-of-contents)
  - [🤔 What is Mongoose?](#-what-is-mongoose)
    - [Why Mongoose? 🎯](#why-mongoose-)
    - [Key Benefits ✨](#key-benefits-)
  - [🧩 Core Concepts](#-core-concepts)
    - [The Mongoose Trinity](#the-mongoose-trinity)
    - [Schema Types 📊](#schema-types-)
  - [🛠️ Setting Up the Environment](#️-setting-up-the-environment)
    - [1. Project Initialization](#1-project-initialization)
    - [2. Environment Configuration](#2-environment-configuration)
  - [🔌 Database Connection](#-database-connection)
  - [📋 Schemas and Models](#-schemas-and-models)
    - [Course Model with Advanced Schema](#course-model-with-advanced-schema)
    - [Lesson Model](#lesson-model)
  - [📝 CRUD Operations](#-crud-operations)
    - [Complete CRUD with Advanced Features](#complete-crud-with-advanced-features)
  - [🔗 Relationships and Population](#-relationships-and-population)
    - [Advanced Population Examples](#advanced-population-examples)
  - [🏗️ Building a Complete API](#️-building-a-complete-api)
    - [Express App Setup](#express-app-setup)
  - [🎯 Best Practices](#-best-practices)
    - [Performance Optimization](#performance-optimization)
    - [Security Best Practices](#security-best-practices)

## 🤔 What is Mongoose?

> **Mongoose** is the most popular Object-Document Mapper (ODM) for MongoDB and Node.js. It provides a schema-based solution to model your application data.

### Why Mongoose? 🎯

| **Raw MongoDB Driver** | **Mongoose ODM** |
|:----------------------:|:----------------:|
| Manual validation | Schema-based validation |
| No structure enforcement | Consistent data structure |
| Complex relationships | Easy population |
| Verbose queries | Chainable query builder |

### Key Benefits ✨

- **📋 Schema Definition**: Structure your data even in a schema-less database
- **✅ Built-in Validation**: Ensure data integrity with custom validators
- **🔗 Relationship Management**: Handle references and embedded documents
- **🎣 Middleware Support**: Pre/post hooks for document operations
- **🔍 Query Builder**: Chainable, expressive query interface

## 🧩 Core Concepts

### The Mongoose Trinity

| Concept | Description | Example |
|---------|-------------|---------|
| **Schema** | Defines structure, validation, and behavior | `new Schema({ title: String })` |
| **Model** | Compiled from schema, constructor for documents | `model('Course', courseSchema)` |
| **Document** | Instance of a model, represents a single record | `new Course({ title: 'JavaScript' })` |

### Schema Types 📊

```javascript
const exampleSchema = new Schema({
  // Basic types
  name: String,
  age: Number,
  isActive: Boolean,
  birthDate: Date,
  tags: [String],
  metadata: Schema.Types.Mixed,
  
  // Validation and constraints
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (v) => /\S+@\S+\.\S+/.test(v),
      message: 'Invalid email format'
    }
  },
  
  // Default values
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'active', enum: ['active', 'inactive'] }
});
```

## 🛠️ Setting Up the Environment

### 1. Project Initialization

```bash
# Create new project
mkdir mongoose-course-api && cd mongoose-course-api
npm init -y

# Install dependencies
npm install mongoose express dotenv cors helmet morgan
npm install -D nodemon

# Create directory structure
mkdir models routes middleware config
touch app.js server.js .env .gitignore
```

### 2. Environment Configuration

```bash
# .env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/course-api
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/course-api
```

## 🔌 Database Connection

```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('💥 Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## 📋 Schemas and Models

### Course Model with Advanced Schema

```javascript
// models/Course.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
    index: true
  },
  
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Categorization
  category: {
    type: String,
    required: true,
    enum: {
      values: ['programming', 'design', 'business', 'marketing', 'lifestyle'],
      message: '{VALUE} is not a valid category'
    }
  },
  
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  
  // Instructor Information
  instructor: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          return /\S+@\S+\.\S+/.test(v);
        },
        message: 'Please enter a valid email address'
      }
    },
    bio: String,
    avatar: String
  },
  
  // Course Content - Referenced Lessons
  lessons: [{
    type: Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  
  // Course Metadata
  isPublished: {
    type: Boolean,
    default: false
  },
  
  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  
  // Statistics
  enrollmentCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // SEO
  slug: {
    type: String,
    unique: true,
    lowercase: true
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
courseSchema.index({ category: 1, difficulty: 1 });
courseSchema.index({ isPublished: 1, createdAt: -1 });

// Virtual properties
courseSchema.virtual('lessonCount').get(function() {
  return this.lessons ? this.lessons.length : 0;
});

courseSchema.virtual('formattedPrice').get(function() {
  return this.price === 0 ? 'Free' : `$${this.price}`;
});

// Pre-save middleware
courseSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Instance methods
courseSchema.methods.addLesson = function(lessonId) {
  if (!this.lessons.includes(lessonId)) {
    this.lessons.push(lessonId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Static methods
courseSchema.statics.findByCategory = function(category) {
  return this.find({ category, isPublished: true });
};

module.exports = mongoose.model('Course', courseSchema);
```

### Lesson Model

```javascript
// models/Lesson.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const lessonSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  content: {
    type: String,
    required: [true, 'Lesson content is required']
  },
  
  type: {
    type: String,
    enum: ['video', 'text', 'quiz', 'assignment'],
    default: 'text'
  },
  
  videoUrl: String,
  videoDuration: Number, // in seconds
  
  order: {
    type: Number,
    required: true,
    min: 1
  },
  
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  
  isPreview: {
    type: Boolean,
    default: false
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Ensure unique order within course
lessonSchema.index({ course: 1, order: 1 }, { unique: true });

// Virtual for formatted duration
lessonSchema.virtual('formattedDuration').get(function() {
  if (!this.videoDuration) return null;
  const minutes = Math.floor(this.videoDuration / 60);
  const seconds = this.videoDuration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

module.exports = mongoose.model('Lesson', lessonSchema);
```

## 📝 CRUD Operations

### Complete CRUD with Advanced Features

```javascript
// routes/courses.js
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

// GET all courses with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      difficulty,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isPublished: true };
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('lessons', 'title type order isPreview')
        .select('-__v'),
      Course.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
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
});

// GET single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate({
        path: 'lessons',
        select: 'title type order isPreview videoDuration',
        options: { sort: { order: 1 } }
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
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch course'
    });
  }
});

// CREATE new course
router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });

  } catch (error) {
    console.error('Error creating course:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create course'
    });
  }
});

// Add lesson to course
router.post('/:courseId/lessons', async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const lessonData = {
      ...req.body,
      course: courseId
    };
    
    const lesson = new Lesson(lessonData);
    await lesson.save();
    
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $push: { lessons: lesson._id } },
      { new: true }
    ).populate('lessons', 'title type order');
    
    if (!course) {
      await Lesson.findByIdAndDelete(lesson._id);
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Lesson added successfully',
      data: { lesson, course }
    });
    
  } catch (error) {
    console.error('Error adding lesson:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add lesson'
    });
  }
});

module.exports = router;
```

## 🔗 Relationships and Population

### Advanced Population Examples

```javascript
// Basic Population
router.get('/:id/basic', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('lessons'); // Populate all lesson fields
    
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Selective Field Population
router.get('/:id/selective', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('lessons', 'title type order videoDuration'); // Only specific fields
    
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Conditional Population
router.get('/:id/conditional', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate({
        path: 'lessons',
        match: { isPreview: true }, // Only preview lessons
        select: 'title type order',
        options: { sort: { order: 1 } }
      });
    
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## 🏗️ Building a Complete API

### Express App Setup

```javascript
// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');

// Import routes
const courseRoutes = require('./routes/courses');
const lessonRoutes = require('./routes/lessons');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);

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

app.use((error, req, res, next) => {
  console.error('Global error:', error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

module.exports = app;
```

## 🎯 Best Practices

### Performance Optimization

| Practice | Description | Example |
|----------|-------------|---------|
| **Indexing** | Create indexes on frequently queried fields | `schema.index({ category: 1 })` |
| **Population** | Only populate necessary fields | `.populate('lessons', 'title order')` |
| **Pagination** | Always implement pagination | `skip()` and `limit()` |
| **Lean Queries** | Use `.lean()` for read-only operations | `Course.find().lean()` |

### Security Best Practices

```javascript
// Input validation middleware
const validateCourse = (req, res, next) => {
  const { title, category } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    });
  }
  
  const validCategories = ['programming', 'design', 'business', 'marketing', 'lifestyle'];
  if (category && !validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category'
    });
  }
  
  next();
};
```

---

<div align="center">

**Ready for type-safe queries?** ⚡

[Continue with Prisma & PostgreSQL →](./orms-prisma.md)

[← Back to Introduction](./intro.md) | [← Back to Main Course](./README.md)

</div>