import { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../services/supabase';
import { DollarSign } from 'lucide-react';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #121214;
`;

const Box = styled.div`
  background: #202024;
  padding: 3rem 2.5rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #00b37e;
    font-size: 1.75rem;
    font-weight: bold;
    margin-bottom: 2rem;

    span {
      color: #e1e1e6;
    }
  }

  h2 {
    color: #e1e1e6;
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
  }
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input {
    width: 100%;
    padding: 1rem;
    border-radius: 6px;
    border: 0;
    background: #121214;
    color: #e1e1e6;
    font-size: 1rem;

    &::placeholder {
      color: #7c7c8a;
    }
  }

  button {
    height: 50px;
    border: 0;
    background: #00875f;
    color: #fff;
    font-weight: bold;
    padding: 0 1.25rem;
    border-radius: 6px;
    margin-top: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;

    &:hover {
      background: #00b37e;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

const ToggleText = styled.p`
  margin-top: 1.5rem;
  color: #8d8d99;
  font-size: 0.875rem;

  button {
    background: transparent;
    border: 0;
    color: #00b37e;
    font-weight: bold;
    cursor: pointer;
    margin-left: 0.5rem;
    text-decoration: underline;

    &:hover {
      color: #00875f;
    }
  }
`;

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  // Limpa as senhas ao alternar entre Login e Cadastro
  function handleToggleMode() {
    setIsSignUp(!isSignUp);
    setPassword('');
    setConfirmPassword('');
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();

    // Validação de confirmação de senha apenas no cadastro
    if (isSignUp) {
      if (password !== confirmPassword) {
        alert('As senhas não coincidem. Por favor, verifique e tente novamente.');
        return;
      }

      if (password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Cadastro realizado com sucesso! Você já pode acessar sua conta.');
        setIsSignUp(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      alert(error.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Box>
        <div className="logo">
          <DollarSign size={32} />
          <span>Finança</span>Control
        </div>

        <h2>{isSignUp ? 'Crie sua conta' : 'Acesse sua conta'}</h2>

        <Form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Campo renderizado apenas no modo de Cadastro */}
          {isSignUp && (
            <input
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Aguarde...' : isSignUp ? 'Cadastrar' : 'Entrar'}
          </button>
        </Form>

        <ToggleText>
          {isSignUp ? 'Já tem conta?' : 'Não tem conta?'}
          <button type="button" onClick={handleToggleMode}>
            {isSignUp ? 'Faça Login' : 'Cadastre-se'}
          </button>
        </ToggleText>
      </Box>
    </Container>
  );
}