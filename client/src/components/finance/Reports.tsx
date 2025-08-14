import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { transactionsApi, categoriesApi, accountsApi } from '../../lib/financeApi';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { 
  Download, 
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { format } from 'date-fns';

interface ReportData {
  period: string;
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
}

interface TopCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface LargeTransaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
}

interface IncomeSource {
  source: string;
  amount: number;
  percentage: number;
  color: string;
}

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [activeReport, setActiveReport] = useState<string>('overview');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [transactionsData, categoriesData, accountsData] = await Promise.all([
          transactionsApi.getAll(),
          categoriesApi.getAll(),
          accountsApi.getAll()
        ]);
        
        setTransactions(transactionsData);
        setCategories(categoriesData);
        setAccounts(accountsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate report data from real transactions
  const getReportData = (): ReportData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      const monthIndex = (currentMonth - 5 + index + 12) % 12;
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === monthIndex;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const savings = income - expenses;
      const savingsRate = income > 0 ? (savings / income) * 100 : 0;

      return { period: month, income, expenses, savings, savingsRate };
    });
  };

  // Calculate top categories from real transactions
  const getTopCategories = (): TopCategory[] => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryTotals: { [key: string]: number } = {};
    
    expenseTransactions.forEach(t => {
      const category = categories.find(c => c.id === t.categoryId);
      if (category) {
        categoryTotals[category.name] = (categoryTotals[category.name] || 0) + parseFloat(t.amount);
      }
    });

    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    
    return Object.entries(categoryTotals)
      .map(([category, amount]) => {
        const categoryData = categories.find(c => c.name === category);
        return {
          category,
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
          color: categoryData?.color || '#3B82F6'
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  };

  // Get largest transactions from real data
  const getLargeTransactions = (): LargeTransaction[] => {
    return transactions
      .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
      .slice(0, 10)
      .map(t => {
        const category = categories.find(c => c.id === t.categoryId);
        return {
          id: t.id,
          description: t.description,
          amount: parseFloat(t.amount),
          type: t.type,
          category: category?.name || 'Unknown',
          date: new Date(t.date)
        };
      });
  };

  // Calculate income sources from real data
  const getIncomeSources = (): IncomeSource[] => {
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const sourceTotals: { [key: string]: number } = {};
    
    incomeTransactions.forEach(t => {
      const category = categories.find(c => c.id === t.categoryId);
      if (category) {
        sourceTotals[category.name] = (sourceTotals[category.name] || 0) + parseFloat(t.amount);
      }
    });

    const totalIncome = Object.values(sourceTotals).reduce((sum, amount) => sum + amount, 0);
    
    return Object.entries(sourceTotals)
      .map(([source, amount]) => {
        const categoryData = categories.find(c => c.name === source);
        return {
          source,
          amount,
          percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0,
          color: categoryData?.color || '#10B981'
        };
      })
      .sort((a, b) => b.amount - a.amount);
  };

  // Calculate summary metrics from real data
  const getSummaryMetrics = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Get transactions for the selected period
    let periodTransactions = transactions;
    
    if (selectedPeriod === 'month') {
      periodTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
      });
    } else if (selectedPeriod === 'quarter') {
      const quarterStart = Math.floor(currentMonth / 3) * 3;
      periodTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() >= quarterStart && 
               transactionDate.getMonth() < quarterStart + 3 && 
               transactionDate.getFullYear() === currentYear;
      });
    } else if (selectedPeriod === 'year') {
      periodTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getFullYear() === currentYear;
      });
    }
    
    // Calculate totals
    const totalIncome = periodTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalExpenses = periodTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
    
    // Calculate average monthly savings
    const allIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const allExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalMonths = Math.max(1, new Set(transactions.map(t => {
      const date = new Date(t.date);
      return `${date.getFullYear()}-${date.getMonth()}`;
    })).size);
    
    const averageMonthlySavings = (allIncome - allExpenses) / totalMonths;
    
    return {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      averageMonthlySavings
    };
  };

  const reportData = getReportData();
  const topCategories = getTopCategories();
  const largeTransactions = getLargeTransactions();
  const incomeSources = getIncomeSources();
  const summaryMetrics = getSummaryMetrics();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    // Handle export logic
    console.log(`Exporting as ${format}`);
  };

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summaryMetrics.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === 'month' ? 'This month' : selectedPeriod === 'quarter' ? 'This quarter' : 'This year'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summaryMetrics.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === 'month' ? 'This month' : selectedPeriod === 'quarter' ? 'This quarter' : 'This year'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(summaryMetrics.netSavings)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summaryMetrics.savingsRate.toFixed(1)}% savings rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Monthly</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(summaryMetrics.averageMonthlySavings)}
            </div>
            <p className="text-xs text-muted-foreground">
              Net savings per month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Income vs Expenses Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Income vs Expenses Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stackId="1"
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.6}
                name="Income"
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stackId="1"
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.6}
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Savings Rate Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Savings Rate Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, '']}
              />
              <Line 
                type="monotone" 
                dataKey="savingsRate" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="Savings Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderCategoriesReport = () => (
    <div className="space-y-6">
      {/* Top Categories Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Top Expense Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <p className="font-medium">{category.category}</p>
                      <p className="text-sm text-muted-foreground">{category.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(category.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Expense Categories Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Bar dataKey="amount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderTransactionsReport = () => (
    <div className="space-y-6">
      {/* Largest Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Largest Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {largeTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(transaction.date, 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === 'income' ? 'default' : 'destructive'}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderIncomeReport = () => (
    <div className="space-y-6">
      {/* Income Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Income Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {incomeSources.map((source, index) => (
                    <Cell key={`cell-${index}`} fill={source.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              {incomeSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: source.color }}
                    />
                    <div>
                      <p className="font-medium">{source.source}</p>
                      <p className="text-sm text-muted-foreground">{source.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatCurrency(source.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Reports</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading report data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reports</h2>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={(value: 'month' | 'quarter' | 'year') => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customDateRange.from ? (
                  customDateRange.to ? (
                    <>
                      {format(customDateRange.from, "LLL dd, y")} -{" "}
                      {format(customDateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(customDateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Custom Range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={customDateRange.from}
                selected={customDateRange}
                onSelect={setCustomDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <Button
          variant={activeReport === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveReport('overview')}
        >
          Overview
        </Button>
        <Button
          variant={activeReport === 'categories' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveReport('categories')}
        >
          Categories
        </Button>
        <Button
          variant={activeReport === 'transactions' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveReport('transactions')}
        >
          Transactions
        </Button>
        <Button
          variant={activeReport === 'income' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveReport('income')}
        >
          Income
        </Button>
      </div>

      {/* Report Content */}
      {activeReport === 'overview' && renderOverviewReport()}
      {activeReport === 'categories' && renderCategoriesReport()}
      {activeReport === 'transactions' && renderTransactionsReport()}
      {activeReport === 'income' && renderIncomeReport()}
    </div>
  );
};

export default Reports;
