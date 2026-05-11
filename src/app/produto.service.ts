import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Produto,
  CriarProdutoPayload,
  AtualizarProdutoPayload,
  ProdutoCampoBusca
} from './interfaces/produto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `http://127.0.0.1:3000/produtos`;

  listarProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  buscarProdutoPorId(id: Produto['id']): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  criarProduto(produto: CriarProdutoPayload): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  editarProduto(
    id: Produto['id'],
    produto: AtualizarProdutoPayload
  ): Observable<Produto> {
    return this.http.patch<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  substituirProduto(
    id: Produto['id'],
    produto: CriarProdutoPayload
  ): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  buscarProdutos<K extends ProdutoCampoBusca>(
    categoria: string
  ): Observable<Produto[]> {
    const params = new HttpParams().set('categoriaId', String(categoria));

    return this.http.get<Produto[]>(this.apiUrl, { params });
  }

  buscarProdutosComLimite(
    categoria: string,
    limite: number
  ): Observable<Produto[]> {
    const params = new HttpParams()
      .set('categoriaId', categoria)
      .set('_limit', String(limite));

    return this.http.get<Produto[]>(this.apiUrl, { params });
  }

  removerProduto(id: Produto['id']): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
