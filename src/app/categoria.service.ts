import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Categoria,
  CriarCategoriaPayload,
  AtualizarCategoriaPayload
} from './interfaces/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `http://127.0.0.1:3000/categorias`;

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  buscarCategoriaPorId(id: Categoria['id']): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  criarCategoria(categoria: CriarCategoriaPayload): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  editarCategoria(
    id: Categoria['id'],
    categoria: AtualizarCategoriaPayload
  ): Observable<Categoria> {
    return this.http.patch<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }

  substituirCategoria(
    id: Categoria['id'],
    categoria: CriarCategoriaPayload
  ): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }

  removerCategoria(id: Categoria['id']): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
