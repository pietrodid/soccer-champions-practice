using Microsoft.EntityFrameworkCore;
using SoccerPractice.Models;

namespace SoccerPractice.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<League> Leagues => Set<League>();
    public DbSet<Team> Teams => Set<Team>();
    public DbSet<LeagueTeam> LeagueTeams => Set<LeagueTeam>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // El script SQL 
        modelBuilder.Entity<League>().ToTable("League");
        modelBuilder.Entity<Team>().ToTable("Team");

        modelBuilder.Entity<LeagueTeam>()
            .ToTable("LeagueTeam")
            .HasKey(lt => new { lt.LeagueId, lt.TeamId });

        modelBuilder.Entity<League>()
            .HasMany(l => l.LeagueTeams)
            .WithOne(lt => lt.League)
            .HasForeignKey(lt => lt.LeagueId);

        modelBuilder.Entity<Team>()
            .HasMany(t => t.LeagueTeams)
            .WithOne(lt => lt.Team)
            .HasForeignKey(lt => lt.TeamId);
    }
}