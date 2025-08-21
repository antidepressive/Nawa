# Finance Dashboard

A comprehensive Notion-style finance dashboard built with React, TypeScript, and Tailwind CSS. The dashboard provides a clean, minimal UI for managing personal finances with advanced features for tracking income, expenses, budgets, and generating detailed reports.

## Features

### 📊 Overview Dashboard
- **Summary Cards**: Real-time display of balance, income, expenses, net change, and runway
- **Trend Charts**: Interactive income vs expenses trend visualization
- **Category Breakdown**: Donut chart showing expense distribution by category
- **Recent Transactions**: Quick view of latest financial activities
- **Time Range Selector**: Filter data by 7D, 30D, 90D, or 1Y periods

### 💳 Transactions Management
- **Searchable Table**: Full-text search across transaction descriptions and categories
- **Advanced Filtering**: Filter by type, category, account, and date range
- **Sortable Columns**: Sort by date, amount, or any other field
- **Inline Editing**: Edit transactions directly in the table
- **Bulk Actions**: Select multiple transactions for export or deletion
- **Add/Edit Forms**: Comprehensive forms for adding and editing transactions

### 💰 Budget Management
- **Monthly/Yearly Budgets**: Set budgets per category with flexible periods
- **Progress Tracking**: Visual progress bars showing budget utilization
- **Status Indicators**: Color-coded warnings for budget overruns
- **Drill-down Views**: Click to see all transactions for a specific budget
- **Budget Overview Chart**: Bar chart comparing budget vs actual spending

### 📈 Reports & Analytics
- **Multiple Report Types**: Overview, Categories, Transactions, and Income reports
- **Period Selection**: Choose from predefined periods or custom date ranges
- **Export Options**: Export data as CSV or PDF
- **Key Metrics**: Savings rate, average monthly savings, income sources
- **Visual Charts**: Area charts, line charts, pie charts, and bar charts

### ⚙️ Settings & Configuration
- **Currency Management**: Support for multiple currencies (USD, EUR, GBP, etc.)
- **Category Management**: Add, edit, and organize expense/income categories
- **Account Management**: Manage multiple bank accounts and credit cards
- **Theme Toggle**: Light, dark, and system theme support
- **Data Import/Export**: CSV import/export functionality
- **Notification Settings**: Configure budget alerts and report notifications

### 🎯 Advanced Features
- **Command Palette**: Quick access to all dashboard functions (⌘K)
- **Keyboard Shortcuts**: Navigate and perform actions with keyboard
- **Persistent Filters**: Filters and settings are saved automatically
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Live updates as you add or modify data

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Navigate to `/finance` to access the dashboard

### Database Setup
The dashboard uses a PostgreSQL database with the following schema:

```sql
-- Accounts table
CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  balance DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  color TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  color TEXT,
  icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  account_id INTEGER REFERENCES accounts(id),
  category_id INTEGER REFERENCES categories(id),
  amount DECIMAL(15,2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Budgets table
CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id),
  amount DECIMAL(15,2) NOT NULL,
  period TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Usage

### Adding Transactions
1. Click the "Add Transaction" button or use ⌘N
2. Fill in the transaction details:
   - Description
   - Amount
   - Type (income/expense/transfer)
   - Category
   - Account
   - Date
   - Optional notes and tags
3. Click "Add Transaction" to save

### Managing Budgets
1. Navigate to the Budgets tab
2. Click "Add Budget" to create a new budget
3. Select category, amount, and period
4. Monitor progress with visual indicators
5. Click "View Transactions" to drill down

### Generating Reports
1. Go to the Reports tab
2. Select the desired report type
3. Choose time period (month/quarter/year or custom range)
4. View charts and metrics
5. Export data if needed

### Customizing Settings
1. Access Settings from the main navigation
2. Configure currency, date format, and theme
3. Manage categories and accounts
4. Set up notifications and privacy preferences

## Keyboard Shortcuts

- `⌘K` - Open command palette
- `⌘N` - Add new transaction
- `⌘/` - Search transactions
- `⌘E` - Export data
- `⌘S` - Save changes
- `Esc` - Close dialogs/modals

## Data Persistence

The dashboard automatically saves:
- User preferences and settings
- Filter states
- Theme selection
- Recent searches

Financial data is stored in the PostgreSQL database. User preferences and settings are saved locally in the browser's localStorage. Data can be exported as CSV for backup.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.
