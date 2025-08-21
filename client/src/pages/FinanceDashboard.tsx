import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { accountsApi, transactionsApi } from '../lib/financeApi';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  PieChart,
  BarChart3,
  FileText,
  CreditCard,
  PiggyBank,
  Wallet
} from 'lucide-react';
import { Command } from 'cmdk';

// Import dashboard components
import Overview from '../components/finance/Overview';
import Transactions from '../components/finance/Transactions';
import Budgets from '../components/finance/Budgets';
import Reports from '../components/finance/Reports';
import SettingsComponent from '../components/finance/Settings';
import AuthGate from '../components/finance/AuthGate';

interface DashboardStats {
  balance: number;
  income: number;
  expenses: number;
  netChange: number;
  runway: number;
}

const FinanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoOpenAddDialog, setAutoOpenAddDialog] = useState(false);

  // Real data from API
  const [stats, setStats] = useState<DashboardStats>({
    balance: 0,
    income: 0,
    expenses: 0,
    netChange: 0,
    runway: 0
  });
  const [loading, setLoading] = useState(true);

  // Command palette commands
  const commands = [
    {
      id: 'add-transaction',
      title: 'Add Transaction',
      icon: Plus,
      action: () => {
        setActiveTab('transactions');
        setShowCommandPalette(false);
        // Trigger add transaction modal
      }
    },
    {
      id: 'overview',
      title: 'Go to Overview',
      icon: BarChart3,
      action: () => {
        setActiveTab('overview');
        setShowCommandPalette(false);
      }
    },
    {
      id: 'transactions',
      title: 'Go to Transactions',
      icon: FileText,
      action: () => {
        setActiveTab('transactions');
        setShowCommandPalette(false);
      }
    },
    {
      id: 'budgets',
      title: 'Go to Budgets',
      icon: PieChart,
      action: () => {
        setActiveTab('budgets');
        setShowCommandPalette(false);
      }
    },
    {
      id: 'reports',
      title: 'Go to Reports',
      icon: TrendingUp,
      action: () => {
        setActiveTab('reports');
        setShowCommandPalette(false);
      }
    },
    {
      id: 'settings',
      title: 'Go to Settings',
      icon: FileText,
      action: () => {
        setActiveTab('settings');
        setShowCommandPalette(false);
      }
    }
  ];

  // Reset autoOpenAddDialog when transactions tab becomes active
  useEffect(() => {
    if (activeTab === 'transactions' && autoOpenAddDialog) {
      // Reset the flag after a short delay to allow the component to mount
      const timer = setTimeout(() => {
        setAutoOpenAddDialog(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab, autoOpenAddDialog]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setShowCommandPalette(true);
            break;
          case 'n':
            e.preventDefault();
            setActiveTab('transactions');
            // Trigger add transaction modal
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load real data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [accountsData, transactionsData] = await Promise.all([
          accountsApi.getAll(),
          transactionsApi.getAll()
        ]);

        // Calculate total balance from all accounts
        const totalBalance = accountsData.reduce((sum: number, account: any) => sum + parseFloat(account.balance), 0);

        // Calculate this month's transactions
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const thisMonthTransactions = transactionsData.filter((t: any) => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
        });

        // Calculate income and expenses
        const thisMonthIncome = thisMonthTransactions
          .filter((t: any) => t.type === 'income')
          .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

        const thisMonthExpenses = thisMonthTransactions
          .filter((t: any) => t.type === 'expense')
          .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

        const netChange = thisMonthIncome - thisMonthExpenses;

        // Calculate runway (months of expenses covered by current balance)
        const allExpenses = transactionsData
          .filter((t: any) => t.type === 'expense')
          .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
        
        const averageMonthlyExpenses = allExpenses / Math.max(1, transactionsData.filter((t: any) => t.type === 'expense').length);
        const runway = averageMonthlyExpenses > 0 ? Math.floor(totalBalance / averageMonthlyExpenses) : 0;

        setStats({
          balance: totalBalance,
          income: thisMonthIncome,
          expenses: thisMonthExpenses,
          netChange,
          runway
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <div className="flex h-16 items-center px-4 gap-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Company Finance Dashboard</h1>
            </div>
            
            <div className="flex-1 flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search transactions, categories..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => {
                setAutoOpenAddDialog(true);
                setActiveTab('transactions');
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? 'Loading...' : formatCurrency(stats.balance)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loading ? 'Loading...' : formatCurrency(stats.income)}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {loading ? 'Loading...' : formatCurrency(stats.expenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Change</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {loading ? 'Loading...' : formatCurrency(stats.netChange)}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Runway</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? 'Loading...' : stats.runway}
              </div>
              <p className="text-xs text-muted-foreground">
                Months remaining
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Overview onViewAllTransactions={() => setActiveTab('transactions')} />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Transactions autoOpenAddDialog={autoOpenAddDialog} />
          </TabsContent>

          <TabsContent value="budgets" className="space-y-4">
            <Budgets />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Reports />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SettingsComponent />
          </TabsContent>
        </Tabs>
      </div>

      {/* Command Palette */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
            <Command>
              <Command.Input placeholder="Type a command or search..." />
              <Command.List>
                <Command.Empty>No results found.</Command.Empty>
                {commands.map((command) => (
                  <Command.Item
                    key={command.id}
                    onSelect={command.action}
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-accent rounded"
                  >
                    <command.icon className="h-4 w-4" />
                    {command.title}
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
            <Button
              variant="outline"
              onClick={() => setShowCommandPalette(false)}
              className="mt-2"
            >
              Cancel
            </Button>
          </div>
        </div>
             )}
       </div>
     </AuthGate>
   );
 };

export default FinanceDashboard;
