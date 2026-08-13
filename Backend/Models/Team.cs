using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SoccerPractice.Models;

public class Team
{
    public int Id { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string Country { get; set; } = string.Empty;

    [Required]
    [Range(11, 22)]
    public int PlayersQuantity { get; set; }

    public bool Enabled { get; set; } = true;

    [JsonIgnore]
    public ICollection<LeagueTeam> LeagueTeams { get; set; } = new List<LeagueTeam>();
}