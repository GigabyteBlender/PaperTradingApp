# Trading Application Backend

FastAPI backend service for the trading application, providing REST API endpoints for user management, portfolio tracking, and stock trading operations.

## Tech Stack

- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Supabase** - PostgreSQL database and authentication
- **Alpha Vantage** - Stock market data API
- **Docker** - Containerization
- **Pydantic** - Data validation

## Prerequisites

- Python 3.11+
- Docker and Docker Compose
- Supabase account
- Alpha Vantage API key
- OpenAI API key

## Setup

### 1. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,https://your-frontend-domain.com

# Alpha Vantage API Configuration
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key

# OpenAI API Configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4-turbo
OPENAI_MAX_TOKENS=1000

# Application Configuration
DEBUG=True
```

### 2. Database Setup

1. Create a new project in [Supabase](https://supabase.com)
2. Navigate to the SQL Editor
3. Run the SQL schema from `schema.sql`
4. Copy your project URL and anon key to `.env`

### 3. Get API Keys

#### Supabase
1. Go to your project settings
2. Navigate to API section
3. Copy the URL and anon/public key

#### Alpha Vantage
1. Sign up at [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Get your free API key (500 requests/day)

#### OpenAI
1. Sign up at [OpenAI Platform](https://platform.openai.com)
2. Navigate to API keys section
3. Create a new API key
4. Copy the key to `.env` (keep it secure, never commit it)
5. Note: The recommendation system uses GPT-4 Turbo for stock analysis
6. Monitor your usage at [OpenAI Usage Dashboard](https://platform.openai.com/usage)

## Running the Application

### Using Docker (Recommended)

```bash
# Build and start the container
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The API will be available at `http://localhost:8000`

### Without Docker

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI application entry point
│   ├── routes/           # API route handlers
│   ├── models/           # Pydantic models
│   ├── services/         # Business logic
│   └── utils/            # Helper functions
├── Dockerfile            # Docker container configuration
├── docker-compose.yml    # Docker Compose configuration
├── requirements.txt      # Python dependencies
├── schema.sql            # Database schema
└── .env                  # Environment variables (not in git)
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Portfolio
- `GET /portfolio` - Get user portfolio
- `GET /portfolio/performance` - Get portfolio performance metrics

### Trading
- `POST /trades` - Execute a trade (buy/sell)
- `GET /trades` - Get trade history
- `GET /trades/{id}` - Get specific trade

### Stocks
- `GET /stocks/search` - Search for stocks
- `GET /stocks/{symbol}` - Get stock details
- `GET /stocks/{symbol}/quote` - Get real-time quote

## Development

### Adding New Dependencies

```bash
# Add to requirements.txt
pip install <package-name>
pip freeze > requirements.txt

# Rebuild Docker container
docker-compose up --build
```

## Deployment

Deploy using Docker to any container platform. Build the production image:

```bash
docker build -t trading-backend:latest .
```

Set these environment variables in production:
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `ALPHA_VANTAGE_API_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (default: gpt-4-turbo)
- `OPENAI_MAX_TOKENS` (default: 1000)
- `CORS_ORIGINS` (your frontend URL)
- `DEBUG=False`

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 8000
# Windows:
netstat -ano | findstr :8000

# macOS/Linux:
lsof -i :8000

# Kill the process or change port in docker-compose.yml
```

### Database Connection Issues

- Verify Supabase URL and key are correct
- Check that Supabase project is active
- Ensure schema.sql has been executed
- Check network connectivity

### CORS Errors

- Add your frontend URL to `CORS_ORIGINS` in `.env`
- Restart the backend after changing environment variables
- Verify the frontend is using the correct API URL

### Alpha Vantage Rate Limits

- Free tier: very limited requests/day
- Consider upgrading to premium tier if needed

### OpenAI API Costs

- GPT-4 Turbo charges per token (input and output)
- Recommendations are cached for 15 minutes to reduce costs
- Monitor usage in OpenAI dashboard to avoid unexpected charges
- Consider setting usage limits in OpenAI account settings

## Security Considerations

- Never commit `.env` file
- Use environment variables for all secrets
- Keep dependencies updated: `pip list --outdated`
- Enable Supabase Row Level Security (RLS)
- Use HTTPS in production
- Implement rate limiting for API endpoints

## Support

For issues and questions:
- Check the main [README](../README.md)
- Review API documentation at `/docs`
- Check Supabase and Alpha Vantage status pages

## License

no license, your free to use the code however you want