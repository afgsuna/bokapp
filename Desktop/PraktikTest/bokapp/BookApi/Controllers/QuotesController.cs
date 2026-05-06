using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BookApi;

namespace BookApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class QuotesController : ControllerBase
{
    private readonly AppDbContext _db;

    public QuotesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var username = User.Identity?.Name;
        var quotes = _db.Quotes.Where(q => q.UserId == username).ToList();
        return Ok(quotes);
    }

    [HttpPost]
    public IActionResult Create([FromBody] Quote quote)
    {
        quote.UserId = User.Identity?.Name ?? "";
        _db.Quotes.Add(quote);
        _db.SaveChanges();
        return Ok(quote);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Quote updated)
    {
        var quote = _db.Quotes.FirstOrDefault(q => q.Id == id && q.UserId == User.Identity!.Name);
        if (quote == null) return NotFound();

        quote.Text = updated.Text;
        quote.Author = updated.Author;
        _db.SaveChanges();
        return Ok(quote);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var quote = _db.Quotes.FirstOrDefault(q => q.Id == id && q.UserId == User.Identity!.Name);
        if (quote == null) return NotFound();

        _db.Quotes.Remove(quote);
        _db.SaveChanges();
        return Ok();
    }
}