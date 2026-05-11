import { Categoria } from './categoria.interface';

export interface Produto {
  id: number;
  nome: string;
  categoriaId: Categoria['id'];
  imagem?: string;
}

export type CriarProdutoPayload = Omit<Produto, 'id'>;

export type AtualizarProdutoPayload = Partial<CriarProdutoPayload>;

export type ProdutoCampoBusca = keyof Pick<
  Produto,
  'id' | 'nome' | 'categoriaId'
>;
