import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TrabalhosComponent } from './trabalhos/trabalhos.component';
import { LoginComponent } from './login/login.component';
import { GerenciarProdutosComponent } from './gerenciar-produtos/gerenciar-produtos.component';

export const routes: Routes = [
    {path: 'trabalhos', component: TrabalhosComponent},
    {path: 'admin', component: LoginComponent},
    {path: 'gerenciarProdutos', component: GerenciarProdutosComponent},
    {path: '**', component: HomeComponent}
];
