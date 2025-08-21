// Finance Dashboard API Service

const API_BASE = '/api/finance';

// Helper function to add auth token to URL (like admin dashboard)
const getAuthToken = () => {
  return sessionStorage.getItem('finance_dashboard_token');
};

// Helper function to build URL with auth token
const buildUrl = (endpoint: string) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token');
  }
  
  return endpoint.includes('?') 
    ? `${endpoint}&apiKey=${encodeURIComponent(token)}`
    : `${endpoint}?apiKey=${encodeURIComponent(token)}`;
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
    const response = await fetch(buildUrl(`${API_BASE}/accounts`), {
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  create: async (account: any) => {
    const response = await fetch(buildUrl(`${API_BASE}/accounts`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account)
    });
    return handleResponse(response);
  },

  update: async (id: number, account: any) => {
    const response = await fetch(buildUrl(`${API_BASE}/accounts/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account)
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetch(buildUrl(`${API_BASE}/accounts/${id}`), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  }
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const response = await fetch(buildUrl(`${API_BASE}/categories`), {
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  create: async (category: any) => {
    const response = await fetch(buildUrl(`${API_BASE}/categories`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    return handleResponse(response);
  },

  update: async (id: number, category: any) => {
    const response = await fetch(buildUrl(`${API_BASE}/categories/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetch(buildUrl(`${API_BASE}/categories/${id}`), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  }
};

// Transactions API
export const transactionsApi = {
  getAll: async () => {
    const response = await fetch(buildUrl(`${API_BASE}/transactions`), {
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  create: async (transaction: any) => {
    const response = await fetch(buildUrl(`${API_BASE}/transactions`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    return handleResponse(response);
  },

  update: async (id: number, transaction: any) => {
    const response = await fetch(buildUrl(`${API_BASE}/transactions/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetch(buildUrl(`${API_BASE}/transactions/${id}`), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  deleteMultiple: async (ids: number[]) => {
    const response = await fetch(buildUrl(`${API_BASE}/transactions`), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });
    return handleResponse(response);
  }
};

// Budgets API
export const budgetsApi = {
  getAll: async () => {
    const response = await fetch(buildUrl(`${API_BASE}/budgets`), {
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  create: async (budget: any) => {
    const response = await fetch(buildUrl(`${API_BASE}/budgets`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budget)
    });
    return handleResponse(response);
  },

  update: async (id: number, budget: any) => {
    const response = await fetch(buildUrl(`${API_BASE}/budgets/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budget)
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetch(buildUrl(`${API_BASE}/budgets/${id}`), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  }
};

// User Settings API
export const settingsApi = {
  get: async (userId: number) => {
    const response = await fetch(buildUrl(`${API_BASE}/settings/${userId}`), {
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  create: async (settings: any) => {
    const response = await fetch(buildUrl(`${API_BASE}/settings`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return handleResponse(response);
  },

  update: async (userId: number, settings: any) => {
    const response = await fetch(buildUrl(`${API_BASE}/settings/${userId}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return handleResponse(response);
  }
};

// Company Finance Dashboard - No default data initialization
// All data should be added by employees and shared across all users
export const initializeDefaultData = async () => {
  // No initialization needed for company finance dashboard
  // Data should be empty by default and only contain what employees add
  console.log('Company finance dashboard - no default data initialization');
};
