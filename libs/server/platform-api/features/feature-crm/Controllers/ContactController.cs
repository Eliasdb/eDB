using EDb.Domain.Entities;
using EDb.FeatureCrm.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace EDb.FeatureCrm.Controllers;

[ApiController]
[Route("api/crm/contacts")]
public class ContactController : ControllerBase
{
    // ─────────────────────────────────────────────────────────────
    // TODO: Inject your DbContext / service here
    // private readonly CrmDbContext _ctx;
    // public ContactController(CrmDbContext ctx) => _ctx = ctx;
    // ─────────────────────────────────────────────────────────────

    /* GET: /api/crm/contacts */
    [HttpGet]
    public ActionResult<IEnumerable<ContactDto>> GetAll()
    {
        // TODO: Replace with real service/repository call
        var contacts = new List<ContactDto>
        {
            new()
            {
                Id = Guid.NewGuid(),
                FirstName = "Kristin",
                LastName = "Watson",
                Email = "kristin.watson@example.com",
                Phone = "+1-555-0123",
                CompanyId = Guid.NewGuid(),
                CompanyName = "Acme Inc.",
                Status = "Lead",
            },
        };

        return Ok(contacts);
    }

    /* GET: /api/crm/contacts/{id} */
    [HttpGet("{id:guid}")]
    public ActionResult<ContactDto> GetById(Guid id)
    {
        // TODO: Fetch from DB
        var dto = new ContactDto
        {
            Id = id,
            FirstName = "Placeholder",
            LastName = "Contact",
            CompanyId = Guid.NewGuid(),
            CompanyName = "Demo Corp",
            Status = "Prospect",
        };

        return Ok(dto);
    }

    /* POST: /api/crm/contacts */
    [HttpPost]
    public ActionResult<ContactDto> Create(ContactDto dto)
    {
        // TODO: Persist to DB & map back to DTO
        dto.Id = Guid.NewGuid();
        return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
    }

    /* PUT: /api/crm/contacts/{id} */
    [HttpPut("{id:guid}")]
    public IActionResult Update(Guid id, ContactDto dto)
    {
        if (id != dto.Id)
            return BadRequest("ID mismatch.");

        // TODO: Update entity in DB

        return NoContent();
    }

    /* DELETE: /api/crm/contacts/{id} */
    [HttpDelete("{id:guid}")]
    public IActionResult Delete(Guid id)
    {
        // TODO: Delete from DB
        return NoContent();
    }
}
