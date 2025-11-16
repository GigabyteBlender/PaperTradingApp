# Trading Application

A full-stack trading application built with Next.js and FastAPI, featuring real-time stock data, portfolio management, and trading capabilities.

## Tech Stack

### Frontend
- **Next.js 15** with React 19
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **FastAPI** for REST API
- **Supabase** for database and authentication
- **Alpha Vantage API** for stock market data
- **Docker** for containerization

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 20+ and **pnpm**
- **Python** 3.11+
- **Docker** and **Docker Compose** (for backend)
- **Supabase** account
- **Alpha Vantage** API key (free tier available)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Frontend Setup

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local

# Update .env.local with your backend API URL
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Update .env with your credentials:
# - SUPABASE_URL
# - SUPABASE_KEY
# - ALPHA_VANTAGE_API_KEY
```

### 4. Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `backend/schema.sql` in your Supabase SQL editor
3. Copy your project URL and anon key to `backend/.env`

### 5. Run the Application

#### Start Backend (Docker)

```bash
cd backend
docker-compose up --build
```

The backend API will be available at `http://localhost:8000`

#### Start Frontend

```bash
# In the root directory
pnpm dev
```

The frontend will be available at `http://localhost:3000`

## Development

### Frontend Development

```bash
# Run development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

### Backend

See [backend/README.md](backend/README.md) for detailed backend documentation.

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Frontend

Deploy to Vercel or any Next.js-compatible platform. Set `NEXT_PUBLIC_API_URL` to your backend URL.

### Backend

Deploy using Docker to any container platform. Ensure all environment variables are configured in production.

## API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Features

- User authentication and authorization
- Real-time stock price data
- Portfolio management
- Buy/sell trading functionality
- Transaction history
- Performance analytics and charts
- Responsive design

## Troubleshooting

### Backend won't start
- Ensure Docker is running
- Check that ports 8000 is not in use
- Verify environment variables in `backend/.env`

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check that backend is running on the specified port
- Ensure CORS is configured correctly in backend

### Database connection issues
- Verify Supabase credentials
- Check that schema.sql has been executed
- Ensure Supabase project is active

## License

no license needed