# Mental Health Assessment App

A comprehensive mental health assessment application built with React, Node.js, and Dify AI integration.

## 🚀 Features

- **AI-Powered Assessments**: Integration with Dify AI for intelligent mental health evaluations
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Real-time Processing**: Live assessment feedback and results
- **Responsive Design**: Works on desktop and mobile devices
- **Secure API**: Backend proxy for secure Dify API communication

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Zustand** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Axios** - HTTP client for API calls
- **CORS** - Cross-origin resource sharing

### AI Integration
- **Dify AI** - Mental health assessment AI service

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Dify AI API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dify-mental-health
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../mental-health-diagnostic
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your Dify API credentials
   DIFY_API_KEY=your_actual_api_key_here
   DIFY_API_BASE_URL=https://api.dify.ai/v1
   PORT=3001
   ```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
Backend will run on `http://localhost:3001`

### Start Frontend Development Server
```bash
cd mental-health-diagnostic
npm run dev
```
Frontend will run on `http://localhost:5173` (or 5174)

## 🔧 Development

### Project Structure
```
dify-mental-health/
├── backend/                 # Express.js backend
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables (not in git)
├── mental-health-diagnostic/  # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── stores/         # Zustand state management
│   │   └── types/          # TypeScript type definitions
│   └── package.json        # Frontend dependencies
└── README.md              # This file
```

### Available Scripts

#### Backend
- `npm start` - Start the backend server
- `npm run dev` - Start in development mode

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔒 Security

- **Environment Variables**: API keys are stored in `.env` files (not committed to git)
- **CORS**: Configured for secure cross-origin requests
- **API Proxy**: Backend acts as a secure proxy to Dify API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the environment variables are set correctly
2. Ensure both backend and frontend servers are running
3. Verify your Dify API key is valid
4. Check the browser console for any errors

## 🔮 Future Enhancements

- [ ] User authentication and accounts
- [ ] Assessment history and progress tracking
- [ ] Real-time chat support
- [ ] Mobile app version
- [ ] Integration with healthcare systems
- [ ] Advanced analytics and reporting 