-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
-- Stores app-specific user data. Authentication is handled by Supabase Auth.
-- The id references auth.users(id) from Supabase Auth.

CREATE TABLE IF NOT EXISTS users (
    -- Primary key: References Supabase Auth user ID
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Email: Synced from Supabase Auth
    email VARCHAR(255) UNIQUE NOT NULL,
    
    -- Username: Display name for the user
    username VARCHAR(100) NOT NULL,
    
    -- Balance: User's available cash for trading
    balance NUMERIC(15, 2) DEFAULT 25000.00 NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);


-- ============================================================================
-- HOLDINGS TABLE
-- ============================================================================
-- Stores user portfolio positions (stock holdings).
-- Each holding represents ownership of shares in a specific stock.
-- The average_cost field tracks the weighted average cost basis.

CREATE TABLE IF NOT EXISTS holdings (
    -- Primary key: Unique identifier for each holding
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Foreign key: Links to the user who owns this holding
    -- ON DELETE CASCADE: When a user is deleted, their holdings are also deleted
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Stock symbol: Ticker symbol (e.g., AAPL, GOOGL, TSLA)
    symbol VARCHAR(10) NOT NULL,
    
    -- Company name: Full company name for display
    company_name VARCHAR(255) NOT NULL,
    
    -- Shares: Number of shares owned (supports fractional shares)
    shares NUMERIC(15, 4) NOT NULL,
    
    -- Average cost: Weighted average price paid per share
    -- Used to calculate profit/loss on the position
    average_cost NUMERIC(15, 2) NOT NULL,
    
    -- Timestamps: Track when position was opened and last modified
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Unique constraint: Each user can have only one holding per symbol
    -- This prevents duplicate positions for the same stock
    CONSTRAINT uq_user_symbol UNIQUE (user_id, symbol)
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_holdings_user_id ON holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_holdings_symbol ON holdings(symbol);




-- ============================================================================
-- TRANSACTIONS TABLE
-- ============================================================================
-- Stores historical records of all buy and sell transactions.
-- Transactions are immutable and provide an audit trail of trading activity.

CREATE TABLE IF NOT EXISTS transactions (
    -- Primary key: Unique identifier for each transaction
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Foreign key: Links to the user who made this transaction
    -- ON DELETE CASCADE: When a user is deleted, their transactions are also deleted
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Transaction type: Either 'BUY' or 'SELL'
    type VARCHAR(4) NOT NULL CHECK (type IN ('BUY', 'SELL')),
    
    -- Stock symbol: Ticker symbol for the stock traded
    symbol VARCHAR(10) NOT NULL,
    
    -- Shares: Number of shares bought or sold
    shares NUMERIC(15, 4) NOT NULL,
    
    -- Price: Price per share at the time of transaction
    price NUMERIC(15, 2) NOT NULL,
    
    -- Total cost: Total transaction amount (shares * price)
    -- For BUY: Amount deducted from balance
    -- For SELL: Amount added to balance
    total_cost NUMERIC(15, 2) NOT NULL,
    
    -- Timestamp: When the transaction was executed (UTC)
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for fast lookups and sorting
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_symbol ON transactions(symbol);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp DESC);




-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Enable RLS for security. Supabase Auth handles authentication.
-- Users can only access their own data.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for holdings table
CREATE POLICY "Users can view own holdings" ON holdings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own holdings" ON holdings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own holdings" ON holdings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own holdings" ON holdings FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for transactions table
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
