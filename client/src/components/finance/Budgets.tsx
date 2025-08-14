import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { budgetsApi, categoriesApi, transactionsApi, accountsApi } from '../../lib/financeApi';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Eye,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface Budget {
  id: number;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  color: string;
  icon: string;
}

interface BudgetTransaction {
  id: number;
  description: string;
  amount: number;
  date: Date;
  account: string;
}

const Budgets: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [budgetsData, categoriesData, transactionsData, accountsData] = await Promise.all([
          budgetsApi.getAll(),
          categoriesApi.getAll(),
          transactionsApi.getAll(),
          accountsApi.getAll()
        ]);
        
        setBudgets(budgetsData);
        setCategories(categoriesData);
        setTransactions(transactionsData);
        setAccounts(accountsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate spent amounts for budgets
  const getBudgetWithSpent = (budget: any) => {
    const categoryTransactions = transactions.filter(t => 
      t.categoryId === budget.categoryId && 
      t.type === 'expense' &&
      new Date(t.date) >= new Date(budget.startDate) &&
      (!budget.endDate || new Date(t.date) <= new Date(budget.endDate))
    );
    
    const spent = categoryTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const category = categories.find(c => c.id === budget.categoryId);
    
    return {
      ...budget,
      category: category?.name || 'Unknown',
      spent,
      color: category?.color || '#3B82F6',
      icon: category?.icon || '💰'
    };
  };

  // Get budget transactions for a specific budget
  const getBudgetTransactions = (budgetId: number): BudgetTransaction[] => {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) return [];

    const categoryTransactions = transactions.filter(t => 
      t.categoryId === budget.categoryId && 
      t.type === 'expense' &&
      new Date(t.date) >= new Date(budget.startDate) &&
      (!budget.endDate || new Date(t.date) <= new Date(budget.endDate))
    );

    return categoryTransactions.map(t => {
      const account = accounts.find(a => a.id === t.accountId);
      return {
        id: t.id,
        description: t.description,
        amount: parseFloat(t.amount),
        date: new Date(t.date),
        account: account?.name || 'Unknown'
      };
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getProgressPercentage = (spent: number, amount: number) => {
    return Math.min((spent / amount) * 100, 100);
  };

  const getProgressColor = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusBadge = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;
    if (percentage >= 90) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Over Budget
      </Badge>;
    }
    if (percentage >= 75) {
      return <Badge variant="secondary" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Warning
      </Badge>;
    }
    return <Badge variant="default" className="flex items-center gap-1">
      <TrendingUp className="h-3 w-3" />
      On Track
    </Badge>;
  };

  const filteredBudgets = budgets
    .filter(budget => budget.period === selectedPeriod)
    .map(getBudgetWithSpent);

  const chartData = filteredBudgets.map(budget => ({
    category: budget.category,
    budget: parseFloat(budget.amount),
    spent: budget.spent,
    remaining: parseFloat(budget.amount) - budget.spent
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Budgets</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading budget data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Budgets</h2>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={(value: 'monthly' | 'yearly') => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Budget
          </Button>
        </div>
      </div>

      {/* Budget Overview Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Budget Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
              <Bar dataKey="spent" fill="#EF4444" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBudgets.map((budget) => {
          const progress = getProgressPercentage(budget.spent, budget.amount);
          const progressColor = getProgressColor(budget.spent, budget.amount);
          const remaining = budget.amount - budget.spent;

          return (
            <Card key={budget.id} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{budget.icon}</span>
                    <span>{budget.category}</span>
                  </div>
                  {getStatusBadge(budget.spent, budget.amount)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent</span>
                    <span className="font-medium">{formatCurrency(budget.spent)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">{formatCurrency(budget.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className={`font-medium ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {remaining >= 0 ? '+' : ''}{formatCurrency(remaining)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedBudget(budget);
                      setShowTransactions(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Transactions
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Budget Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Budget</DialogTitle>
          </DialogHeader>
          <BudgetForm
            onSubmit={async (budget) => {
              try {
                await budgetsApi.create({
                  categoryId: parseInt(budget.categoryId),
                  amount: budget.amount,
                  period: budget.period,
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: budget.period === 'monthly' 
                    ? new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
                    : new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
                });
                
                // Reload budgets
                const budgetsData = await budgetsApi.getAll();
                setBudgets(budgetsData);
                setShowAddDialog(false);
              } catch (error) {
                console.error('Error creating budget:', error);
                alert('Failed to create budget');
              }
            }}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Budget Transactions Dialog */}
      <Dialog open={showTransactions} onOpenChange={setShowTransactions}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedBudget?.category} Transactions
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">{formatCurrency(selectedBudget?.spent || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="text-2xl font-bold">{formatCurrency(selectedBudget?.amount || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className={`text-2xl font-bold ${(selectedBudget?.amount || 0) - (selectedBudget?.spent || 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency((selectedBudget?.amount || 0) - (selectedBudget?.spent || 0))}
                </p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedBudget && getBudgetTransactions(selectedBudget.id).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {transaction.date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.description}
                    </TableCell>
                    <TableCell>{transaction.account}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Budget Form Component
interface BudgetFormProps {
  onSubmit: (budget: any) => void;
  onCancel: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: 0,
    period: 'monthly' as 'monthly' | 'yearly'
  });

  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {expenseCategories.map(category => (
              <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Budget Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="period">Period</Label>
        <Select value={formData.period} onValueChange={(value: 'monthly' | 'yearly') => setFormData({ ...formData, period: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Budget
        </Button>
      </div>
    </form>
  );
};

export default Budgets;
