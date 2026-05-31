import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localQuery, localMutation, createQueryKey } from '@/client/lib/localData';
import { getOrCreateSessionId } from '@/client/lib/format';
import toast from 'react-hot-toast';

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  lineTotal: number;
};

export type Cart = {
  sessionId: string;
  items: CartItem[];
  subtotal: number;
};

export function useCart() {
  const sessionId = getOrCreateSessionId();
  const queryClient = useQueryClient();
  const queryKey = createQueryKey('nursery.getCart', { sessionId });

  const { data, isLoading } = useQuery({
    ...localQuery<Cart>('nursery.getCart', { sessionId }),
  });

  const cart: Cart = data ?? { sessionId, items: [], subtotal: 0 };

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const addMutation = useMutation({
    ...localMutation('nursery.addToCart'),
    onSuccess: () => {
      invalidate();
      toast.success('Added to your collection');
    },
  });

  const updateMutation = useMutation({
    ...localMutation('nursery.updateCartItem'),
    onSuccess: invalidate,
  });

  const clearMutation = useMutation({
    ...localMutation('nursery.clearCart'),
    onSuccess: invalidate,
  });

  return {
    cart,
    isLoading,
    addToCart: (slug: string, quantity = 1) =>
      addMutation.mutate({ sessionId, slug, quantity }),
    updateItem: (slug: string, quantity: number) =>
      updateMutation.mutate({ sessionId, slug, quantity }),
    clearCart: () => clearMutation.mutate({ sessionId }),
    itemCount: cart.items.reduce((s, i) => s + i.quantity, 0),
  };
}
