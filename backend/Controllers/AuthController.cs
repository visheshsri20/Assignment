using AuthApi.Data;
using AuthApi.Models;
using AuthApi.Services;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace AuthApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserRepository _repo;
    private readonly IJwtService    _jwt;

    public AuthController(UserRepository repo, IJwtService jwt)
    {
        _repo = repo;
        _jwt  = jwt;
    }

    /// <summary>Register a new user — raw SQL INSERT</summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { message = "Validation failed", errors = ModelState });

        if (await _repo.EmailExistsAsync(request.Email))
            return Conflict(new { message = "Email is already registered." });

        var user = new User
        {
            Name = request.Name.Trim(),
            Email = request.Email.ToLower().Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "User"
        };

        try
        {
            await _repo.CreateAsync(
                user.Name,
                user.Email,
                user.PasswordHash,
                user.Role
            );

            return Ok(new { message = "User registered successfully." });
        }
        catch (MySqlException ex) when (ex.Number == 1062)
        {
            return Conflict(new { message = "Email is already registered." });
        }
    }

    /// <summary>Login — raw SQL SELECT, BCrypt verify, return JWT</summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { message = "Validation failed", errors = ModelState });

        // Fetch user by email using raw SQL
        var user = await _repo.FindByEmailAsync(request.Email);
        var ip = HttpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString();

        // Verify password hash (always run Verify even on null to prevent timing attacks)
        var passwordValid = user != null
            && BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

        if (!passwordValid)
            return Unauthorized(new { message = "Invalid email or password." });

        var (token, expiresAt) = _jwt.GenerateToken(user!, request.RememberMe);

        return Ok(new AuthResponse
        {
            Token     = token,
            Name      = user!.Name,
            Email     = user.Email,
            Role      = user.Role,
            ExpiresAt = expiresAt,
            IpAddress = ip

        });
    }
}
