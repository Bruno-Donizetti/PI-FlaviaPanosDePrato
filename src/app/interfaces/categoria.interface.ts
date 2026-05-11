export interface Categoria {
  id: number;
  categoria: string;
}

export type CriarCategoriaPayload = Omit<Categoria, 'id'>;

export type AtualizarCategoriaPayload = Partial<CriarCategoriaPayload>;
