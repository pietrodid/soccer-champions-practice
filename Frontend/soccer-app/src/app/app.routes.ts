import { Routes } from '@angular/router';
import { LeaguesComponent } from './pages/leagues/leagues.component';
import { LeagueFormComponent } from './pages/leagues/league-form.component';
import { LeagueTeamsComponent } from './pages/leagues/league-teams.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { TeamFormComponent } from './pages/teams/team-form.component';
import { TeamLeaguesComponent } from './pages/teams/team-leagues.component';

export const routes: Routes = [
  { path: '', redirectTo: '/leagues', pathMatch: 'full' },
  { path: 'leagues', component: LeaguesComponent },
  { path: 'leagues/new', component: LeagueFormComponent },
  { path: 'leagues/edit/:id', component: LeagueFormComponent },
  { path: 'leagues/:id/teams', component: LeagueTeamsComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'teams/new', component: TeamFormComponent },
  { path: 'teams/edit/:id', component: TeamFormComponent },
  { path: 'teams/:id/leagues', component: TeamLeaguesComponent },
  { path: '**', redirectTo: '/leagues' }
];