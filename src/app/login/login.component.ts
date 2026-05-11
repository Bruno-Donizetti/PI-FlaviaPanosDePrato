import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  router = inject(Router);
  usuario = signal('');
  senha = signal('');
  carregando = signal(false);
  senhaVisivel = signal(false);
  erro = signal('');

  alternarSenha() {
    this.senhaVisivel.update((v) => !v);
  }

  acessar() {
    this.router.navigate(['/gerenciarProdutos'])
  }
}