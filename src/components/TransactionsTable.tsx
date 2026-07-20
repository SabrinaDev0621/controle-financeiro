import styled from 'styled-components';
import { Trash2 } from 'lucide-react';
import type { Transaction } from '../types/transaction';

const Container = styled.div`
  max-width: 1120px;
  margin: 4rem auto 2rem;
  padding: 0 1rem;

  table {
    width: 100%;
    border-spacing: 0 0.5rem;

    th {
      color: #a0aec0;
      font-weight: 500;
      padding: 1rem 2rem;
      text-align: left;
      line-height: 1.5rem;
    }

    td {
      padding: 1.25rem 2rem;
      border: 0;
      background: #ffffff;
      color: #4a5568;
      font-weight: 400;

      &:first-child {
        border-radius: 0.5rem 0 0 0.5rem;
        color: #2d3748;
        font-weight: 600;
      }

      &:last-child {
        border-radius: 0 0.5rem 0.5rem 0;
      }

      &.receita {
        color: #38a169;
        font-weight: 600;
      }

      &.despesa {
        color: #e53e3e;
        font-weight: 600;
      }
    }
  }

  .delete-button {
    background: transparent;
    border: 0;
    color: #e53e3e;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    background: #ffffff;
    border-radius: 0.5rem;
    color: #a0aec0;
  }
`;

interface TransactionsTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionsTable({
  transactions,
  onDeleteTransaction,
}: TransactionsTableProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));

  return (
    <Container>
      {transactions.length === 0 ? (
        <div className="empty-state">
          Nenhuma transação cadastrada ainda. Clique em "Nova Transação" para começar! 🚀
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Valor</th>
              <th>Categoria</th>
              <th>Data</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.descricao}</td>
                <td className={t.tipo}>
                  {t.tipo === 'despesa' && '- '}
                  {formatCurrency(t.valor)}
                </td>
                <td>{t.categoria}</td>
                <td>{formatDate(t.data)}</td>
                <td>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => onDeleteTransaction(t.id)}
                    title="Excluir transação"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Container>
  );
}