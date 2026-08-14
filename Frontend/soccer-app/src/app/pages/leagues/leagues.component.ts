import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LeagueService } from '../../services/league.service';
import { League } from '../../models/league.model';

@Component({
  selector: 'app-leagues',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './leagues.component.html',
  styleUrl: './leagues.component.css'
})
export class LeaguesComponent implements OnInit {
  leagues: League[] = [];
  message = '';
  isError = false;

  constructor(
    private leagueService: LeagueService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.message = history.state?.message ?? '';
    this.isError = history.state?.isError ?? false;
    this.loadLeagues();
  }

  loadLeagues(): void {
    this.leagueService.getAll().subscribe({
      next: (data) => {
        this.leagues = data;
        this.cdr.detectChanges();
      },
      error: () => this.showMessage('Error al procesar la solicitud.', true)
    });
  }

  deleteLeague(id: number): void {
    if (!confirm('¿Está seguro de eliminar este registro?')) {
      return;
    }

    this.leagueService.delete(id).subscribe({
      next: () => {
        this.showMessage('Liga eliminada correctamente.', false);
        this.loadLeagues();
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