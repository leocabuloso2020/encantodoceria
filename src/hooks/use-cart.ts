import { useState, useEffect, useCallback } from 'react';
import { CartItem } from '@/types/Cart';
import { Product } from '@/types/Product';
import { toast } from 'sonner';

const CART_STORAGE_KEY = 'docesdapaty_cart';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      console.log('Initializing cart from localStorage:', storedCart ? JSON.parse(storedCart) : []);
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    console.log('Cart items updated, saving to localStorage:', cartItems);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    console.log('Attempting to add item:', product.name, 'Quantity:', quantity);
    setCartItems((prevItems) => {
      console.log('Current cart state (prevItems) in addItem:', prevItems);
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast.error(`Não há estoque suficiente para adicionar ${quantity} unidades de ${product.name}.`, {
            description: `Disponível: ${product.stock}, no carrinho: ${existingItem.quantity}.`,
          });
          console.warn('Not enough stock for existing item:', product.name);
          return prevItems;
        }
        toast.success(`${quantity}x ${product.name} adicionado(s) ao carrinho!`);
        const updatedItems = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
        console.log('Updated cart (existing item):', updatedItems);
        return updatedItems;
      } else {
        if (quantity > product.stock) {
          toast.error(`Não há estoque suficiente para adicionar ${quantity} unidades de ${product.name}.`, {
            description: `Disponível: ${product.stock}.`,
          });
          console.warn('Not enough stock for new item:', product.name);
          return prevItems;
        }
        toast.success(`${quantity}x ${product.name} adicionado(s) ao carrinho!`);
        const newItems = [...prevItems, { ...product, quantity }];
        console.log('Updated cart (new item):', newItems);
        return newItems;
      }
    });
  }, []); // No dependencies needed here because setCartItems is stable and functional update is used.

  const removeItem = useCallback((productId: string) => {
    console.log('Attempting to remove item:', productId);
    setCartItems((prevItems) => {
      const filteredItems = prevItems.filter((item) => item.id !== productId);
      console.log('Cart after removal:', filteredItems);
      return filteredItems;
    });
    toast.info("Item removido do carrinho.");
  }, []);

  const updateItemQuantity = useCallback((productId: string, newQuantity: number) => {
    console.log('Attempting to update quantity for item:', productId, 'New quantity:', newQuantity);
    setCartItems((prevItems) => {
      const itemToUpdate = prevItems.find((item) => item.id === productId);
      if (!itemToUpdate) {
        console.warn('Item not found for quantity update:', productId);
        return prevItems;
      }

      if (newQuantity <= 0) {
        toast.info("Item removido do carrinho.");
        const filteredItems = prevItems.filter((item) => item.id !== productId);
        console.log('Cart after quantity to 0 (removed):', filteredItems);
        return filteredItems;
      }
      if (newQuantity > itemToUpdate.stock) {
        toast.error(`Não há estoque suficiente para ${newQuantity} unidades de ${itemToUpdate.name}.`, {
          description: `Disponível: ${itemToUpdate.stock}.`,
        });
        console.warn('Not enough stock for quantity update:', itemToUpdate.name);
        return prevItems;
      }
      toast.success(`Quantidade de ${itemToUpdate.name} atualizada para ${newQuantity}.`);
      const updatedItems = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      console.log('Cart after quantity update:', updatedItems);
      return updatedItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    console.log('Clearing cart.');
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