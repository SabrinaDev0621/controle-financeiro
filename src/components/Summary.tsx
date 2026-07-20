import styled from 'styled-components';
import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';
import type { Transaction } from '../types/transaction';

interface SummaryProps {
  transactions: Transaction[];
}

const SummaryContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: -5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

interface CardProps {
  $isTotalNegative?: boolean;
  $isTotal?: boolean;
}

const Card = styled.div<CardProps>`
  background: ${(props) =>
    props.$isTotal
      ? props.$isTotalNegative
        ? '#f75a68'
        : '#00875f'
      : '#202024'};
  padding: 1.5rem 2rem;
  border-radius: 6px;
  color: #e1e1e6;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #c4c4cc;
  }

  strong {
    display: block;
    margin-top: 1rem;
    font-size: 2rem;
    font-weight: normal;
    line-height: 3rem;
  }
`;

export function Summary({ transactions }: SummaryProps) {
  const summary = transactions.reduce(
    (acc, transaction) => {
      const valor = Number(transaction.valor) || 0;

      if (transaction.tipo === 'receita') {
        acc.entradas += valor;
        acc.total += valor;
      } else {
        acc.saidas += valor;
        acc.total -= valor;
      }

      return acc;
    },
    {
      entradas: 0,
      saidas: 0,
      total: 0,
    }
  );

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);

  return (
    <SummaryContainer>
      <Card>
        <header>
          <span>Entradas</span>
          <ArrowUpCircle size={32} color="#00b37e" />
        </header>
        <strong>{formatCurrency(summary.entradas)}</strong>
      </Card>

      <Card>
        <header>
          <span>Saídas</span>
          <ArrowDownCircle size={32} color="#f75a68" />
        </header>
        <strong>- {formatCurrency(summary.saidas)}</strong>
      </Card>

      <Card $isTotal $isTotalNegative={summary.total < 0}>
        <header>
          <span>Saldo Total</span>
          <DollarSign size={32} color="#fff" />
        </header>
        <strong>{formatCurrency(summary.total)}</strong>
      </Card>
    </SummaryContainer>
  );
}