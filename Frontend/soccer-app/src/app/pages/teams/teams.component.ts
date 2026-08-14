import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css'
})
export class TeamsComponent implements OnInit {
  teams: Team[] = [];
  message = '';
  isError = false;

  constructor(
    private teamService: TeamService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.message = history.state?.message ?? '';
    this.isError = history.state?.isError ?? false;
    this.loadTeams();
  }

  loadTeams(): void {
    this.teamService.getAll().subscribe({
      next: (data) => {
        this.teams = data;
        this.cdr.detectChanges();
      },
      error: () => this.showMessage('Error al procesar la solicitud.', true)
    });
  }

  deleteTeam(id: number): void {
    if (!confirm('¿Está seguro de eliminar este registro?')) {
      return;
    }

    this.teamService.delete(id).subscribe({
      next: () => {
        this.showMessage('Equipo eliminado correctamente.', false);
        this.loadTeams();
      },
      error: () => this.showMessage('Error al procesar la solicitud.', true)
    });
  }

  private showMessage(text: string, isError: boolean): void {
    this.message = text;
    this.isError = isError;
    this.cdr.detectChanges();
  }
}