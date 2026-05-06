using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BookApi;

namespace BookApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly string _jwtKey = "superHemligNyckel1234567890ABCDEF";

    public AdminController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] AuthRequest request)
    {
        var user = _db.Users.FirstOrDefault(u => u.Username == request.Username && u.IsAdmin);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized("Fel uppgifter eller inte admin.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            claims: new[] {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, "Admin")
            },
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds
        );
        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
    }

    [HttpGet("users")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetUsers()
    {
        var users = _db.Users.Select(u => new {
            u.Id,
            u.Username,
            u.IsAdmin
        }).ToList();
        return Ok(users);
    }

    [HttpDelete("users/{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteUser(int id)
    {
        var user = _db.Users.FirstOrDefault(u => u.Id == id);
        if (user == null) return NotFound();
        if (user.IsAdmin) return BadRequest("Kan inte radera admin.");

        _db.Users.Remove(user);
        _db.SaveChanges();
        return Ok("Användare raderad.");
    }

    [HttpPost("users/{id}/reset-password")]
    [Authorize(Roles = "Admin")]
    public IActionResult ResetPassword(int id, [FromBody] ResetPasswordRequest request)
    {
        var user = _db.Users.FirstOrDefault(u => u.Id == id);
        if (user == null) return NotFound();

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        _db.SaveChanges();
        return Ok("Lösenord återställt.");
    }

    [HttpPost("create-admin")]
    public IActionResult CreateAdmin([FromBody] AuthRequest request)
    {
        if (_db.Users.Any(u => u.IsAdmin))
            return BadRequest("Admin finns redan.");

        var admin = new User
        {
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            IsAdmin = true
        };
        _db.Users.Add(admin);
        _db.SaveChanges();
        return Ok("Admin skapad!");
    }
}

public class ResetPasswordRequest
{
    public string NewPassword { get; set; } = "";
}