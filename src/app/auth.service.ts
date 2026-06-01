import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly chaveSessao = 'flavia-panos-admin-logado';
  private readonly usuarioAdmin = 'admin';
  private readonly senhaAdmin = 'admin';

  login(usuario: string, senha: string) {
    const credenciaisValidas =
      usuario.trim() === this.usuarioAdmin && senha === this.senhaAdmin;

    if (credenciaisValidas) {
      // Guarda apenas a sessao local, nao a senha.
      localStorage.setItem(this.chaveSessao, 'true');
    }

    return credenciaisValidas;
  }

  logout() {
    localStorage.removeItem(this.chaveSessao);
  }

  estaAutenticado() {
    return localStorage.getItem(this.chaveSessao) === 'true';
  }
}

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    return true;
  }

  return router.createUrlTree(['/admin']);
};
