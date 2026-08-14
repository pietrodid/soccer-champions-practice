import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LeagueService } from '../../services/league.service';
import { TeamService } from '../../services/team.service';
import { League } from '../../models/league.model';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-league-teams',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './league-teams.component.html',
  styleUrl: './league-teams.component.css'
})
export class LeagueTeamsComponent implements OnInit {
  league?: League;
  teams: Team[] = [];
  allTeams: Team[] = [];
  form: FormGroup;
  message = '';
  isError = false;

  constructor(
    private route: ActivatedRoute,
    private leagueService: LeagueService,
    private teamService: TeamService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      teamId: ['', Validators.required]
    });
  }

  get availableTeams(): Team[] {
    return this.allTeams.filter((team) => !this.teams.some((t) => t.id === team.id));
  }

  ngOnInit(): void {
    const leagueId = this.getLeagueId();

    this.leagueService.getById(leagueId).subscribe({
      next: (league) => {
        this.league = league;
        this.cdr.detectChanges();
      },
      error: () => this.showMessage('Error al procesar la solicitud.', true)
    });

    this.teamService.getAll().subscribe({
      next: (teams) => {
        this.allTeams = teams;
        this.cdr.detectChanges();
      },
      error: () => this.showMessage('Error al procesar la solicitud.', true)
    });

    this.loadTeams(leagueId);
  }

  getLeagueId(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  loadTeams(leagueId: number): void {
    this.leagueService.getTeams(leagueId).subscribe({
      next: (teams) => {
        this.teams = teams;
        this.cdr.detectChanges();
      },
      error: () => this.showMessage('Error al procesar la solicitud.', true)
    });
  }

  addTeam(): void {
    if (this.form.invalid) {
      return;
    }

    const leagueId = this.getLeagueId();
    const teamId = Number(this.form.value.teamId);

    this.leagueService.addTeam(leagueId, teamId).subscribe({
      next: () => {
        this.form.reset();
        this.showMessage('Equipo agregado correctamente.', false);
        this.loadTeams(leagueId);
      },
      error: () => this.showMessage('Error al procesar la solicitud.', true)
    });
  }

  removeTeam(teamId: number): void {
    if (!confirm('¿Está seguro de quitar este equipo de la liga?')) {
      return;
    }

    const leagueId = this.getLeagueId();

    this.leagueService.removeTeam(leagueId, teamId).subscribe({
      next: () => {
        this.showMessage('Equipo quitado correctamente.', false);
        this.loadTeams(leagueId);
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