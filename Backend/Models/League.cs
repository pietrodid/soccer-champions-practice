using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SoccerPractice.Models;

public class League
{
    public int Id { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string Country { get; set; } = string.Empty;

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    public bool Enabled { get; set; } = true;

    [JsonIgnore]
    public ICollection<LeagueTeam> LeagueTeams { get; set; } = new List<LeagueTeam>();
}