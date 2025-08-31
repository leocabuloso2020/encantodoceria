import { useState, useEffect, useCallback } from 'react';
import { CartItem } from '@/types/Cart';
import { Product } from '@/types/Product';
import { toast } from 'sonner';

const CART_STORAGE_KEY = 'docesdapaty_cart';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
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
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    toast.info("Item removido do carrinho.");
  }, []);

  const updateItemQuantity = useCallback((productId: string, newQuantity: number) => {
    setCartItems((prevItems) => {
      const itemToUpdate = prevItems.find((item) => item.id === productId);
      if (!itemToUpdate) return prevItems;

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

  return {
    cartItems,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };
};