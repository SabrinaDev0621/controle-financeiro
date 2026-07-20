export type CategoriaType = 
  | 'Mercado' 
  | 'Aluguel & Moradia' 
  | 'Contas' 
  | 'Salário' 
  | 'Transporte' 
  | 'Lazer' 
  | 'Saúde' 
  | 'Outros';

export interface Transaction {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: CategoriaType;
  data: string;
}

export const CATEGORIAS: CategoriaType[] = [
  'Mercado',
  'Aluguel & Moradia',
  'Contas',
  'Salário',
  'Transporte',
  'Lazer',
  'Saúde',
  'Outros',
];