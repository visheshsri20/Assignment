using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthApi.Models;
using AuthApi.Data;
using Microsoft.IdentityModel.Tokens;

namespace AuthApi.Services;

public interface IJwtService
{
    (string token, DateTime expiresAt) GenerateToken(UserRecord user, bool rememberMe = false);
    ClaimsPrincipal? ValidateToken(string token);
}

public class JwtService : IJwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public (string token, DateTime expiresAt) GenerateToken(UserRecord user, bool rememberMe = false)
    {
        var secretKey = _config["JwtSettings:SecretKey"]!;
        var issuer = _config["JwtSettings:Issuer"]!;
        var audience = _config["JwtSettings:Audience"]!;
        var expiryMinutes = rememberMe
            ? 60 * 24 * 30  
            : int.Parse(_config["JwtSettings:ExpiryInMinutes"] ?? "60");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), 
    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
    new Claim(JwtRegisteredClaimNames.Email, user.Email),
    new Claim(ClaimTypes.Name, user.Name),
    new Claim(ClaimTypes.Role, user.Role),
    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var expiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds
        );

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }

    public ClaimsPrincipal? ValidateToken(string token)
    {
        var secretKey = _config["JwtSettings:SecretKey"]!;
        var handler = new JwtSecurityTokenHandler();
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

        try
        {
            return handler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = true,
                ValidIssuer = _config["JwtSettings:Issuer"],
                ValidateAudience = true,
                ValidAudience = _config["JwtSettings:Audience"],
                ValidateLifetime = true
            }, out _);
        }
        catch
        {
            return null;
        }
    }
}
