import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Produto } from '../interfaces/produto.interface';
import { NgFor } from '@angular/common';
import { ProdutoService } from '../produto.service';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-vitrine',
  templateUrl: './vitrine.component.html',
  styleUrls: ['./vitrine.component.css'],
  imports: [NgFor]
})

export class VitrineComponent {
  produtoService = inject(ProdutoService);

  @Input() titulo: string = '';
  @Input() itens: Produto[] = [];
  @Input() categoria: string = '';
  @Input() isExtendido: boolean = false;
  extendeu: boolean = false;

  @Output() verMais = new EventEmitter<void>();

  ngAfterViewInit() {
      this.produtoService.buscarProdutosComLimite(this.categoria, 4).subscribe((produtos) => {

        this.itens = produtos;
      });
  }

  verTudo() {
    this.produtoService.buscarProdutos(this.categoria).subscribe((produtos) => {
      this.itens = produtos;
    });

    this.extendeu = true;
  }

  onVerMais() {
    this.verMais.emit();
  }
}
