# NGS-seq-qc Backend

Backend server for the NGS sequence quality control platform. Handles file uploads, FASTQ processing, and provides REST API endpoints for the frontend.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
cd backend
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env file with your settings

# Start development server
npm run dev
```

The server will start on `http://localhost:3001` by default.

### Production Deployment

The backend is designed to be deployed on platforms like Render, Railway, or Fly.io that support persistent storage for file uploads.

## 🌐 CORS Configuration

The backend supports configurable CORS with wildcard pattern matching for easy deployment with preview environments.

### Environment Variables

- `CORS_ORIGINS`: Comma-separated list of allowed origins
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)

### CORS Examples

```bash
# Single origin
CORS_ORIGINS=https://ngs-seq-qc.vercel.app

# Multiple origins
CORS_ORIGINS=https://ngs-seq-qc.vercel.app,https://staging.example.com

# Wildcard for Vercel branch previews
CORS_ORIGINS=https://ngs-seq-qc-git-*.vercel.app

# Mixed patterns
CORS_ORIGINS=https://production.com,https://staging-*.example.com,http://localhost:3000
```

### Default Development CORS

When `CORS_ORIGINS` is not set, the server allows these localhost origins for development:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

## 📁 API Endpoints

### Health Check
- `GET /health` - Server health status

### File Operations
- `POST /api/upload` - Upload FASTQ files for analysis
- `GET /api/files` - List uploaded files
- `GET /api/analysis/:fileId` - Get analysis results for a file

### Upload Limits
- Maximum file size: 100 MB per file
- Maximum files per upload: 10 files
- Supported formats: `.fastq`, `.fq`, `.fastq.gz`, `.fq.gz`

## 🚀 Deployment

### Deploy to Render

1. **One-click deploy** using the included `render.yaml`:
   - Fork this repository
   - Connect your GitHub account to Render
   - Create a new Web Service and select this repository
   - Render will automatically detect the `render.yaml` configuration

2. **Manual deployment**:
   - Create a new Web Service on Render
   - Connect your repository
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`
   - Add environment variables (see below)

3. **Environment variables to set in Render**:
   ```
   NODE_ENV=production
   CORS_ORIGINS=https://your-frontend-domain.vercel.app
   ```

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd backend
railway init
railway up
```

### Deploy to Fly.io

```bash
# Install Fly CLI and deploy
cd backend
fly launch
fly deploy
```

## 💾 File Storage

### Local Development
Files are stored in `backend/uploads/` directory with unique timestamps.

### Production Considerations
For production deployments, consider:

1. **Persistent disk** (Render, Railway): Enable disk storage for uploads
2. **Object storage** (AWS S3, Cloudinary): For scalable file storage
3. **Database integration**: Store file metadata and analysis results
4. **Cleanup jobs**: Remove old files to manage storage costs

### Render Persistent Disk Example

Uncomment in `render.yaml`:
```yaml
disk:
  name: uploads
  mountPath: /app/backend/uploads
  sizeGB: 1
```

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test file upload
curl -X POST \
  -F "files=@sample.fastq" \
  http://localhost:3001/api/upload
```

## 🔧 Development

### File Structure
```
backend/
├── server.js          # Main Express server
├── routes/
│   └── api.js         # API route handlers
├── uploads/           # Uploaded files (created automatically)
├── temp/              # Temporary files (created automatically)
├── package.json       # Dependencies and scripts
└── .env.example       # Environment template
```

### Adding New Features

1. **New API endpoints**: Add routes to `routes/api.js`
2. **File processing**: Integrate with FastQC or other bioinformatics tools
3. **Database**: Add MongoDB or PostgreSQL for persistent data storage
4. **Authentication**: Add JWT or OAuth for user management

## 📝 Notes

- Files are currently processed with mock data for demonstration
- In production, integrate with actual FastQC or similar tools
- Consider adding rate limiting and authentication for production use
- The server automatically creates necessary directories on startup