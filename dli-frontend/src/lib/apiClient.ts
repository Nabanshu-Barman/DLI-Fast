export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not set');
  }
  let token = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('dli_jwt');
  }

  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dli_jwt');
      window.location.href = '/login';
    }
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return { success: true, data: null };
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const get = (path: string) => apiRequest(path, { method: 'GET' });

export const post = (path: string, body?: any) => 
  apiRequest(path, { 
    method: 'POST', 
    body: body ? JSON.stringify(body) : undefined 
  });

export const patch = (path: string, body?: any) => 
  apiRequest(path, { 
    method: 'PATCH', 
    body: body ? JSON.stringify(body) : undefined 
  });