const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';

export interface Item {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
}

export interface ApiResponse {
  success: boolean;
  total: number;
  data: Item[];
  message?: string;
}

export async function fetchItems(search?: string): Promise<ApiResponse> {
  const url = new URL(`${API_BASE}/api/items`);
  if (search && search.trim() !== '') {
    url.searchParams.set('search', search.trim());
  }

  const res = await fetch(url.toString(), { cache: 'no-store' });

  if (!res.ok) {
    const error: ApiResponse = await res.json().catch(() => ({
      success: false,
      total: 0,
      data: [],
      message: `Request failed with status ${res.status}`,
    }));
    throw new Error(error.message ?? 'Unknown API error');
  }

  return res.json() as Promise<ApiResponse>;
}
