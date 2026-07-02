import React, { useState } from 'react';
import { Plus, Search, Loader2, AlertCircle, RefreshCw, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTransactions } from '../../hooks/useTransactions';

const Transactions: React.FC = () => {
    const { transactions, isLoading, isError, error, addTransaction } = useTransactions();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state
    const [amount, setAmount] = useState('');
    const [clientName, setClientName] = useState('');
    const [type, setType] = useState<'vente' | 'achat'>('vente');

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addTransaction.mutateAsync({
                amount: parseFloat(amount),
                client_name: clientName || 'Client divers',
                type,
            });
            setIsModalOpen(false);
            setAmount('');
            setClientName('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-creme mb-2">Transactions</h1>
                    <p className="text-creme/50">Gérez vos ventes et achats quotidiens.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="magnetic-btn bg-argile text-creme px-6 py-3 flex items-center gap-2 font-medium shadow-lg shadow-argile/20 whitespace-nowrap"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Nouvelle transaction
                    </span>
                    <div className="btn-bg bg-argile-600"></div>
                </button>
            </div>

            {/* Content State Handling */}
            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-argile mb-4" />
                    <p className="text-creme/50 font-mono text-sm uppercase tracking-widest animate-pulse">Chargement...</p>
                </div>
            ) : isError ? (
                <div className="glass-card bg-red-500/10 border-red-500/30 p-8 flex flex-col items-center text-center max-w-lg mx-auto mt-10">
                    <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                    <h3 className="text-lg font-bold text-creme mb-2">Erreur de chargement</h3>
                    <p className="text-creme/60 text-sm mb-6">{(error as Error)?.message || "Impossible de récupérer les transactions."}</p>
                    <button className="px-4 py-2 bg-charbon-900 border border-white/10 rounded-lg text-creme text-sm flex items-center gap-2 hover:bg-white/5">
                        <RefreshCw className="w-4 h-4" /> Réessayer
                    </button>
                </div>
            ) : transactions?.length === 0 ? (
                <div className="glass-card border-white/5 p-12 flex flex-col items-center text-center mt-10">
                    <div className="w-20 h-20 bg-charbon-900 rounded-full flex items-center justify-center border border-white/5 mb-6">
                        <Search className="w-8 h-8 text-creme/20" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-creme mb-2">Aucune transaction</h3>
                    <p className="text-creme/50 max-w-md mx-auto mb-8">
                        Vous n'avez pas encore enregistré de vente ou d'achat. Utilisez l'assistant WhatsApp ou ajoutez-en une manuellement.
                    </p>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-mousse-800 text-creme border border-mousse-500/30 rounded-xl hover:bg-mousse-700 transition-colors"
                    >
                        Ajouter manuellement
                    </button>
                </div>
            ) : (
                <div className="glass-card border-white/5 overflow-hidden flex-1 flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-xs font-mono uppercase tracking-wider text-creme/40 bg-charbon-950/50">
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Client/Description</th>
                                    <th className="px-6 py-4 font-medium">Type</th>
                                    <th className="px-6 py-4 font-medium">Source</th>
                                    <th className="px-6 py-4 font-medium text-right">Montant</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transactions?.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 text-sm text-creme/60">
                                            {format(new Date(tx.transaction_date), 'dd MMM yyyy, HH:mm', { locale: fr })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-creme">{tx.client_name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                                tx.type === 'vente' 
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                                : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                            }`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono text-creme/40 uppercase bg-charbon-900 px-2 py-1 rounded border border-white/5">
                                                {tx.source}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-mono font-medium ${tx.type === 'vente' ? 'text-creme' : 'text-creme/60'}`}>
                                                {tx.type === 'vente' ? '+' : '-'}{tx.amount.toLocaleString('fr-FR')} FCFA
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal Ajout Manuel */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-charbon-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card-strong border-white/10 p-8 w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-creme/50 hover:text-creme bg-charbon-900 rounded-full border border-white/5"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        
                        <h2 className="text-2xl font-display font-bold text-creme mb-6">Ajouter une transaction</h2>
                        
                        <form onSubmit={handleAdd} className="space-y-5">
                            <div>
                                <label className="block text-xs font-mono text-creme/50 uppercase tracking-wider mb-2">
                                    Type d'opération
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setType('vente')}
                                        className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                                            type === 'vente' 
                                            ? 'bg-mousse-800 border-mousse-500 text-creme' 
                                            : 'bg-charbon-900 border-white/5 text-creme/50 hover:bg-white/5'
                                        }`}
                                    >
                                        Vente
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setType('achat')}
                                        className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                                            type === 'achat' 
                                            ? 'bg-orange-900/50 border-orange-500/50 text-orange-200' 
                                            : 'bg-charbon-900 border-white/5 text-creme/50 hover:bg-white/5'
                                        }`}
                                    >
                                        Achat / Dépense
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-creme/50 uppercase tracking-wider mb-2">
                                    Montant (FCFA)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-charbon-900 border border-white/10 rounded-xl px-4 py-3 text-creme font-mono focus:outline-none focus:border-argile/50 focus:ring-1 focus:ring-argile/50 placeholder:text-creme/20"
                                    placeholder="ex: 15000"
                                    required
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-creme/50 uppercase tracking-wider mb-2">
                                    Client / Description (Optionnel)
                                </label>
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    className="w-full bg-charbon-900 border border-white/10 rounded-xl px-4 py-3 text-creme focus:outline-none focus:border-argile/50 focus:ring-1 focus:ring-argile/50 placeholder:text-creme/20"
                                    placeholder="ex: Aminata, 2 sacs de riz"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={addTransaction.isPending}
                                className="w-full bg-argile text-creme font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-argile-400 transition-colors disabled:opacity-70 mt-4"
                            >
                                {addTransaction.isPending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Enregistrer"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
