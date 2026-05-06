using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BookApi;

namespace BookApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BooksController : ControllerBase
{
    private readonly AppDbContext _db;

    public BooksController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var username = User.Identity?.Name;
        var books = _db.Books.Where(b => b.UserId == username).ToList();
        return Ok(books);
    }

    [HttpPost]
    public IActionResult Create([FromBody] Book book)
    {
        book.UserId = User.Identity?.Name ?? "";
        _db.Books.Add(book);
        _db.SaveChanges();
        return Ok(book);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Book updated)
    {
        var book = _db.Books.FirstOrDefault(b => b.Id == id && b.UserId == User.Identity!.Name);
        if (book == null) return NotFound();

        book.Title = updated.Title;
        book.Author = updated.Author;
        book.PublishedDate = updated.PublishedDate;
        _db.SaveChanges();
        return Ok(book);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var book = _db.Books.FirstOrDefault(b => b.Id == id && b.UserId == User.Identity!.Name);
        if (book == null) return NotFound();

        _db.Books.Remove(book);
        _db.SaveChanges();
        return Ok();
    }
}