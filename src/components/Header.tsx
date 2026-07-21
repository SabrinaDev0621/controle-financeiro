import styled from 'styled-components';
import { LogOut, DollarSign } from 'lucide-react';
import { supabase } from '../services/supabase';

interface HeaderProps {
  onOpenNewTransactionModal: () => void;
}

const Container = styled.header`
  background: #121214;
  padding: 2.5rem 0 7.5rem;
  border-bottom: 1px solid #29292e;
`;

const Content = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 1rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #00b37e;
    font-size: 1.5rem;
    font-weight: bold;

    span {
      color: #e1e1e6;
    }

    @media (max-width: 480px) {
      font-size: 1.25rem;
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
`;

const NewTransactionButton = styled.button`
  font-size: 1rem;
  color: #fff;
  background: #00875f;
  border: 0;
  padding: 0 1rem;
  border-radius: 6px;
  height: 42px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  @media (max-width: 480px) {
    font-size: 0.875rem;
    padding: 0 0.75rem;
    height: 38px;
  }

  &:hover {
    background: #00b37e;
  }
`;

const SignOutButton = styled.button`
  background: #202024;
  border: 1px solid #29292e;
  color: #c4c4cc;
  height: 42px;
  width: 42px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;

  @media (max-width: 480px) {
    height: 38px;
    width: 38px;
  }

  &:hover {
    border-color: #f75a68;
    color: #f75a68;
  }
`;

export function Header({ onOpenNewTransactionModal }: HeaderProps) {
  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <Container>
      <Content>
        <div className="logo">
          <DollarSign size={28} />
          <span>Finança</span>Control
        </div>

        <div className="actions">
          <NewTransactionButton type="button" onClick={onOpenNewTransactionModal}>
            + Nova Transação
          </NewTransactionButton>

          <SignOutButton type="button" onClick={handleSignOut} title="Sair da conta">
            <LogOut size={18} />
          </SignOutButton>
        </div>
      </Content>
    </Container>
  );
}