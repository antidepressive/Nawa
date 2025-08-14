// Finance Dashboard API Service

const API_BASE = '/api/finance';

// Helper function to add auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('finance_dashboard_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
};

// Accounts API
export const accountsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/accounts`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (account: any) => {
    const response = await fetch(`${API_BASE}/accounts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(account)
    });
    return handleResponse(response);
  },

  update: async (id: number, account: any) => {
    const response = await fetch(`${API_BASE}/accounts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(account)
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE}/accounts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/categories`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (category: any) => {
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(category)
    });
    return handleResponse(response);
  },

  update: async (id: number, category: any) => {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(category)
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Transactions API
export const transactionsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/transactions`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (transaction: any) => {
    const response = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(transaction)
    });
    return handleResponse(response);
  },

  update: async (id: number, transaction: any) => {
    const response = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(transaction)
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  deleteMultiple: async (ids: number[]) => {
    const response = await fetch(`${API_BASE}/transactions`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids })
    });
    return handleResponse(response);
  }
};

// Budgets API
export const budgetsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/budgets`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (budget: any) => {
    const response = await fetch(`${API_BASE}/budgets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(budget)
    });
    return handleResponse(response);
  },

  update: async (id: number, budget: any) => {
    const response = await fetch(`${API_BASE}/budgets/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(budget)
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE}/budgets/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// User Settings API
export const settingsApi = {
  get: async (userId: number) => {
    const response = await fetch(`${API_BASE}/settings/${userId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (settings: any) => {
    const response = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    return handleResponse(response);
  },

  update: async (userId: number, settings: any) => {
    const response = await fetch(`${API_BASE}/settings/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    return handleResponse(response);
  }
};

// Initialize default data if database is empty
export const initializeDefaultData = async () => {
  try {
    // Check if we have any accounts
    const accounts = await accountsApi.getAll();
    if (accounts.length === 0) {
      // Create default accounts
      await accountsApi.create({
        name: 'Checking',
        type: 'checking',
        balance: 5000.00,
        currency: 'USD',
        color: '#3B82F6'
      });
      
      await accountsApi.create({
        name: 'Savings',
        type: 'savings',
        balance: 10000.00,
        currency: 'USD',
        color: '#10B981'
      });
      
      await accountsApi.create({
        name: 'Credit Card',
        type: 'credit',
        balance: -500.00,
        currency: 'USD',
        color: '#EF4444'
      });
    }

    // Check if we have any categories
    const categories = await categoriesApi.getAll();
    if (categories.length === 0) {
      // Create default categories
      const defaultCategories = [
        { name: 'Food & Dining', type: 'expense', color: '#3B82F6' },
        { name: 'Transportation', type: 'expense', color: '#10B981' },
        { name: 'Shopping', type: 'expense', color: '#F59E0B' },
        { name: 'Entertainment', type: 'expense', color: '#EF4444' },
        { name: 'Utilities', type: 'expense', color: '#8B5CF6' },
        { name: 'Healthcare', type: 'expense', color: '#06B6D4' },
        { name: 'Salary', type: 'income', color: '#10B981' },
        { name: 'Freelance', type: 'income', color: '#3B82F6' },
        { name: 'Investment', type: 'income', color: '#F59E0B' }
      ];

      for (const category of defaultCategories) {
        await categoriesApi.create(category);
      }
    }

    // Check if we have any transactions
    const transactions = await transactionsApi.getAll();
    if (transactions.length === 0) {
      // Get the first account and category for sample data
      const accounts = await accountsApi.getAll();
      const categories = await categoriesApi.getAll();
      
      if (accounts.length > 0 && categories.length > 0) {
        const sampleTransactions = [
          {
            accountId: accounts[0].id,
            categoryId: categories.find(c => c.name === 'Food & Dining')?.id || categories[0].id,
            amount: 85.50,
            description: 'Grocery shopping',
            date: new Date().toISOString().split('T')[0],
            type: 'expense',
            tags: ['groceries', 'food'],
            notes: 'Weekly grocery run'
          },
          {
            accountId: accounts[0].id,
            categoryId: categories.find(c => c.name === 'Salary')?.id || categories[0].id,
            amount: 4500.00,
            description: 'Salary deposit',
            date: new Date().toISOString().split('T')[0],
            type: 'income',
            tags: ['salary', 'income']
          }
        ];

        for (const transaction of sampleTransactions) {
          await transactionsApi.create(transaction);
        }
      }
    }
  } catch (error) {
    console.error('Error initializing default data:', error);
  }
};
