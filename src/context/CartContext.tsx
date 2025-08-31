import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { CartItem } from '@/types/Cart';
import { Product } from '@/types/Product';
import { toast } from 'sonner';

interface CartContextType {
  cartItems: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CART_STORAGE_KEY = 'docesdapaty_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      try {
        return storedCart ? JSON.parse(storedCart) : [];
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
        toast.error("Erro ao carregar o carrinho. Ele foi resetado.");
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
      toast.error("Erro ao salvar o carrinho. Por favor, tente novamente.");
    }
  }, [cartItems]);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    if (!product || !product.id || !product.name || product.price === undefined || product.stock === undefined) {
      console.error('Invalid product or missing required properties provided to addItem:', product);
      toast.error('Não foi possível adicionar o produto. Informações inválidas ou incompletas.');
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast.error(`Não há estoque suficiente para adicionar ${quantity} unidades de ${product.name}.`, {
            description: `Disponível: ${product.stock}, no carrinho: ${existingItem.quantity}.`,
          });
          return prevItems;
        }
        toast.success(`${quantity}x ${product.name} adicionado(s) ao carrinho!`);
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        if (quantity > product.stock) {
          toast.error(`Não há estoque suficiente para adicionar ${quantity} unidades de ${product.name}.`, {
            description: `Disponível: ${product.stock}.`,
          });
          return prevItems;
        }
        toast.success(`${quantity}x ${product.name} adicionado(s) ao carrinho!`);
        return [...prevItems, { ...product, quantity }];
      }
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCartItems((prevItems) => {
      const filteredItems = prevItems.filter((item) => item.id !== productId);
      return filteredItems;
    });
    toast.info("Item removido do carrinho.");
  }, []);

  const updateItemQuantity = useCallback((productId: string, newQuantity: number) => {
    setCartItems((prevItems) => {
      const itemToUpdate = prevItems.find((item) => item.id === productId);
      if (!itemToUpdate) {
        return prevItems;
      }

      if (newQuantity <= 0) {
        toast.info("Item removido do carrinho.");
        return prevItems.filter((item) => item.id !== productId);
      }
      if (newQuantity > itemToUpdate.stock) {
        toast.error(`Não há estoque suficiente para ${newQuantity} unidades de ${itemToUpdate.name}.`, {
          description: `Disponível: ${itemToUpdate.stock}.`,
        });
        return prevItems;
      }
      toast.success(`Quantidade de ${itemToUpdate.name} atualizada para ${newQuantity}.`);
      return prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.info("Carrinho limpo.");
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const contextValue = {
    cartItems,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};