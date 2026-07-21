import styled from 'styled-components';
import type { Transaction } from '../types/transaction';
import { Trash2 } from 'lucide-react';

interface TransactionsTableProps {
  transactions: Transaction[];
  onDeleteTransaction?: (id: string) => void;
}

const Container = styled.div`
  margin-top: 4rem;
  width: 100%;
  overflow-x: auto; /* Permite rolar a tabela lateralmente no celular */

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px; /* Garante espaço mínimo para os dados */

    th {
      color: #c4c4cc;
      font-weight: normal;
      padding: 1rem 2rem;
      text-align: left;
      line-height: 1.5rem;
    }

    td {
      padding: 1rem 2rem;
      background: #202024;
      border-top: 4px solid #121214;
      color: #c4c4cc;

      &:first-child {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
        color: #e1e1e6;
        font-weight: 500;
      }

      &:last-child {
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
        text-align: center;
      }
    }
  }
`;

const PriceHighlight = styled.span<{ $tipo: 'receita' | 'despesa' }>`
  color: ${(props) => (props.$tipo === 'receita' ? '#00b37e' : '#f75a68')};
  font-weight: 500;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: 0;
  color: #7c7c8a;
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

  &:hover {
    color: #f75a68;
  }
`;

export function TransactionsTable({ transactions, onDeleteTransaction }: TransactionsTableProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Preço</th>
            <th>Categoria</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => {
            const valorNumerico = Number(transaction.valor) || 0;
            return (
              <tr key={transaction.id}>
                <td>{transaction.descricao}</td>
                <td>
                  <PriceHighlight $tipo={transaction.tipo}>
                    {transaction.tipo === 'despesa' && '- '}
                    {formatCurrency(valorNumerico)}
                  </PriceHighlight>
                </td>
                <td>{transaction.categoria}</td>
                <td>{formatDate(transaction.data)}</td>
                <td>
                  {onDeleteTransaction && (
                    <DeleteButton
                      title="Excluir transação"
                      onClick={() => onDeleteTransaction(transaction.id)}
                    >
                      <Trash2 size={18} />
                    </DeleteButton>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Container>
  );
}