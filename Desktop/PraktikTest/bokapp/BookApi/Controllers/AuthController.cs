using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BookApi;

namespace BookApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly string _jwtKey = "superHemligNyckel1234567890ABCDEF";

    public AuthController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("register")]
public IActionResult Register([FromBody] AuthRequest request)
{
    if (_db.Users.Any(u => u.Username == request.Username))
        return BadRequest("Användaren finns redan.");

    var user = new User
    {
        Username = request.Username,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
    };

    _db.Users.Add(user);
    _db.SaveChanges();

    // Lägg till 5 standardcitat
    var defaultQuotes = new List<Quote>
    {
        new Quote { Text = "Det enda sättet att göra ett bra arbete är att älska det du gör.", Author = "Steve Jobs", UserId = request.Username },
        new Quote { Text = "I början av varje resa finns ett enkelt val: att börja.", Author = "Mark Twain", UserId = request.Username },
        new Quote { Text = "Livet är vad som händer när du är upptagen med att göra andra planer.", Author = "John Lennon", UserId = request.Username },
        new Quote { Text = "Det är inte längden på livet, utan djupet av livet som räknas.", Author = "Ralph Waldo Emerson", UserId = request.Username },
        new Quote { Text = "Du missar 100% av de skotten du inte tar.", Author = "Wayne Gretzky", UserId = request.Username }
    };

    _db.Quotes.AddRange(defaultQuotes);
    _db.SaveChanges();

    return Ok("Registrering lyckades!");
}

    [HttpPost("login")]
    public IActionResult Login([FromBody] AuthRequest request)
    {
        var user = _db.Users.FirstOrDefault(u => u.Username == request.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized("Fel användarnamn eller lösenord.");

        var token = GenerateToken(user.Username);
        return Ok(new { token });
    }

    private string GenerateToken(string username)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            claims: new[] { new Claim(ClaimTypes.Name, username) },
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class AuthRequest
{
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
}
