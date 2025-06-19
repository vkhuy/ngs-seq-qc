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

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd seqQC

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the application
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
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (buttons, cards, etc.)
│   ├── Navigation.tsx   # App navigation
│   ├── UploadSection.tsx # File upload interface
│   └── QCVisualization.tsx # Quality control charts
├── pages/               # Route components
│   ├── Index.tsx        # Homepage with upload
│   ├── QCResults.tsx    # Results page
│   └── NotFound.tsx     # 404 page
├── lib/                 # Utility functions
│   └── utils.ts         # Common utilities
├── hooks/               # Custom React hooks
├── App.tsx              # Main app component
├── App.css              # Global styles
└── main.tsx             # App entry point
```

## 🚀 Deployment

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

For production deployment, you may want to add:

```bash
# .env (optional)
VITE_APP_NAME=SeqQC
VITE_APP_VERSION=1.0.0
```

## 📝 API Integration (Future)

The current implementation uses mock data. To integrate with a real backend:

1. **Replace mock data** in `QCVisualization.tsx` with API calls
2. **Add loading states** during real processing
3. **Implement file upload** to your NGS processing service
4. **Add authentication** if needed

Example API integration:

```typescript
// In UploadSection.tsx
const uploadAndAnalyze = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  return response.json();
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
