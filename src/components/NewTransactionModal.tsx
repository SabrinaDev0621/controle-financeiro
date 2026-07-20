import { useState } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';
import { X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { supabase } from '../services/supabase';
import { CATEGORIAS } from '../types/transaction';
import type { CategoriaType } from '../types/transaction';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionCreated: () => void;
}

const Overlay = styled.div`
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
`;

const Content = styled.div`
  width: 100%;
  max-width: 576px;
  background: #202024;
  padding: 2.5rem;
  border-radius: 0.5rem;
  position: relative;
  color: #e1e1e6;

  h2 {
    color: #e1e1e6;
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  background: transparent;
  border: 0;
  top: 1.5rem;
  right: 1.5rem;
  line-height: 0;
  cursor: pointer;
  color: #7c7c8a;

  &:hover {
    color: #e1e1e6;
  }
`;

const Form = styled.form`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input, select {
    border-radius: 6px;
    border: 0;
    background: #121214;
    color: #c4c4cc;
    padding: 1rem;
    font-size: 1rem;

    &::placeholder {
      color: #7c7c8a;
    }
  }

  button[type="submit"] {
    height: 50px;
    border: 0;
    background: #00875f;
    color: #fff;
    font-weight: bold;
    padding: 0 1.25rem;
    border-radius: 6px;
    margin-top: 1.25rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;

    &:hover {
      background: #00b37e;
    }
  }
`;

const TransactionTypeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 0.5rem;
`;

interface RadioBoxProps {
  $isActive: boolean;
  $activeColor: 'green' | 'red';
}

const RadioBox = styled.button<RadioBoxProps>`
  height: 50px;
  border: 1px solid #29292e;
  border-radius: 6px;
  background: ${(props) =>
    props.$isActive
      ? props.$activeColor === 'green'
        ? 'rgba(0, 179, 126, 0.1)'
        : 'rgba(247, 90, 104, 0.1)'
      : '#29292e'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${(props) =>
    props.$isActive
      ? props.$activeColor === 'green'
        ? '#00b37e'
        : '#f75a68'
      : '#c4c4cc'};
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;

  border-color: ${(props) =>
    props.$isActive
      ? props.$activeColor === 'green'
        ? '#00b37e'
        : '#f75a68'
      : '#29292e'};
`;

export function NewTransactionModal({
  isOpen,
  onClose,
  onTransactionCreated,
}: NewTransactionModalProps) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('receita');
  const [categoria, setCategoria] = useState<CategoriaType>('Mercado');

  if (!isOpen) return null;

  async function handleCreateNewTransaction(event: FormEvent) {
    event.preventDefault();

    if (!descricao || !valor) {
      alert('Por favor, preencha a descrição e o valor!');
      return;
    }

    const { error } = await supabase.from('transacoes').insert([
      {
        descricao,
        valor: Number(valor),
        tipo,
        categoria,
      },
    ]);

    if (error) {
      alert(`Erro ao salvar no banco: ${error.message}`);
      return;
    }

    setDescricao('');
    setValor('');
    setTipo('receita');
    setCategoria('Mercado');

    onTransactionCreated();
    onClose();
  }

  return (
    <Overlay>
      <Content>
        <CloseButton type="button" onClick={onClose}>
          <X size={24} />
        </CloseButton>

        <h2>Nova Transação</h2>

        <Form onSubmit={handleCreateNewTransaction}>
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />

          <input
            type="number"
            step="0.01"
            placeholder="Preço"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />

          <TransactionTypeGrid>
            <RadioBox
              type="button"
              onClick={() => setTipo('receita')}
              $isActive={tipo === 'receita'}
              $activeColor="green"
            >
              <ArrowUpCircle size={24} color="#00b37e" />
              <span>Entrada</span>
            </RadioBox>

            <RadioBox
              type="button"
              onClick={() => setTipo('despesa')}
              $isActive={tipo === 'despesa'}
              $activeColor="red"
            >
              <ArrowDownCircle size={24} color="#f75a68" />
              <span>Saída</span>
            </RadioBox>
          </TransactionTypeGrid>

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as CategoriaType)}
          >
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button type="submit">Cadastrar</button>
        </Form>
      </Content>
    </Overlay>
  );
}