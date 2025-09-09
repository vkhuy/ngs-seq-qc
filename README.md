# SeqQC - NGS Quality Control Platform

![SeqQC Logo](https://img.shields.io/badge/SeqQC-NGS%20Quality%20Control-blue?style=for-the-badge&logo=dna)

A modern, web-based NGS (Next-Generation Sequencing) quality control platform that provides FastQC-style analysis and visualizations for sequencing data. Built with React, TypeScript, and modern web technologies.

## 🧬 Features

### Core Functionality

- **FastQC-Compatible Analysis**: Industry-standard quality control metrics
- **Multi-Format Support**: FASTQ, FQ, and compressed (.gz) files
- **Real-time Processing**: Fast analysis with progress tracking
- **Interactive Visualizations**: Professional charts and graphs
- **Comprehensive Reports**: Detailed quality metrics and recommendations

### Quality Control Modules

- ✅ Basic Statistics
- ✅ Per Base Sequence Quality
- ✅ Per Sequence Quality Scores
- ✅ Per Base Sequence Content
- ✅ Per Sequence GC Content
- ✅ Per Base N Content
- ✅ Sequence Length Distribution
- ✅ Adapter Content Analysis

### Technical Features

- 🚀 **Fast & Responsive**: Built with modern React and Vite
- 📱 **Mobile-Friendly**: Responsive design for all devices
- 🎨 **Modern UI**: Clean, professional interface designed for scientists
- 🔒 **Secure**: Client-side processing, no data stored permanently
- 📊 **Rich Visualizations**: Interactive charts with Recharts
- 🎯 **TypeScript**: Full type safety and better developer experience

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Local Development

1. **Clone the repository**:
```bash
git clone <your-repo-url>
cd ngs-seq-qc
```

2. **Start the backend server**:
```bash
# Install backend dependencies
cd backend
npm install

# Copy environment file (optional for local dev)
cp .env.example .env

# Start backend server
npm run dev
```

3. **Start the frontend** (in a new terminal):
```bash
# Install frontend dependencies
npm install

# Copy environment file and configure API URL
cp .env.example .env
# Edit .env file to set VITE_API_URL=http://localhost:3001/api

# Start frontend development server
npm run dev
```

The application will be available at `http://localhost:5173` with the backend at `http://localhost:3001`.

### Building for Production

```bash
# Build the frontend
npm run build

# Preview the production build
npm run preview
```

## 📖 Usage

### 1. Upload Files

- Navigate to the homepage
- Drag and drop FASTQ files or click "Browse Files"
- Supported formats: `.fastq`, `.fq`, `.fastq.gz`
- Multiple files can be uploaded simultaneously

### 2. Run Analysis

- Click "Start Quality Control Analysis"
- Wait for processing to complete (typically 2-5 minutes)
- Automatic redirection to results page

### 3. View Results

- Comprehensive quality reports with FastQC-style visualizations
- Interactive charts for:
  - Sequence quality scores
  - GC content distribution
  - Sequence length analysis
  - Adapter contamination
- Export capabilities for sharing results

## 🏗️ Tech Stack

### Frontend

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **React Router 6** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Visualization

- **Recharts** - Composable charting library
- **Custom FastQC-style plots** - Quality control visualizations

### Build Tools

- **Vite** - Fast build tool and dev server
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Testing & Quality

- **Vitest** - Unit testing framework
- **TypeScript** - Static type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🎨 Design System

### Color Palette

```css
/* Biotech Primary Colors */
--biotech-500: #0ea5e9 /* Primary blue */ --science-500: #22c55e
  /* Science green */ /* Quality Status Colors */ --quality-excellent: #16a34a
  /* Green - Pass */ --quality-good: #22c55e /* Light green */
  --quality-warning: #f59e0b /* Amber - Warning */ --quality-poor: #ef4444
  /* Red - Fail */;
```

### Typography

- Primary: `ui-sans-serif, system-ui, sans-serif`
- Headings: Bold weights (600-700)
- Body: Regular weight (400)

## 📁 Project Structure

```
├── README.md             # This file
├── .env.example          # Frontend environment template
├── package.json          # Frontend dependencies
├── vite.config.ts        # Vite configuration
├── src/                  # Frontend source code
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # Base UI components (buttons, cards, etc.)
│   │   ├── Navigation.tsx # App navigation
│   │   ├── UploadSection.tsx # File upload interface
│   │   └── QCVisualization.tsx # Quality control charts
│   ├── pages/            # Route components
│   │   ├── Index.tsx     # Homepage with upload
│   │   ├── QCResults.tsx # Results page
│   │   └── NotFound.tsx  # 404 page
│   ├── lib/              # Utility functions
│   │   └── utils.ts      # Common utilities
│   ├── hooks/            # Custom React hooks
│   ├── App.tsx           # Main app component
│   ├── App.css           # Global styles
│   └── main.tsx          # App entry point
├── backend/              # Backend server
│   ├── README.md         # Backend documentation
│   ├── .env.example      # Backend environment template
│   ├── package.json      # Backend dependencies
│   ├── server.js         # Express server
│   ├── routes/
│   │   └── api.js        # API route handlers
│   ├── uploads/          # Uploaded files (auto-created)
│   └── temp/             # Temporary files (auto-created)
└── render.yaml           # Render deployment configuration
```

## 🚀 Deployment

### Production Deployment

For production, deploy the backend and frontend separately:

#### Backend Deployment (Render - Recommended)

1. **One-click deploy with render.yaml**:
   - Fork this repository 
   - Create a [Render](https://render.com) account
   - Create a new "Web Service" and connect your GitHub repository
   - Render will automatically detect the `render.yaml` configuration
   - Set the `CORS_ORIGINS` environment variable to match your frontend domain

2. **Manual Render deployment**:
   - Create a new Web Service on Render
   - Build command: `cd backend && npm install`
   - Start command: `cd backend && npm start`
   - Environment variables:
     ```
     NODE_ENV=production
     CORS_ORIGINS=https://your-frontend-domain.vercel.app
     ```

3. **Alternative platforms**: Railway, Fly.io, or any Node.js hosting service
   - See `backend/README.md` for specific deployment guides

#### Frontend Deployment (Vercel - Recommended)

1. **Deploy to Vercel**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project directory  
vercel

# Follow the prompts:
# - Set up and deploy: Yes
# - Which scope: (Select your account)
# - Link to existing project: No
# - Project name: ngs-seq-qc (or your preferred name)
# - Directory: `./` (current directory)
# - Override settings: No
```

2. **Set environment variables in Vercel**:
   - Go to your Vercel project dashboard
   - Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-domain.onrender.com/api`

3. **Alternative: Deploy via Vercel Dashboard**:
   - Push your code to GitHub/GitLab/Bitbucket
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" and import your repository
   - Vercel will automatically detect the Vite configuration
   - Set the `VITE_API_URL` environment variable

### Environment Variables

#### Frontend (.env)
```bash
# Backend API URL
VITE_API_URL=https://your-backend-domain.onrender.com/api
```

#### Backend (backend/.env)
```bash
# Server port
PORT=3001

# CORS allowed origins (supports wildcards)
CORS_ORIGINS=https://ngs-seq-qc-git-*.vercel.app

# Environment
NODE_ENV=production
```

### CORS Configuration

The backend supports flexible CORS configuration with wildcard patterns:

```bash
# Single origin
CORS_ORIGINS=https://ngs-seq-qc.vercel.app

# Multiple origins  
CORS_ORIGINS=https://ngs-seq-qc.vercel.app,https://staging.example.com

# Wildcard for Vercel branch previews
CORS_ORIGINS=https://ngs-seq-qc-git-*.vercel.app

# Mixed patterns
CORS_ORIGINS=https://production.com,https://staging-*.example.com
```

### Verification

After deployment:

1. **Test backend health**: Visit `https://your-backend-domain.onrender.com/health`
2. **Test frontend**: Visit your Vercel URL and try uploading a file
3. **Check CORS**: Ensure no CORS errors in browser console

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:

```bash
npm i -g vercel
```

2. **Deploy from your project directory**:

```bash
vercel
```

3. **Follow the prompts**:

   - Set up and deploy: Yes
   - Which scope: (Select your account)
   - Link to existing project: No
   - Project name: seqQC (or your preferred name)
   - Directory: `./` (current directory)
   - Override settings: No

4. **Your app will be deployed and you'll get a URL like**: `https://seq-qc-xyz.vercel.app`

**Note**: If you encounter build issues, the configuration has been optimized with:

- Robust path alias resolution in `vite.config.ts`
- TypeScript path mapping in `tsconfig.paths.json`
- Code splitting for better performance
- Proper file extensions handling

### Alternative: Deploy via Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Vercel will automatically detect the Vite configuration
6. Click "Deploy"

### Build Configuration

Vercel automatically detects these settings for Vite projects:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run typecheck    # Check TypeScript types
npm run format.fix   # Format code with Prettier
```

### Adding New Features

1. **New Components**: Add to `src/components/`
2. **New Pages**: Add to `src/pages/` and update `App.tsx` routing
3. **Styling**: Use TailwindCSS classes and the custom biotech color scheme
4. **Types**: Add TypeScript interfaces in component files or `src/types/`

### Environment Variables

#### Frontend Development (.env)
```bash
# Backend API URL for local development
VITE_API_URL=http://localhost:3001/api

# Optional app configuration
VITE_APP_NAME=SeqQC
VITE_APP_VERSION=1.0.0
```

#### Backend Development (backend/.env)
```bash
# Server port
PORT=3001

# CORS origins (optional for local dev)
# CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Environment mode
NODE_ENV=development
```

For production deployment, see the [Deployment](#-deployment) section above.

## 🔗 Backend Integration

The application includes a complete Express.js backend that handles:

- **File uploads**: Secure FASTQ file processing with validation
- **CORS configuration**: Flexible origin management with wildcard support  
- **Quality control**: Mock FastQC-style analysis (ready for real tool integration)
- **REST API**: RESTful endpoints for file management and analysis

### API Endpoints

- `GET /health` - Health check
- `POST /api/upload` - Upload FASTQ files
- `GET /api/files` - List uploaded files  
- `GET /api/analysis/:fileId` - Get analysis results

### Real FastQC Integration

To integrate with actual FastQC tools:

1. **Install FastQC** on your server
2. **Replace mock analysis** in `backend/routes/api.js`
3. **Add file processing** with child processes:

```javascript
import { exec } from 'child_process';

// Example FastQC integration
const runFastQC = (filePath) => {
  return new Promise((resolve, reject) => {
    exec(`fastqc ${filePath} --outdir=./results`, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve(stdout);
    });
  });
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [FastQC](https://www.bioinformatics.babraham.ac.uk/projects/fastqc/) by Babraham Bioinformatics
- Built with modern web technologies for the bioinformatics community
- Icons by [Lucide](https://lucide.dev/)
- UI components powered by [Radix UI](https://www.radix-ui.com/)

## 📞 Support

For questions, issues, or contributions:

- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**SeqQC** - Making NGS quality control accessible, fast, and beautiful. 🧬✨
