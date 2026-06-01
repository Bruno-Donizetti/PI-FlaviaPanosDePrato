import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  router = inject(Router);
  private readonly authService = inject(AuthService);

  usuario = signal('');
  senha = signal('');
  carregando = signal(false);
  senhaVisivel = signal(false);
  erro = signal('');

  ngOnInit() {
    if (this.authService.estaAutenticado()) {
      this.router.navigate(['/gerenciarProdutos']);
    }
  }

  alternarSenha() {
    this.senhaVisivel.update((v) => !v);
  }

  acessar() {
    this.erro.set('');

    if (this.authService.login(this.usuario(), this.senha())) {
      this.router.navigate(['/gerenciarProdutos']);
      return;
    }

    this.erro.set('Usuario ou senha invalidos.');
  }
}
