import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Summary } from './components/Summary';
import { TransactionsTable } from './components/TransactionsTable';
import { NewTransactionModal } from './components/NewTransactionModal';
import { Login } from './components/Login';
import { supabase } from './services/supabase';
import type { Transaction } from './types/transaction';
import { GlobalStyles } from './styles/GlobalStyles';

export function App() {
  const [session, setSession] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);

  // Busca as transações no Supabase
  async function fetchTransactions() {
    const { data, error } = await supabase
      .from('transacoes')
      .select('*')
      .order('data', { ascending: false });

    if (error) {
      console.error('Erro ao carregar transações:', error);
    } else if (data) {
      setTransactions(data);
    }
  }

  // Função para deletar transação
  async function handleDeleteTransaction(id: string) {
    const { error } = await supabase
      .from('transacoes')
      .delete()
      .eq('id', id);

    if (error) {
      alert(`Erro ao excluir transação: ${error.message}`);
      return;
    }

    fetchTransactions();
  }

  // Monitora a sessão do usuário no Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
      if (session) {
        fetchTransactions();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
      if (session) {
        fetchTransactions();
      } else {
        setTransactions([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  function handleOpenNewTransactionModal() {
    setIsNewTransactionModalOpen(true);
  }

  function handleCloseNewTransactionModal() {
    setIsNewTransactionModalOpen(false);
  }

  // Se não estiver logado, exibe a tela de Login
  if (!session) {
    return (
      <>
        <GlobalStyles />
        <Login />
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      
      <Header onOpenNewTransactionModal={handleOpenNewTransactionModal} />
      
      <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '2.5rem 1rem' }}>
        <Summary transactions={transactions} />
        <TransactionsTable 
          transactions={transactions} 
          onDeleteTransaction={handleDeleteTransaction}
        />
      </main>

      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={handleCloseNewTransactionModal}
        onTransactionCreated={fetchTransactions}
      />
    </>
  );
}

export default App;