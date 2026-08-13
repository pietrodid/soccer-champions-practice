namespace SoccerPractice.Models;

public class LeagueTeam
{
    public int LeagueId { get; set; }
    public League League { get; set; } = null!;

    public int TeamId { get; set; }
    public Team Team { get; set; } = null!;
}