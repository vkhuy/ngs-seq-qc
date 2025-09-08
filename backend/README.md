# SeqQC Backend

Node.js/Express backend server for the SeqQC NGS quality control application.

## Features

- **File Upload**: Accept FASTQ files (.fastq, .fq, .fastq.gz, .fq.gz) up to 100MB
- **FASTQ Processing**: Parse and analyze FASTQ files for quality control metrics
- **FastQC-Style Analysis**: Generate comprehensive QC reports including:
  - Basic statistics
  - Per-base sequence quality
  - Quality score distributions  
  - Sequence length analysis
  - Nucleotide content per position
  - GC content calculation

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### File Upload
```
POST /api/upload
Content-Type: multipart/form-data
Body: file (FASTQ file)
```
Uploads and starts processing a FASTQ file. Returns processing ID.

### Get Results
```
GET /api/results/:id
```
Retrieves quality control analysis results for a processed file.

## Development

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
Server runs on http://localhost:3001

### Build for Production
```bash
npm run build
npm start
```

## File Structure

```
src/
├── server.ts          # Express server setup
├── routes/
│   ├── upload.ts      # File upload handling
│   └── results.ts     # Results retrieval
├── utils/
│   ├── fastqProcessor.ts    # FASTQ parsing and analysis
│   └── resultsStorage.ts    # Results persistence
└── types/
    └── qc.ts          # TypeScript type definitions
```

## Technologies

- **Express.js**: Web framework
- **TypeScript**: Type safety
- **Multer**: File upload handling
- **Custom FASTQ Parser**: For NGS data processing