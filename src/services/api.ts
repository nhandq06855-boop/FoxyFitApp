import axios from 'axios';
import { ProductApiResponse } from '../types';

const BASE_URL = 'https://dummyjson.com/products';

export const fetchProducts = async (
  limit: number = 10,
  skip: number = 0,
  searchQuery: string = ''
): Promise<ProductApiResponse> => {
  try {
    let url = `${BASE_URL}?limit=${limit}&skip=${skip}`;
    
    // Nếu có từ khóa tìm kiếm thì dùng endpoint search
    if (searchQuery.trim() !== '') {
      url = `${BASE_URL}/search?q=${encodeURIComponent(searchQuery)}&limit=${limit}&skip=${skip}`;
    }

    const response = await axios.get<ProductApiResponse>(url);
    return response.data;
  } catch (error) {
    throw new Error('Không thể tải dữ liệu từ máy chủ. Vui lòng thử lại!');
  }
};