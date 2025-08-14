import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { transactionsApi, categoriesApi, accountsApi } from '../../lib/financeApi';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../ui/dialog';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Calendar as CalendarIcon,
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  account: string;
  date: Date;
  tags: string[];
  notes?: string;
}

interface TransactionsProps {
  autoOpenAddDialog?: boolean;
}

const Transactions: React.FC<TransactionsProps> = ({ autoOpenAddDialog = false }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

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

  // Auto-open add form if prop is true
  useEffect(() => {
    if (autoOpenAddDialog) {
      setShowInlineForm(true);
    }
  }, [autoOpenAddDialog]);

  // Simple inline add form state
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [inlineFormData, setInlineFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    categoryId: '',
    accountId: ''
  });

  const types = ['income', 'expense', 'transfer'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || transaction.type === selectedType;
      const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
      const matchesAccount = selectedAccount === 'all' || transaction.account === selectedAccount;
      const matchesDate = !dateRange.from || !dateRange.to || 
                         (transaction.date >= dateRange.from && transaction.date <= dateRange.to);
      
      return matchesSearch && matchesType && matchesCategory && matchesAccount && matchesDate;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof Transaction];
      let bValue: any = b[sortBy as keyof Transaction];
      
      if (sortBy === 'date') {
        aValue = a.date.getTime();
        bValue = b.date.getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTransactions(filteredTransactions.map(t => t.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleSelectTransaction = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedTransactions([...selectedTransactions, id]);
    } else {
      setSelectedTransactions(selectedTransactions.filter(t => t !== id));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await transactionsApi.deleteMultiple(selectedTransactions);
      setTransactions(transactions.filter(t => !selectedTransactions.includes(t.id)));
      setSelectedTransactions([]);
    } catch (error) {
      console.error('Error deleting transactions:', error);
      alert('Failed to delete transactions');
    }
  };

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.max(...transactions.map(t => t.id)) + 1
    };
    setTransactions([newTransaction, ...transactions]);
    setShowAddDialog(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactions(transactions.map(t => t.id === transaction.id ? transaction : t));
    setEditingTransaction(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowInlineForm(!showInlineForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Simple Inline Add Form */}
      {showInlineForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input
                placeholder="Description"
                value={inlineFormData.description}
                onChange={(e) => setInlineFormData({...inlineFormData, description: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Amount"
                value={inlineFormData.amount}
                onChange={(e) => setInlineFormData({...inlineFormData, amount: e.target.value})}
              />
              <Select value={inlineFormData.type} onValueChange={(value) => setInlineFormData({...inlineFormData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={inlineFormData.categoryId} onValueChange={(value) => setInlineFormData({...inlineFormData, categoryId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button 
                  onClick={async () => {
                    if (inlineFormData.description && inlineFormData.amount && inlineFormData.categoryId && inlineFormData.accountId) {
                      try {
                        const newTransaction = await transactionsApi.create({
                          description: inlineFormData.description,
                          amount: parseFloat(inlineFormData.amount),
                          type: inlineFormData.type as 'income' | 'expense' | 'transfer',
                          categoryId: parseInt(inlineFormData.categoryId),
                          accountId: parseInt(inlineFormData.accountId),
                          date: new Date().toISOString().split('T')[0],
                          tags: [],
                          notes: ''
                        });
                        
                        setTransactions([newTransaction, ...transactions]);
                        setInlineFormData({
                          description: '',
                          amount: '',
                          type: 'expense',
                          categoryId: '',
                          accountId: ''
                        });
                        setShowInlineForm(false);
                      } catch (error) {
                        console.error('Error creating transaction:', error);
                        alert('Failed to create transaction');
                      }
                    }
                  }}
                  className="flex-1"
                >
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowInlineForm(false);
                    setInlineFormData({
                      description: '',
                      amount: '',
                      type: 'expense',
                      category: '',
                      account: ''
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <Select value={inlineFormData.accountId} onValueChange={(value) => setInlineFormData({...inlineFormData, accountId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id.toString()}>{account.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search transactions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {accounts.map(account => (
                  <SelectItem key={account} value={account}>{account}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedTransactions.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedTransactions.length} transaction(s) selected
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedTransactions.length === filteredTransactions.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('date')}
                    className="h-auto p-0 font-medium"
                  >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('amount')}
                    className="h-auto p-0 font-medium"
                  >
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTransactions.includes(transaction.id)}
                      onCheckedChange={(checked) => 
                        handleSelectTransaction(transaction.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {format(transaction.date, 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      {transaction.notes && (
                        <div className="text-sm text-muted-foreground">{transaction.notes}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell>{transaction.account}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {transaction.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTransaction(transaction)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Transaction Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            onSubmit={handleAddTransaction}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <TransactionForm
              transaction={editingTransaction}
              onSubmit={handleEditTransaction}
              onCancel={() => setEditingTransaction(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Transaction Form Component
interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    description: transaction?.description || '',
    amount: transaction?.amount || 0,
    type: transaction?.type || 'expense',
    category: transaction?.category || '',
    account: transaction?.account || '',
    date: transaction?.date || new Date(),
    tags: transaction?.tags || [],
    notes: transaction?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {types.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="account">Account</Label>
          <Select value={formData.account} onValueChange={(value) => setFormData({ ...formData, account: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map(account => (
                <SelectItem key={account} value={account}>{account}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(formData.date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => date && setFormData({ ...formData, date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Optional notes..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {transaction ? 'Update' : 'Add'} Transaction
        </Button>
      </div>
    </form>
  );
};

export default Transactions;
