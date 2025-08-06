using EDb.Domain.Entities;
using EDb.FeatureCrm.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace EDb.FeatureCrm.Controllers;

[ApiController]
[Route("api/crm/companies")]
public class CompanyController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<CompanyDto>> GetAll()
    {
        // TODO: Replace with real service/repository call
        var companies = new List<CompanyDto>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Name = "TestCorp",
                VatNumber = "BE123456789",
                Website = "https://test.com",
            },
        };

        return Ok(companies);
    }

    [HttpPost]
    public ActionResult<CompanyDto> Create(CompanyDto dto)
    {
        // TODO: Persist and return saved company
        dto.Id = Guid.NewGuid();
        return CreatedAtAction(nameof(GetAll), new { id = dto.Id }, dto);
    }
}
