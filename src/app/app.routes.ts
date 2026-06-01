import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TrabalhosComponent } from './trabalhos/trabalhos.component';
import { LoginComponent } from './login/login.component';
import { GerenciarProdutosComponent } from './gerenciar-produtos/gerenciar-produtos.component';
import { adminGuard } from './auth.service';

export const routes: Routes = [
    {path: 'trabalhos', component: TrabalhosComponent},
    {path: 'admin', component: LoginComponent},
    {path: 'gerenciarProdutos', component: GerenciarProdutosComponent, canActivate: [adminGuard]},
    {path: '**', component: HomeComponent}
];
