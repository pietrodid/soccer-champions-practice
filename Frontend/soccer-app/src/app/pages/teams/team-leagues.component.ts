import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { LeagueService } from '../../services/league.service';
import { Team } from '../../models/team.model';
import { League } from '../../models/league.model';

@Component({
  selector: 'app-team-leagues',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './team-leagues.component.html',
  styleUrl: './team-leagues.component.css'
})
export class TeamLeaguesComponent implements OnInit {
  team?: Team;
  leagues: League[] = [];
  allLeagues: League[] = [];
  form: FormGroup;
  message = '';
  isError = false;

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private leagueService: LeagueService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      leagueId: ['', Validators.required]
    });
  }

  get availableLeagues(): League[] {
    return this.allLeagues.filter((league) => !this.leagues.some((l) => l.id === league.id));
  }

  ngOnInit(): void {
    const teamId = this.getTeamId();

    this.teamService.getById(teamId).subscribe({
      next: (team) => {
        this.team = team;
        this.cdr.detectChanges();
      },
      error: () => this.showMessage('Error al procesar la solicitud.', true)
    });

    this.leagueService.getAll().subscribe({
      next: (leagues) => {
        this.allLeagues = leagues;
        this.cdr.detectChanges();
      },
      error: () => this.showMessage('Error al procesar la solicitud.', true)
    });

    this.loadLeagues(teamId);
  }

  getTeamId(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  loadLeagues(teamId: number): void {
    this.teamService.getLeagues(teamId).subscribe({
      next: (leagues) => {
        this.leagues = leagues;
        this.cdr.detectChanges();
      },
      error: () => this.showMessage('Error al procesar la solicitud.', true)
    });
  }

  addLeague(): void {
    if (this.form.invalid) {
      return;
    }

    const teamId = this.getTeamId();
    const leagueId = Number(this.form.value.leagueId);

    this.leagueService.addTeam(leagueId, teamId).subscribe({
      next: () => {
        this.form.reset();
        this.showMessage('Liga agregada correctamente.', false);
        this.loadLeagues(teamId);
      },
      error: () => this.showMessage('Error al procesar la solicitud.', true)
    });
  }

  removeLeague(leagueId: number): void {
    if (!confirm('¿Está seguro de quitar esta liga del equipo?')) {
      return;
    }

    const teamId = this.getTeamId();

    this.leagueService.removeTeam(leagueId, teamId).subscribe({
      next: () => {
        this.showMessage('Liga quitada correctamente.', false);
        this.loadLeagues(teamId);
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