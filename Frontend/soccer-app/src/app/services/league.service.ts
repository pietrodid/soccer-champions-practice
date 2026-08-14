import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { League } from '../models/league.model';
import { Team } from '../models/team.model';

@Injectable({ providedIn: 'root' })
export class LeagueService {
  private apiUrl = 'http://localhost:5000/api/leagues';

  constructor(private http: HttpClient) {}

  getAll(): Observable<League[]> {
    return this.http.get<League[]>(this.apiUrl);
  }

  getById(id: number): Observable<League> {
    return this.http.get<League>(`${this.apiUrl}/${id}`);
  }

  create(league: League): Observable<League> {
    return this.http.post<League>(this.apiUrl, league);
  }

  update(id: number, league: League): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, league);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTeams(leagueId: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/${leagueId}/teams`);
  }

  addTeam(leagueId: number, teamId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${leagueId}/teams/${teamId}`, null);
  }

  removeTeam(leagueId: number, teamId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${leagueId}/teams/${teamId}`);
  }
}