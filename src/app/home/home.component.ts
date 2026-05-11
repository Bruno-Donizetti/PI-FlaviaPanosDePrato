import { Component, inject } from '@angular/core';
import { VitrineComponent } from "../vitrine/vitrine.component";
import { ContatoComponent } from "../contato/contato.component";
import { Router } from '@angular/router';
import { MenuComponent } from "../componentes/menu/menu.component";
import { HeaderComponent } from "../componentes/header/header.component";

@Component({
  selector: 'app-home',
  imports: [VitrineComponent, ContatoComponent, MenuComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private router = inject(Router);

  verMais(){
    this.router.navigate(['/trabalhos'])
  }
}
