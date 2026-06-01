import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService } from '../auth.service';
import { CategoriaService } from '../categoria.service';
import { Categoria } from '../interfaces/categoria.interface';
import { CriarProdutoPayload, Produto } from '../interfaces/produto.interface';
import { ProdutoService } from '../produto.service';

type AbaAdmin = 'inicio' | 'produtos' | 'categorias';

type ProdutoForm = {
  id: number | null;
  nome: string;
  categoriaId: number | null;
  imagem: string;
};

type CategoriaForm = {
  id: number | null;
  categoria: string;
};

@Component({
  selector: 'app-gerenciar-produtos',
  imports: [CommonModule, FormsModule],
  templateUrl: './gerenciar-produtos.component.html',
  styleUrl: './gerenciar-produtos.component.css'
})
export class GerenciarProdutosComponent {
  private readonly produtoService = inject(ProdutoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  abaAtiva = signal<AbaAdmin>('inicio');
  carregando = signal(false);
  mensagem = signal('');
  erro = signal('');

  produtos = signal<Produto[]>([]);
  categorias = signal<Categoria[]>([]);

  produtoForm = signal<ProdutoForm>(this.novoProdutoForm());
  categoriaForm = signal<CategoriaForm>(this.novaCategoriaForm());

  produtosRecentes = computed(() =>
    [...this.produtos()]
      .sort((a, b) => b.id - a.id)
      .slice(0, 4)
  );

  produtosPorCategoria = computed(() =>
    this.categorias().map((categoria) => ({
      categoria,
      produtos: this.produtos().filter(
        (produto) => produto.categoriaId === categoria.id
      )
    }))
  );

  produtosSemCategoria = computed(() =>
    this.produtos().filter(
      (produto) =>
        !this.categorias().some((categoria) => categoria.id === produto.categoriaId)
    )
  );

  ngOnInit() {
    this.carregarDados();
  }

  trocarAba(aba: AbaAdmin) {
    this.abaAtiva.set(aba);
    this.limparAvisos();
  }

  sair() {
    this.authService.logout();
    this.router.navigate(['/admin']);
  }

  carregarDados() {
    this.carregando.set(true);
    this.limparAvisos();

    forkJoin({
      produtos: this.produtoService.listarProdutos(),
      categorias: this.categoriaService.listarCategorias()
    }).subscribe({
      next: ({ produtos, categorias }) => {
        this.produtos.set(produtos);
        this.categorias.set(categorias);

        if (!this.produtoForm().categoriaId && categorias.length > 0) {
          this.produtoForm.update((form) => ({
            ...form,
            categoriaId: categorias[0].id
          }));
        }
      },
      error: () => {
        this.erro.set(
          'Nao foi possivel carregar os dados. Verifique se o json-server esta rodando.'
        );
      },
      complete: () => this.carregando.set(false)
    });
  }

  categoriaNome(categoriaId: number) {
    return (
      this.categorias().find((categoria) => categoria.id === categoriaId)
        ?.categoria ?? 'Sem categoria'
    );
  }

  totalProdutosCategoria(categoriaId: number) {
    return this.produtos().filter((produto) => produto.categoriaId === categoriaId)
      .length;
  }

  atualizarProdutoCampo<K extends keyof ProdutoForm>(
    campo: K,
    valor: ProdutoForm[K]
  ) {
    this.produtoForm.update((form) => ({
      ...form,
      [campo]: valor
    }));
  }

  atualizarCategoriaCampo<K extends keyof CategoriaForm>(
    campo: K,
    valor: CategoriaForm[K]
  ) {
    this.categoriaForm.update((form) => ({
      ...form,
      [campo]: valor
    }));
  }

  selecionarImagem(event: Event) {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];

    if (!arquivo) {
      return;
    }

    if (!arquivo.type.startsWith('image/')) {
      this.erro.set('Selecione um arquivo de imagem valido.');
      input.value = '';
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      // O resultado do FileReader ja vem pronto para usar no src da imagem.
      this.atualizarProdutoCampo('imagem', String(leitor.result));
      this.limparAvisos();
    };

    leitor.onerror = () => {
      this.erro.set('Nao foi possivel carregar a imagem selecionada.');
      input.value = '';
    };

    leitor.readAsDataURL(arquivo);
  }

  salvarProduto() {
    const form = this.produtoForm();

    if (!form.nome.trim() || !form.categoriaId) {
      this.erro.set('Informe o nome e a categoria do produto.');
      return;
    }

    if (!form.imagem.trim()) {
      this.erro.set('Selecione uma imagem para o produto.');
      return;
    }

    const payload: CriarProdutoPayload = {
      nome: form.nome.trim(),
      categoriaId: Number(form.categoriaId),
      imagem: form.imagem.trim()
    };

    this.carregando.set(true);
    this.limparAvisos();

    const requisicao = form.id
      ? this.produtoService.editarProduto(form.id, payload)
      : this.produtoService.criarProduto(payload);

    requisicao.subscribe({
      next: () => {
        this.mensagem.set(
          form.id ? 'Produto atualizado com sucesso.' : 'Produto criado com sucesso.'
        );
        this.resetarProdutoForm();
        this.carregarDados();
      },
      error: () => {
        this.erro.set('Nao foi possivel salvar o produto.');
        this.carregando.set(false);
      }
    });
  }

  editarProduto(produto: Produto) {
    this.produtoForm.set({
      id: produto.id,
      nome: produto.nome,
      categoriaId: produto.categoriaId,
      imagem: produto.imagem ?? ''
    });
    this.trocarAba('produtos');
  }

  removerProduto(produto: Produto) {
    const confirmado = window.confirm(`Remover o produto "${produto.nome}"?`);

    if (!confirmado) {
      return;
    }

    this.carregando.set(true);
    this.limparAvisos();

    this.produtoService.removerProduto(produto.id).subscribe({
      next: () => {
        this.mensagem.set('Produto removido com sucesso.');
        this.carregarDados();
      },
      error: () => {
        this.erro.set('Nao foi possivel remover o produto.');
        this.carregando.set(false);
      }
    });
  }

  resetarProdutoForm() {
    const categoriaPadrao = this.categorias()[0]?.id ?? null;
    this.produtoForm.set(this.novoProdutoForm(categoriaPadrao));
  }

  salvarCategoria() {
    const form = this.categoriaForm();
    const nome = form.categoria.trim();

    if (!nome) {
      this.erro.set('Informe o nome da categoria.');
      return;
    }

    this.carregando.set(true);
    this.limparAvisos();

    const requisicao = form.id
      ? this.categoriaService.editarCategoria(form.id, { categoria: nome })
      : this.categoriaService.criarCategoria({ categoria: nome });

    requisicao.subscribe({
      next: () => {
        this.mensagem.set(
          form.id
            ? 'Categoria atualizada com sucesso.'
            : 'Categoria criada com sucesso.'
        );
        this.resetarCategoriaForm();
        this.carregarDados();
      },
      error: () => {
        this.erro.set('Nao foi possivel salvar a categoria.');
        this.carregando.set(false);
      }
    });
  }

  editarCategoria(categoria: Categoria) {
    this.categoriaForm.set({
      id: categoria.id,
      categoria: categoria.categoria
    });
    this.trocarAba('categorias');
  }

  removerCategoria(categoria: Categoria) {
    const produtosVinculados = this.produtos().filter(
      (produto) => produto.categoriaId === categoria.id
    ).length;

    if (produtosVinculados > 0) {
      this.erro.set(
        `A categoria "${categoria.categoria}" possui ${produtosVinculados} produto(s). Remova ou mova os produtos antes.`
      );
      return;
    }

    const confirmado = window.confirm(`Remover a categoria "${categoria.categoria}"?`);

    if (!confirmado) {
      return;
    }

    this.carregando.set(true);
    this.limparAvisos();

    this.categoriaService.removerCategoria(categoria.id).subscribe({
      next: () => {
        this.mensagem.set('Categoria removida com sucesso.');
        this.carregarDados();
      },
      error: () => {
        this.erro.set('Nao foi possivel remover a categoria.');
        this.carregando.set(false);
      }
    });
  }

  resetarCategoriaForm() {
    this.categoriaForm.set(this.novaCategoriaForm());
  }

  private novoProdutoForm(categoriaId: number | null = null): ProdutoForm {
    return {
      id: null,
      nome: '',
      categoriaId,
      imagem: ''
    };
  }

  private novaCategoriaForm(): CategoriaForm {
    return {
      id: null,
      categoria: ''
    };
  }

  private limparAvisos() {
    this.mensagem.set('');
    this.erro.set('');
  }

}
