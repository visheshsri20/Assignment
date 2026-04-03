using AuthApi.Data;
using AuthApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuthApi.Controllers;

[ApiController]
[Route("api/user")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly UserRepository _repo;

    public UserController(UserRepository repo)
    {
        _repo = repo;
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)
                       ?? User.FindFirst("sub");

        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            return Unauthorized(new { message = "Invalid token claims." });

        var user = await _repo.FindByIdAsync(userId);
        if (user == null)
            return NotFound(new { message = "User not found." });

        return Ok(new UserProfileResponse
        {
            Id        = user.Id,
            Name      = user.Name,
            Email     = user.Email,
            Role      = user.Role,
            CreatedAt = user.CreatedAt
        });
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _repo.GetAllAsync();

        var result = users.Select(u => new UserProfileResponse
        {
            Id        = u.Id,
            Name      = u.Name,
            Email     = u.Email,
            Role      = u.Role,
            CreatedAt = u.CreatedAt
        });

        return Ok(result);
    }
}
