import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
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

  const budgets: Budget[] = [
    {
      id: 1,
      category: 'Food & Dining',
      amount: 800,
      spent: 650,
      period: 'monthly',
      startDate: new Date('2024-01-01'),
      color: '#3B82F6',
      icon: '🍽️'
    },
    {
      id: 2,
      category: 'Transportation',
      amount: 400,
      spent: 320,
      period: 'monthly',
      startDate: new Date('2024-01-01'),
      color: '#10B981',
      icon: '🚗'
    },
    {
      id: 3,
      category: 'Shopping',
      amount: 300,
      spent: 280,
      period: 'monthly',
      startDate: new Date('2024-01-01'),
      color: '#F59E0B',
      icon: '🛍️'
    },
    {
      id: 4,
      category: 'Entertainment',
      amount: 200,
      spent: 150,
      period: 'monthly',
      startDate: new Date('2024-01-01'),
      color: '#EF4444',
      icon: '🎬'
    },
    {
      id: 5,
      category: 'Utilities',
      amount: 250,
      spent: 180,
      period: 'monthly',
      startDate: new Date('2024-01-01'),
      color: '#8B5CF6',
      icon: '⚡'
    },
    {
      id: 6,
      category: 'Healthcare',
      amount: 150,
      spent: 120,
      period: 'monthly',
      startDate: new Date('2024-01-01'),
      color: '#06B6D4',
      icon: '🏥'
    }
  ];

  const budgetTransactions: BudgetTransaction[] = [
    {
      id: 1,
      description: 'Grocery shopping',
      amount: 85.50,
      date: new Date('2024-01-15'),
      account: 'Checking'
    },
    {
      id: 2,
      description: 'Restaurant dinner',
      amount: 45.00,
      date: new Date('2024-01-14'),
      account: 'Credit Card'
    },
    {
      id: 3,
      description: 'Coffee shop',
      amount: 12.50,
      date: new Date('2024-01-13'),
      account: 'Credit Card'
    }
  ];

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

  const filteredBudgets = budgets.filter(budget => budget.period === selectedPeriod);

  const chartData = filteredBudgets.map(budget => ({
    category: budget.category,
    budget: budget.amount,
    spent: budget.spent,
    remaining: budget.amount - budget.spent
  }));

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
            onSubmit={(budget) => {
              // Handle add budget
              setShowAddDialog(false);
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
                {budgetTransactions.map((transaction) => (
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
    category: '',
    amount: 0,
    period: 'monthly' as 'monthly' | 'yearly'
  });

  const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
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
