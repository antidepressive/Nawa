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
  amount: string;
  type: 'income' | 'expense' | 'transfer';
  categoryId: number;
  accountId: number;
  date: string;
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
    accountId: '',
    date: new Date().toISOString().split('T')[0] // Default to today
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
      const category = categories.find(c => c.id === transaction.categoryId);
      const account = accounts.find(a => a.id === transaction.accountId);
      const categoryName = category?.name || 'Unknown';
      const accountName = account?.name || 'Unknown';
      
      const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           accountName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || transaction.type === selectedType;
      const matchesCategory = selectedCategory === 'all' || categoryName === selectedCategory;
      const matchesAccount = selectedAccount === 'all' || accountName === selectedAccount;
      const matchesDate = !dateRange.from || !dateRange.to || 
                         (new Date(transaction.date) >= dateRange.from && new Date(transaction.date) <= dateRange.to);
      
      return matchesSearch && matchesType && matchesCategory && matchesAccount && matchesDate;
    })
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      if (sortBy === 'date') {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      } else if (sortBy === 'category') {
        const categoryA = categories.find(c => c.id === a.categoryId);
        const categoryB = categories.find(c => c.id === b.categoryId);
        aValue = categoryA?.name || 'Unknown';
        bValue = categoryB?.name || 'Unknown';
      } else if (sortBy === 'account') {
        const accountA = accounts.find(acc => acc.id === a.accountId);
        const accountB = accounts.find(acc => acc.id === b.accountId);
        aValue = accountA?.name || 'Unknown';
        bValue = accountB?.name || 'Unknown';
      } else {
        aValue = a[sortBy as keyof Transaction];
        bValue = b[sortBy as keyof Transaction];
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

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await transactionsApi.create(transaction);
      setTransactions([newTransaction, ...transactions]);
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Failed to create transaction');
    }
  };

  const handleEditTransaction = async (transaction: Transaction) => {
    try {
      const updatedTransaction = await transactionsApi.update(transaction.id, transaction);
      setTransactions(transactions.map(t => t.id === transaction.id ? updatedTransaction : t));
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl lg:text-2xl font-bold">Transactions</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-shrink-0">
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button onClick={() => setShowInlineForm(!showInlineForm)} className="flex-shrink-0">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Transaction</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
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
              <div className="flex gap-2">
                <Button 
                  onClick={async () => {
                    if (inlineFormData.description && inlineFormData.amount && inlineFormData.categoryId && inlineFormData.accountId) {
                      try {
                        const newTransaction = await transactionsApi.create({
                          description: inlineFormData.description,
                          amount: inlineFormData.amount,
                          type: inlineFormData.type as 'income' | 'expense' | 'transfer',
                          categoryId: parseInt(inlineFormData.categoryId),
                          accountId: parseInt(inlineFormData.accountId),
                          date: inlineFormData.date,
                          tags: [],
                          notes: ''
                        });
                        
                        setTransactions([newTransaction, ...transactions]);
                        setInlineFormData({
                          description: '',
                          amount: '',
                          type: 'expense',
                          categoryId: '',
                          accountId: '',
                          date: new Date().toISOString().split('T')[0]
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
                      categoryId: '',
                      accountId: '',
                      date: new Date().toISOString().split('T')[0]
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal w-full">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {inlineFormData.date ? format(new Date(inlineFormData.date), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(inlineFormData.date)}
                    onSelect={(date) => setInlineFormData({...inlineFormData, date: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                  <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
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
                  <SelectItem key={account.id} value={account.name}>{account.name}</SelectItem>
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
          {/* Desktop Table View */}
          <div className="hidden lg:block">
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
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
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
                      <Badge variant="secondary">
                        {categories.find(c => c.id === transaction.categoryId)?.name || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {accounts.find(a => a.id === transaction.accountId)?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(parseFloat(transaction.amount))}
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
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden p-4 space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      checked={selectedTransactions.includes(transaction.id)}
                      onCheckedChange={(checked) => 
                        handleSelectTransaction(transaction.id, checked as boolean)
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </div>
                      {transaction.notes && (
                        <div className="text-sm text-muted-foreground mt-1">{transaction.notes}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(parseFloat(transaction.amount))}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTransaction(transaction)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {categories.find(c => c.id === transaction.categoryId)?.name || 'Unknown'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {accounts.find(a => a.id === transaction.accountId)?.name || 'Unknown'}
                  </Badge>
                  {transaction.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Transaction Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto">
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
        <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto">
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
    amount: transaction?.amount || '0',
    type: transaction?.type || 'expense',
    categoryId: transaction?.categoryId?.toString() || '',
    accountId: transaction?.accountId?.toString() || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    tags: transaction?.tags || [],
    notes: transaction?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      description: formData.description,
      amount: formData.amount,
      type: formData.type as 'income' | 'expense' | 'transfer',
      categoryId: parseInt(formData.categoryId),
      accountId: parseInt(formData.accountId),
      date: formData.date,
      tags: formData.tags,
      notes: formData.notes
    });
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
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
          <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="account">Account</Label>
          <Select value={formData.accountId} onValueChange={(value) => setFormData({ ...formData, accountId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map(account => (
                <SelectItem key={account.id} value={account.id.toString()}>{account.name}</SelectItem>
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
                {format(new Date(formData.date), "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={new Date(formData.date)}
                onSelect={(date) => date && setFormData({ ...formData, date: date.toISOString().split('T')[0] })}
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
