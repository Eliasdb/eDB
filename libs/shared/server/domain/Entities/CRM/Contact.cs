using System;
using System.Collections.Generic;

namespace EDb.Domain.Entities.CRM;

/// <summary>
/// A single person linked to a company (CRM contact).
/// </summary>
public class Contact
{
    public Guid Id { get; set; }

    /* ── Basic info ───────────────────────────────────────────── */
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string? Email { get; set; }
    public string? Phone { get; set; }

    /* ── CRM status (enum below) ──────────────────────────────── */
    public ContactStatus Status { get; set; } = ContactStatus.Lead;

    /* ── FK & navigation ──────────────────────────────────────── */
    public Guid CompanyId { get; set; }
    public Company? Company { get; set; }

    /* ── Audit fields (optional) ──────────────────────────────── */
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// Simple pipeline status – extend as you grow.
/// </summary>
public enum ContactStatus
{
    Lead,
    Prospect,
    Customer,
    Inactive,
}
