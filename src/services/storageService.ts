import { Product, StockMovement, INITIAL_PRODUCTS } from '../types';

const PRODUCTS_KEY = 'stockflow_products';
const MOVEMENTS_KEY = 'stockflow_movements';

export const storageService = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (!data) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  },

  saveProducts: (products: Product[]) => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  getMovements: (): StockMovement[] => {
    const data = localStorage.getItem(MOVEMENTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveMovements: (movements: StockMovement[]) => {
    localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(movements));
  },

  addMovement: (movement: Omit<StockMovement, 'id' | 'timestamp'>) => {
    const movements = storageService.getMovements();
    const newMovement: StockMovement = {
      ...movement,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    storageService.saveMovements([newMovement, ...movements]);
    return newMovement;
  }
};
