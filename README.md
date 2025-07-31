# Wellness Session Platform - Full Stack

A complete full-stack wellness session platform built with Next.js, MongoDB, and JWT authentication.

## 🚀 Quick Setup

### 1. Prerequisites
- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Git

### 2. Clone and Install
\`\`\`bash
git clone <your-repo>
cd wellness-platform
npm install
\`\`\`

### 3. Environment Setup
Copy the environment file and configure:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your values:
\`\`\`env
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
MONGODB_URI=mongodb://localhost:27017/wellness-platform
\`\`\`

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service:
   \`\`\`bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   \`\`\`

#### Option B: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier)
3. Get connection string
4. Update `MONGODB_URI` in `.env.local`

### 5. Initialize Database
\`\`\`bash
# Setup database indexes
npm run db:setup

# Seed with sample data
npm run seed
\`\`\`

### 6. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit: **http://localhost:3000**

## 🧪 Testing

### Demo Accounts
- **Email:** demo@wellness.com | **Password:** demo123
- **Email:** instructor@wellness.com | **Password:** demo123
- **Email:** admin@wellness.com | **Password:** demo123

### Feature Testing
1. **Authentication:** Register/login/logout
2. **Dashboard:** Browse published sessions
3. **My Sessions:** Manage drafts and published sessions
4. **Session Editor:** Create/edit with auto-save
5. **Search:** Filter sessions by title/tags

## 📁 Project Structure

\`\`\`
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── sessions/       # Public sessions
│   │   └── my-sessions/    # User session management
│   ├── dashboard/          # Dashboard page
│   ├── login/             # Login page
│   ├── register/          # Register page
│   └── my-sessions/       # Session management pages
├── components/            # Reusable UI components
├── contexts/             # React contexts (auth)
├── lib/                  # Utilities and configurations
│   ├── mongodb.ts        # Database connection
│   ├── auth.ts          # JWT utilities
│   └── validations.ts   # Input validation
├── scripts/             # Database scripts
│   ├── setup-database.js # Database initialization
│   └── seed-database.js  # Sample data seeding
└── .env.local           # Environment variables
\`\`\`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Sessions
- `GET /api/sessions` - Get published sessions
- `GET /api/my-sessions` - Get user's sessions
- `POST /api/my-sessions/save-draft` - Save/update draft
- `POST /api/my-sessions/publish` - Publish session
- `GET /api/my-sessions/[id]` - Get specific session
- `PUT /api/my-sessions/[id]` - Update session
- `DELETE /api/my-sessions/[id]` - Delete session

## 🗄️ Database Schema

### Users Collection
\`\`\`javascript
{
  _id: ObjectId,
  email: String (unique),
  password_hash: String,
  created_at: Date,
  updated_at: Date,
  last_login: Date
}
\`\`\`

### Sessions Collection
\`\`\`javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: users),
  title: String,
  tags: [String],
  json_file_url: String,
  status: "draft" | "published",
  created_at: Date,
  updated_at: Date,
  published_at: Date
}
\`\`\`

## 🚀 Production Deployment

### Environment Variables
Set these in your production environment:
- `JWT_SECRET` - Strong random string
- `MONGODB_URI` - Production database URL
- `NODE_ENV=production`

### Build and Deploy
\`\`\`bash
npm run build
npm start
\`\`\`

### Recommended Platforms
- **Vercel** (recommended for Next.js)
- **Railway**
- **Render**
- **DigitalOcean App Platform**

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- MongoDB injection prevention
- CORS protection
- Rate limiting ready

## 🛠️ Development

### Available Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Code linting
- `npm run db:setup` - Setup database
- `npm run seed` - Seed sample data

### Adding Features
1. Create API routes in `app/api/`
2. Add pages in `app/`
3. Create components in `components/`
4. Update database schema as needed
5. Add validation in `lib/validations.ts`

## 📊 Performance Features

- Database indexing for fast queries
- Optimized MongoDB aggregation pipelines
- JWT token caching
- Next.js automatic code splitting
- Image optimization ready
- SEO optimized

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB is running
   - Verify connection string
   - Check network/firewall settings

2. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Clear localStorage and re-login

3. **Build Errors**
   - Clear `.next` folder
   - Delete `node_modules` and reinstall
   - Check TypeScript errors

### Debug Mode
\`\`\`bash
DEBUG=* npm run dev
\`\`\`

## 📈 Monitoring & Analytics

Ready for integration with:
- **Vercel Analytics**
- **Google Analytics**
- **Sentry** (error tracking)
- **LogRocket** (session replay)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details
