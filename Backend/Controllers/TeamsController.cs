using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoccerPractice.Data;
using SoccerPractice.Models;

namespace SoccerPractice.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TeamsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TeamsController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/teams
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Team>>> GetAll()
    {
        return await _context.Teams.ToListAsync();
    }

    // GET /api/teams/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Team>> GetById(int id)
    {
        var team = await _context.Teams.FindAsync(id);

        if (team == null)
        {
            return NotFound("Team not found.");
        }

        return team;
    }

    // POST /api/teams
    [HttpPost]
    public async Task<ActionResult<Team>> Create(Team team)
    {
        team.Name = team.Name.Trim();
        team.Country = team.Country.Trim();

        if (team.Name.Length < 2 || team.Name.Length > 50)
        {
            return BadRequest("El nombre del equipo debe tener entre 2 y 50 caracteres.");
        }

        if (team.Country.Length < 2 || team.Country.Length > 50)
        {
            return BadRequest("El país debe tener entre 2 y 50 caracteres.");
        }

        if (team.PlayersQuantity < 11 || team.PlayersQuantity > 22)
        {
            return BadRequest("La cantidad de jugadores debe estar entre 11 y 22.");
        }

        _context.Teams.Add(team);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = team.Id }, team);
    }

    // PUT /api/teams/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Team team)
    {
        var existing = await _context.Teams.FindAsync(id);

        if (existing == null)
        {
            return NotFound("Team not found.");
        }

        existing.Name = team.Name.Trim();
        existing.Country = team.Country.Trim();
        existing.PlayersQuantity = team.PlayersQuantity;
        existing.Enabled = team.Enabled;

        if (existing.Name.Length < 2 || existing.Name.Length > 50)
        {
            return BadRequest("El nombre del equipo debe tener entre 2 y 50 caracteres.");
        }

        if (existing.Country.Length < 2 || existing.Country.Length > 50)
        {
            return BadRequest("El país debe tener entre 2 y 50 caracteres.");
        }

        if (existing.PlayersQuantity < 11 || existing.PlayersQuantity > 22)
        {
            return BadRequest("La cantidad de jugadores debe estar entre 11 y 22.");
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE /api/teams/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var team = await _context.Teams.FindAsync(id);

        if (team == null)
        {
            return NotFound("Team not found.");
        }

        var relations = _context.LeagueTeams.Where(lt => lt.TeamId == id);
        _context.LeagueTeams.RemoveRange(relations);
        _context.Teams.Remove(team);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET /api/teams/{teamId}/leagues
    [HttpGet("{teamId:int}/leagues")]
    public async Task<ActionResult<IEnumerable<League>>> GetLeagues(int teamId)
    {
        var team = await _context.Teams.FindAsync(teamId);

        if (team == null)
        {
            return NotFound("Team not found.");
        }

        var leagues = await _context.LeagueTeams
            .Where(lt => lt.TeamId == teamId)
            .Select(lt => lt.League)
            .ToListAsync();

        return leagues;
    }
}