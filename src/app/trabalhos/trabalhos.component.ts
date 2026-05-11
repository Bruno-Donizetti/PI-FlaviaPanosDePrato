import { Component } from '@angular/core';
import { VitrineComponent } from "../vitrine/vitrine.component";

@Component({
  selector: 'app-trabalhos',
  imports: [VitrineComponent],
  templateUrl: './trabalhos.component.html',
  styleUrl: './trabalhos.component.css'
})
export class TrabalhosComponent {

  
verMais() {
  console.log('clicou em ver mais');
}
}
