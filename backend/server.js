import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import fileUpload from 'express-fileupload';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import apiRoutes from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Parse CORS origins from environment variable
function parseCorsOrigins(corsOriginsEnv) {
  if (!corsOriginsEnv) {
    // Default permissive for local development
    return [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173'
    ];
  }

  return corsOriginsEnv.split(',').map(origin => origin.trim());
}

// CORS configuration with wildcard support
function createCorsOptions() {
  const corsOrigins = parseCorsOrigins(process.env.CORS_ORIGINS);
  
  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check exact matches first
      if (corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Check wildcard patterns
      const isAllowed = corsOrigins.some(allowedOrigin => {
        if (allowedOrigin.includes('*')) {
          // Convert wildcard pattern to regex
          const pattern = allowedOrigin
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*');
          const regex = new RegExp(`^${pattern}$`);
          return regex.test(origin);
        }
        return false;
      });
      
      if (isAllowed) {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  };
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(limiter);
app.use(cors(createCorsOptions()));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
app.use(fileUpload({
  limits: { 
    fileSize: 100 * 1024 * 1024, // 100 MB limit
    files: 10 // Maximum 10 files per upload
  },
  abortOnLimit: true,
  createParentPath: true,
  tempFileDir: join(__dirname, 'temp'),
  useTempFiles: true,
  safeFileNames: true,
  preserveExtension: true
}));

// Ensure temp and uploads directories exist
const tempDir = join(__dirname, 'temp');
const uploadsDir = join(__dirname, 'uploads');

[tempDir, uploadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      error: 'CORS policy violation',
      message: 'Origin not allowed'
    });
  }
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large',
      message: 'File size exceeds 100MB limit'
    });
  }
  
  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(413).json({
      error: 'Too many files',
      message: 'Maximum 10 files per upload'
    });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 NGS-seq-qc backend server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 API base URL: http://localhost:${PORT}/api`);
  
  if (process.env.CORS_ORIGINS) {
    console.log(`🌐 CORS origins configured: ${process.env.CORS_ORIGINS}`);
  } else {
    console.log(`🌐 CORS: Development mode (permissive localhost)`);
  }
});

export default app;