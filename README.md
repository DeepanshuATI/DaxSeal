# DaxSeal - Digital Notary System

A secure document verification system using SHA-256 cryptographic hashing to verify the authenticity and integrity of PDF documents.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### 2. Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 3. Open Application
Open http://localhost:3000 in your browser

### 4. Verify Setup (Optional)
```bash
node verify-setup.js
```

## 📋 Features

- **SHA-256 Hashing**: Cryptographic document verification
- **Privacy-First**: Only hashes stored, never file content
- **Tamper Detection**: Detects any document modifications
- **Rate Limiting**: 10 requests per minute per IP
- **Security Headers**: Helmet.js protection
- **SQL Injection Protection**: Parameterized queries
- **Origami UI**: Minimalist geometric design

## 🏗️ Architecture

```
daxseal/
├── backend/              # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── server.ts    # Main entry point
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Hashing logic
│   │   ├── database/    # SQLite operations
│   │   └── middleware/  # Rate limiting, file upload
│   └── .env             # Environment config
│
├── frontend/            # React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx      # Main component
│   │   ├── components/  # UI components
│   │   ├── api/         # Backend client
│   │   └── styles/      # Origami CSS
│   └── .env             # Environment config
│
└── README.md
```

## 🔐 Security Features

1. **In-Memory Processing**: Files never stored on disk
2. **Timing-Safe Comparison**: Prevents timing attacks
3. **Rate Limiting**: Prevents DoS attacks
4. **Parameterized Queries**: Prevents SQL injection
5. **Filename Sanitization**: Prevents path traversal
6. **CORS Protection**: Restricted origins
7. **Security Headers**: Helmet.js integration
8. **Database Permissions**: Owner-only access (0o600)

## 📡 API Endpoints

### POST /api/notarize
Register a document's hash
```bash
curl -X POST http://localhost:3001/api/notarize \
  -F "file=@document.pdf"
```

**Response:**
```json
{
  "status": "notarized",
  "hash": "abc123...",
  "fileName": "document.pdf",
  "timestamp": "2026-04-07T22:30:00.000Z"
}
```

### POST /api/verify
Verify document authenticity
```bash
curl -X POST http://localhost:3001/api/verify \
  -F "file=@document.pdf"
```

**Response:**
```json
{
  "status": "verified",
  "hash": "abc123...",
  "fileName": "document.pdf",
  "originalTimestamp": "2026-04-07T22:30:00.000Z",
  "message": "Document is authentic and unmodified"
}
```

**Possible Status Values:**
- `verified` - Document is authentic
- `tampered` - Document has been modified
- `unknown` - Document not in registry

### GET /health
Health check endpoint
```bash
curl http://localhost:3001/health
```

## ⚙️ Configuration

### Backend (.env)
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 🧪 Testing

### Test Notarization
1. Open http://localhost:3000
2. Click "Notarize Document"
3. Drag and drop a PDF file
4. Note the hash generated

### Test Verification
1. Click "Verify Document"
2. Drop the same PDF
3. Should show "VERIFIED" status

### Test Tamper Detection
1. Modify the PDF file
2. Try to verify the modified file
3. Should show "DOCUMENT TAMPERED" warning

### Test Rate Limiting
```bash
# Make 11 requests quickly
for i in {1..11}; do
  curl -X POST http://localhost:3001/api/notarize \
    -F "file=@test.pdf"
done
# 11th request should fail with 429 error
```

## 🛠️ Tech Stack

**Backend:**
- Node.js + TypeScript
- Express.js
- SQLite3
- Multer (file upload)
- Helmet (security)
- express-rate-limit
- crypto (SHA-256)

**Frontend:**
- React 18 + TypeScript
- Vite
- react-dropzone
- Axios
- CSS (Origami theme)

## 🔧 Troubleshooting

### Port Already in Use
Change port in `backend/.env`:
```env
PORT=3002
```
Update `frontend/.env`:
```env
VITE_API_URL=http://localhost:3002/api
```

### Database Errors
Delete and recreate:
```bash
rm backend/notary.db
cd backend
npm run dev
```

### CORS Errors
Ensure `FRONTEND_URL` in `backend/.env` matches your frontend URL

### Module Not Found
Reinstall dependencies:
```bash
cd backend && npm install
cd frontend && npm install
```

## 📦 Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```



### Using Docker (Advanced)

```bash
# Build images
docker build -t daxseal-backend ./backend
docker build -t daxseal-frontend ./frontend

# Run containers
docker run -d -p 3001:3001 daxseal-backend
docker run -d -p 3000:80 daxseal-frontend
```

### Using PM2 (VPS Deployment)

```bash
npm install -g pm2
cd backend
pm2 start dist/server.js --name daxseal-api
pm2 startup
pm2 save
```

## 🔒 Security Best Practices

1. **Enable HTTPS** in production
2. **Set strong database permissions**: `chmod 600 backend/notary.db`
3. **Regular dependency updates**: `npm audit fix`
4. **Monitor logs** for suspicious activity
5. **Backup database** regularly
6. **Use environment variables** for secrets
7. **Enable firewall** rules
8. **Implement authentication** for enterprise use

## 📊 Database Schema

```sql
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_name TEXT NOT NULL,
  file_hash TEXT UNIQUE NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 UI Features

- **Origami Theme**: Geometric borders and minimalist design
- **Drag & Drop**: Intuitive file upload
- **Real-time Feedback**: Instant verification results
- **Responsive Design**: Works on desktop and mobile
- **Status Indicators**: Clear visual feedback

## 📝 How It Works

1. **Notarization**:
   - User uploads PDF file
   - System generates SHA-256 hash
   - Hash stored in database with timestamp
   - File discarded from memory

2. **Verification**:
   - User uploads PDF file
   - System generates SHA-256 hash
   - Hash compared with database
   - Result: verified, tampered, or unknown

3. **Tamper Detection**:
   - Any modification changes the hash
   - Even 1 bit change = completely different hash
   - Proves document integrity

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🙏 Acknowledgments

- Built for Kagazi brand
- Inspired by blockchain notarization systems
- Uses industry-standard cryptographic practices

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review API documentation
3. Check browser console for errors
4. Verify environment configuration

---

**Built with ❤️ for Kagazi**  
*Powered by DaxSeal - Cryptographic Document Verification*
