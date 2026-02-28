import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExpedientesService } from '../../../../core/services/expedientes.service';
import { Expediente } from '../../../../core/models/expediente.model';

/** Página principal: muestra la tabla de expedientes con búsqueda y acciones CRUD */
@Component({
  selector: 'app-expedientes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expedientes-list.component.html',
  styleUrl: './expedientes-list.component.css',
})
export class ExpedientesListComponent implements OnInit {
  private service = inject(ExpedientesService);
  private router = inject(Router);

  expedientes = signal<Expediente[]>([]);
  loading = signal(false);
  searchTerm = '';
  /** ID del expediente pendiente de confirmación de eliminación */
  deletingId: number | null = null;

  ngOnInit(): void {
    this.cargarExpedientes();
  }

  cargarExpedientes(): void {
    this.loading.set(true);
    this.service.getAll(this.searchTerm || undefined).subscribe({
      next: (data) => {
        this.expedientes.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.cargarExpedientes();
  }

  irANuevo(): void {
    this.router.navigate(['/expedientes/nuevo']);
  }

  irAEditar(id: number): void {
    this.router.navigate(['/expedientes/editar', id]);
  }

  confirmarEliminar(id: number): void {
    this.deletingId = id;
  }

  cancelarEliminar(): void {
    this.deletingId = null;
  }

  eliminar(id: number): void {
    this.service.delete(id).subscribe(() => {
      this.deletingId = null;
      this.cargarExpedientes();
    });
  }

  /** Devuelve la clase CSS del badge según el estado del expediente */
  badgeEstado(estado: string): string {
    const mapa: Record<string, string> = {
      Recibido: 'badge-recibido',
      'En evaluación': 'badge-evaluacion',
      Aprobado: 'badge-aprobado',
      Observado: 'badge-observado',
    };
    return mapa[estado] ?? '';
  }
}
