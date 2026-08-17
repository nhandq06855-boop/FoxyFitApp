export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    category: string;
  }
  
  export interface ProductApiResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
  }
  
  export type RootStackParamList = {
    Listing: undefined;
    Detail: { product: Product };
  };