import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Expediente } from '../models/expediente.model';

/**
 * Servicio CRUD para expedientes.
 * Se comunica con JSON Server en http://localhost:3000/expedientes
 */
@Injectable({ providedIn: 'root' })
export class ExpedientesService {
  private readonly API = 'http://localhost:3000/expedientes';
  private http = inject(HttpClient);

  /** Retorna todos los expedientes, con filtro opcional por texto */
  getAll(search?: string): Observable<Expediente[]> {
    return this.http.get<Expediente[]>(this.API).pipe(
      map((items) => {
        if (!search) return items;
        const s = search.toLowerCase();
        return items.filter(
          (e) =>
            e.codigo.toLowerCase().includes(s) ||
            e.nroDoc.includes(s) ||
            e.solicitante.toLowerCase().includes(s),
        );
      }),
    );
  }

  getById(id: number): Observable<Expediente> {
    return this.http.get<Expediente>(`${this.API}/${id}`);
  }

  /**
   * Crea un expediente generando automáticamente el código E-YYYY-NNNN.
   * Consulta el último registro para determinar el correlativo.
   */
  create(data: Omit<Expediente, 'id' | 'codigo'>): Observable<Expediente> {
    return this.generarCodigo().pipe(
      switchMap((codigo) => this.http.post<Expediente>(this.API, { ...data, codigo })),
    );
  }

  update(id: number, data: Expediente): Observable<Expediente> {
    return this.http.put<Expediente>(`${this.API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  /** Genera el código correlativo E-YYYY-NNNN consultando el último expediente */
  private generarCodigo(): Observable<string> {
    const params = new HttpParams()
      .set('_sort', 'id')
      .set('_order', 'desc')
      .set('_limit', '1');

    return this.http.get<Expediente[]>(this.API, { params }).pipe(
      map((items) => {
        const anio = new Date().getFullYear();
        if (!items.length) return `E-${anio}-0001`;
        const [, lastAnio, lastNum] = items[0].codigo.split('-');
        if (Number(lastAnio) === anio) {
          return `E-${anio}-${String(Number(lastNum) + 1).padStart(4, '0')}`;
        }
        return `E-${anio}-0001`;
      }),
    );
  }
}
