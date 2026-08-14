import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LeagueService } from '../../services/league.service';
import { League } from '../../models/league.model';

@Component({
  selector: 'app-league-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './league-form.component.html',
  styleUrl: './league-form.component.css'
})
export class LeagueFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  leagueId?: number;
  message = '';
  isError = false;

  constructor(
    private fb: FormBuilder,
    private leagueService: LeagueService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      country: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      startDate: [this.toDateInputValue(new Date()), Validators.required],
      endDate: [this.toDateInputValue(new Date()), Validators.required],
      enabled: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.leagueId = Number(id);

      this.leagueService.getById(this.leagueId).subscribe({
        next: (league) => {
          this.form.patchValue({
            name: league.name,
            country: league.country,
            startDate: this.toDateInputValue(league.startDate),
            endDate: this.toDateInputValue(league.endDate),
            enabled: league.enabled
          });
          this.cdr.detectChanges();
        },
        error: () => this.showMessage('Error al procesar la solicitud.', true)
      });
    }
  }

  toDateInputValue(date: string | Date): string {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  datesValid(): boolean {
    return this.form.value.endDate >= this.form.value.startDate;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.showMessage('Revise los campos del formulario.', true);
      return;
    }

    if (!this.datesValid()) {
      this.showMessage('La fecha de fin no puede ser anterior a la fecha de inicio.', true);
      return;
    }

    const league: League = this.form.value;

    if (this.isEdit && this.leagueId) {
      this.leagueService.update(this.leagueId, league).subscribe({
        next: () => {
          this.router.navigate(['/leagues'], {
            state: { message: 'Liga actualizada correctamente.' }
          });
        },
        error: () => this.showMessage('Error al procesar la solicitud.', true)
      });
    } else {
      this.leagueService.create(league).subscribe({
        next: () => {
          this.router.navigate(['/leagues'], {
            state: { message: 'Liga creada correctamente.' }
          });
        },
        error: () => this.showMessage('Error al procesar la solicitud.', true)
      });
    }
  }

  private showMessage(text: string, isError: boolean): void {
    this.message = text;
    this.isError = isError;
    this.cdr.detectChanges();
  }
}