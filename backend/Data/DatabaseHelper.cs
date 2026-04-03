using MySqlConnector;

namespace AuthApi.Data;

public class DatabaseHelper
{
    private readonly string _connectionString;

    public DatabaseHelper(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
    }

    public async Task<MySqlConnection> GetConnectionAsync()
    {
        var conn = new MySqlConnection(_connectionString);
        await conn.OpenAsync();
        return conn;
    }

    
    public async Task EnsureTablesCreatedAsync()
    {
        await using var conn = await GetConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            CREATE TABLE IF NOT EXISTS Users (
                Id           INT          AUTO_INCREMENT PRIMARY KEY,
                Name         VARCHAR(100) NOT NULL,
                Email        VARCHAR(100) NOT NULL UNIQUE,
                PasswordHash VARCHAR(255) NOT NULL,
                Role         VARCHAR(20)  NOT NULL DEFAULT 'User',
                CreatedAt    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_users_email ON Users(Email);";
        await cmd.ExecuteNonQueryAsync();
    }
}
