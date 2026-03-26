# UniShare - University Study Materials Sharing Platform

## 📚 About the Project

**UniShare** is a modern web application designed as a study materials sharing platform for university students. The application enables users to upload, share, and discover their learning materials across different courses and universities.

## ✨ Key Features

### 📤 Study Materials Upload & Sharing

- Upload notes, assignments, and study files
- Organize files by courses and classes
- Support for PDF and other document formats
- View files in a collapsible file tree structure

### 🔍 Search & Discovery

- **General Search**: Quick search through uploaded materials
- **Deep Search**: Advanced search functionality through file contents
- Filter by university, course, and file type
- Dynamic search suggestions

### 💬 Social Features

- **Home Feed**: Discover materials shared by others
- **Like Button**: Mark helpful content
- **Comments**: Communicate with other learners about materials
- **Save for Later**: Save your favorite materials for future use
- **Follow Users**: Follow students who share useful content

### 👤 Profile Management

- Edit user profile
- Upload and manage avatar
- Track profile statistics and activity
- Change password and security settings

### 📊 Statistics

- Track your own activity and shares
- Content popularity metrics
- User activity statistics

### 🎨 User Experience

- **Dark Mode Support**: Switch between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices
- **Intuitive Interface**: Easy-to-navigate components

### 🔐 Authentication & Security

- User registration and login
- Password reset functionality
- Email confirmation
- Secure user sessions

### 👨‍💼 Admin Panel

- User management and moderation
- Ban/unban users
- Content oversight
- System-level controls

### 🤖 AI Integration

- Document summarization powered by AI
- Groq and Google Generative AI support
- Intelligent search capabilities

## 🛠️ Technology Stack

### Frontend

- **Next.js** - Modern React framework
- **React 19** - User interface framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui & Radix UI** - UI component libraries
- **Lucide React** - Icon library
- **react-dropzone** - Drag & drop file uploads

### Backend & Database

- **Supabase** - Open-source Firebase alternative
- PostgreSQL database
- Real-time functionality

### AI & Processing

- **Groq AI SDK** - AI model integration
- **Google Generative AI** - Artificial intelligence features
- **Vercel AI** - AI integration library

### Development Tools

- **Vitest** - Unit testing
- **ESLint** - Code quality checking
- **TypeScript** - Static type checking

## 📁 Project Structure

```
unishare-app/
├── app/                    # Next.js application
│   ├── (app)/             # Main application routes
│   ├── (auth)/            # Authentication routes
│   ├── admin/             # Admin panel
│   └── api/               # API endpoints
├── components/            # React components
│   └── ui/                # UI components
├── lib/                   # Utility functions and hooks
│   └── supabase/          # Supabase integration
├── types/                 # TypeScript type definitions
└── __tests__/             # Tests
```

## 🎯 User Scenarios

### Student Perspective

1. **Registration**: Create a new account with email
2. **Profile Setup**: Upload avatar and provide information
3. **Upload Materials**: Share your notes and files
4. **Discover Materials**: Browse content from other students
5. **Interact**: Like, save, and comment on materials
6. **Community**: Follow helpful students

### Admin Perspective

1. **User Management**: View and manage users
2. **Moderation**: Handle inappropriate content and banned users
3. **Content Oversight**: Monitor shared materials

## 🚀 Getting Started

### Development Mode

```bash
npm run dev
# or
pnpm dev
```

### Running Tests

```bash
npm run test           # Run all tests
npm run test:ui        # Run tests with UI
npm run test:coverage  # Run tests with coverage report
```

### Production Build

```bash
npm run build  # Build the application
npm start      # Start production server
```

### Linting

```bash
npm run lint   # Check code quality
```

## 📦 Installation Dependencies

```bash
npm install
# or
pnpm install
```

Required environment variables in `.env.local`:

- Supabase URL and anonymous key
- AI service keys (Groq, Google)
- Other configuration values

---

**UniShare** - Join the learning community today! 🎓
