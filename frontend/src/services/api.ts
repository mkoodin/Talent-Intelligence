import { Insight, FilterOptions, Filters } from '../types';

// Backend API URL - change this if deploying to a different backend
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : import.meta.env.PROD
  ? 'https://talent-intelligence.onrender.com/api'  // Production backend
  : '/api';  // Local development

export async function fetchInsights(filters: Partial<Filters>): Promise<Insight[]> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'all') {
      params.append(key, value);
    }
  });

  const response = await fetch(`${API_BASE_URL}/insights?${params.toString()}`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch insights');
  }

  return data.data;
}

export async function fetchFilterOptions(): Promise<FilterOptions> {
  const response = await fetch(`${API_BASE_URL}/filters`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch filter options');
  }

  return data.data;
}

export async function fetchStats() {
  const response = await fetch(`${API_BASE_URL}/stats`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch stats');
  }

  return data.data;
}
