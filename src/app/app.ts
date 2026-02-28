import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Componente raíz: contiene la barra de navegación y el router-outlet */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly anio = new Date().getFullYear();
}
