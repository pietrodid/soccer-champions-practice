using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoccerPractice.Data;
using SoccerPractice.Models;

namespace SoccerPractice.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LeaguesController : ControllerBase
{
    private readonly AppDbContext _context;

    public LeaguesController(AppDbContext context)
    {
        _context = context;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<League>>> GetAll()
    {
        return await _context.Leagues.ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<League>> GetById(int id)
    {
        var league = await _context.Leagues.FindAsync(id);

        if (league == null)
        {
            return NotFound("League not found.");
        }

        return league;
    }

   
    [HttpPost]
    public async Task<ActionResult<League>> Create(League league)
    {
        league.Name = league.Name.Trim();
        league.Country = league.Country.Trim();

        if (league.Name.Length < 2 || league.Name.Length > 50)
        {
            return BadRequest("Name must be between 2 and 50 characters.");
        }

        if (league.Country.Length < 2 || league.Country.Length > 50)
        {
            return BadRequest("Country must be between 2 and 50 characters.");
        }

        if (league.EndDate < league.StartDate)
        {
            return BadRequest("EndDate cannot be earlier than StartDate.");
        }

        _context.Leagues.Add(league);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = league.Id }, league);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, League league)
    {
        var existing = await _context.Leagues.FindAsync(id);

        if (existing == null)
        {
            return NotFound("League not found.");
        }

        existing.Name = league.Name.Trim();
        existing.Country = league.Country.Trim();
        existing.StartDate = league.StartDate;
        existing.EndDate = league.EndDate;
        existing.Enabled = league.Enabled;

        if (existing.Name.Length < 2 || existing.Name.Length > 50)
        {
            return BadRequest("Name must be between 2 and 50 characters.");
        }

        if (existing.Country.Length < 2 || existing.Country.Length > 50)
        {
            return BadRequest("Country must be between 2 and 50 characters.");
        }

        if (existing.EndDate < existing.StartDate)
        {
            return BadRequest("EndDate cannot be earlier than StartDate.");
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

  
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var league = await _context.Leagues.FindAsync(id);

        if (league == null)
        {
            return NotFound("League not found.");
        }

        var relations = _context.LeagueTeams.Where(lt => lt.LeagueId == id);
        _context.LeagueTeams.RemoveRange(relations);
        _context.Leagues.Remove(league);
        await _context.SaveChangesAsync();

        return NoContent();
    }


    [HttpGet("{leagueId:int}/teams")]
    public async Task<ActionResult<IEnumerable<Team>>> GetTeams(int leagueId)
    {
        var league = await _context.Leagues.FindAsync(leagueId);

        if (league == null)
        {
            return NotFound("League not found.");
        }

        var teams = await _context.LeagueTeams
            .Where(lt => lt.LeagueId == leagueId)
            .Select(lt => lt.Team)
            .ToListAsync();

        return teams;
    }

    [HttpPost("{leagueId:int}/teams/{teamId:int}")]
    public async Task<IActionResult> AddTeam(int leagueId, int teamId)
    {
        var league = await _context.Leagues.FindAsync(leagueId);

        if (league == null)
        {
            return NotFound("League not found.");
        }

        var team = await _context.Teams.FindAsync(teamId);

        if (team == null)
        {
            return NotFound("Team not found.");
        }

        var alreadyExists = await _context.LeagueTeams
            .AnyAsync(lt => lt.LeagueId == leagueId && lt.TeamId == teamId);

        if (alreadyExists)
        {
            return BadRequest("The team is already in this league.");
        }

        _context.LeagueTeams.Add(new LeagueTeam { LeagueId = leagueId, TeamId = teamId });
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{leagueId:int}/teams/{teamId:int}")]
    public async Task<IActionResult> RemoveTeam(int leagueId, int teamId)
    {
        var relation = await _context.LeagueTeams
            .FirstOrDefaultAsync(lt => lt.LeagueId == leagueId && lt.TeamId == teamId);

        if (relation == null)
        {
            return NotFound("The relationship does not exist.");
        }

        _context.LeagueTeams.Remove(relation);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}