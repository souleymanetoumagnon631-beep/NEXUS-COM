import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface Transaction {
    id: string;
    user_id: string;
    product_id?: string;
    client_name: string;
    client_phone?: string;
    amount: number;
    currency: string;
    type: 'vente' | 'achat';
    source: 'whatsapp' | 'manual';
    status: 'confirmed' | 'pending' | 'cancelled';
    transaction_date: string;
    created_at: string;
}

export const useTransactions = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    // Fetch Transactions
    const { data: transactions, isLoading, isError, error } = useQuery({
        queryKey: ['transactions', user?.id],
        queryFn: async () => {
            if (!user) throw new Error("Non authentifié");
            
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .order('transaction_date', { ascending: false })
                .limit(50);
                
            if (error) throw error;
            return data as Transaction[];
        },
        enabled: !!user,
    });

    // Add Transaction
    const addTransaction = useMutation({
        mutationFn: async (newTx: Partial<Transaction>) => {
            if (!user) throw new Error("Non authentifié");

            const { data, error } = await supabase
                .from('transactions')
                .insert([{
                    ...newTx,
                    user_id: user.id,
                    source: 'manual', // Force manual source
                    currency: 'XOF',
                    status: 'confirmed',
                    transaction_date: new Date().toISOString(),
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
        },
    });

    return {
        transactions,
        isLoading,
        isError,
        error,
        addTransaction,
    };
};
