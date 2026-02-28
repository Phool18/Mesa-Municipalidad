import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ExpedientesService } from '../../../../core/services/expedientes.service';
import {
  Expediente,
  TipoDoc,
  TipoTramite,
  EstadoExpediente,
} from '../../../../core/models/expediente.model';

/**
 * Validador personalizado: verifica longitud de DNI (8) o RUC (11)
 * según el campo tipoDoc del mismo formulario.
 */
function validarNroDoc(control: AbstractControl): ValidationErrors | null {
  const tipo = control.parent?.get('tipoDoc')?.value as TipoDoc;
  const valor = control.value as string;
  if (!valor) return null;
  if (tipo === 'DNI' && !/^\d{8}$/.test(valor)) return { dniInvalido: true };
  if (tipo === 'RUC' && !/^\d{11}$/.test(valor)) return { rucInvalido: true };
  return null;
}

/** Formulario para crear y editar expedientes */
@Component({
  selector: 'app-expediente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expediente-form.component.html',
  styleUrl: './expediente-form.component.css',
})
export class ExpedienteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ExpedientesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  esEdicion = false;
  editId: number | null = null;
  cargando = signal(false);
  guardando = signal(false);

  readonly tramites: TipoTramite[] = [
    'Licencia de Funcionamiento',
    'Constancia de Posesión',
    'Autorización de Evento Vecinal',
    'Certificado de Inspección Técnica (ITSE)',
    'Solicitud de Copia de Documentos',
    'Solicitud de Certificado de Numeración',
    'Constancia de Residencia',
    'Autorización de Comercio Ambulatorio (Temporal)',
    'Solicitud de Atención de Parques y Jardines',
  ];

  readonly estados: EstadoExpediente[] = ['Recibido', 'En evaluación', 'Aprobado', 'Observado'];

  ngOnInit(): void {
    this.construirFormulario();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.editId = Number(id);
      this.cargarExpediente(this.editId);
    }
  }

  construirFormulario(): void {
    this.form = this.fb.group({
      tipoDoc: ['DNI', Validators.required],
      nroDoc: ['', [Validators.required, validarNroDoc]],
      solicitante: ['', [Validators.required, Validators.minLength(3)]],
      tramite: ['', Validators.required],
      fechaIngreso: [this.hoy(), Validators.required],
      estado: ['Recibido', Validators.required],
      observacion: ['', Validators.maxLength(200)],
    });

    // Al cambiar tipoDoc se revalida nroDoc para aplicar la regla correcta
    this.form.get('tipoDoc')?.valueChanges.subscribe(() => {
      this.form.get('nroDoc')?.updateValueAndValidity();
    });
  }

  private hoy(): string {
    return new Date().toISOString().split('T')[0];
  }

  cargarExpediente(id: number): void {
    this.cargando.set(true);
    this.service.getById(id).subscribe({
      next: (exp) => {
        this.form.patchValue(exp);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  get f() {
    return this.form.controls;
  }

  /** Mensaje de error para el campo nroDoc según el tipo de documento */
  errorNroDoc(): string {
    const e = this.f['nroDoc'].errors;
    if (e?.['required']) return 'El número de documento es obligatorio.';
    if (e?.['dniInvalido']) return 'El DNI debe tener exactamente 8 dígitos.';
    if (e?.['rucInvalido']) return 'El RUC debe tener exactamente 11 dígitos.';
    return '';
  }

  guardar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.guardando.set(true);
    const valores = this.form.value;

    if (this.esEdicion && this.editId) {
      this.service.getById(this.editId).subscribe((existente) => {
        this.service.update(this.editId!, { ...existente, ...valores }).subscribe({
          next: () => this.router.navigate(['/expedientes']),
          error: () => this.guardando.set(false),
        });
      });
    } else {
      this.service.create(valores).subscribe({
        next: () => this.router.navigate(['/expedientes']),
        error: () => this.guardando.set(false),
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/expedientes']);
  }
}
