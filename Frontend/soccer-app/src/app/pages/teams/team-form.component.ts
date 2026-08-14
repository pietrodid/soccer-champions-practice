import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.css'
})
export class TeamFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  teamId?: number;
  message = '';
  isError = false;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      country: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      playersQuantity: [11, [Validators.required, Validators.min(11), Validators.max(22)]],
      enabled: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.teamId = Number(id);

      this.teamService.getById(this.teamId).subscribe({
        next: (team) => {
          this.form.patchValue({
            name: team.name,
            country: team.country,
            playersQuantity: team.playersQuantity,
            enabled: team.enabled
          });
        },
        error: () => this.showMessage('Error al procesar la solicitud.', true)
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.showMessage('Revise los campos del formulario.', true);
      return;
    }

    const team: Team = this.form.value;

    if (this.isEdit && this.teamId) {
      this.teamService.update(this.teamId, team).subscribe({
        next: () => {
          this.router.navigate(['/teams'], {
            state: { message: 'Equipo actualizado correctamente.' }
          });
        },
        error: () => this.showMessage('Error al procesar la solicitud.', true)
      });
    } else {
      this.teamService.create(team).subscribe({
        next: () => {
          this.router.navigate(['/teams'], {
            state: { message: 'Equipo creado correctamente.' }
          });
        },
        error: () => this.showMessage('Error al procesar la solicitud.', true)
      });
    }
  }

  private showMessage(text: string, isError: boolean): void {
    this.message = text;
    this.isError = isError;
  }
}