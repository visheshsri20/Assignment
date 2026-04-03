using System.ComponentModel.DataAnnotations;

namespace AuthApi.Models;

// ── Database entity ────────────────────────────────────────────────────────────
public class User
{
    public int      Id           { get; set; }
    public string   Name         { get; set; } = string.Empty;
    public string   Email        { get; set; } = string.Empty;
    public string   PasswordHash { get; set; } = string.Empty;
    public string   Role         { get; set; } = "User";
    public DateTime CreatedAt    { get; set; } = DateTime.UtcNow;
}

// ── Request DTOs ───────────────────────────────────────────────────────────────
public class RegisterRequest
{
    [Required(ErrorMessage = "Name is required")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
    public string Password { get; set; } = string.Empty;
}

public class LoginRequest
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = string.Empty;

    public bool RememberMe { get; set; } = false;
}

// ── Response DTOs ──────────────────────────────────────────────────────────────
public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public string? IpAddress { get; set; }
}
public class UserProfileResponse
{
    public int      Id        { get; set; }
    public string   Name      { get; set; } = string.Empty;
    public string   Email     { get; set; } = string.Empty;
    public string   Role      { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
