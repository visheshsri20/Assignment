using MySqlConnector;

namespace AuthApi.Data;

public class UserRepository
{
    private readonly DatabaseHelper _db;

    public UserRepository(DatabaseHelper db)
    {
        _db = db;
    }

    public async Task<int> CreateAsync(string name, string email, string passwordHash, string role = "User")
    {
        await using var conn = await _db.GetConnectionAsync();
        await using var cmd = conn.CreateCommand();

        cmd.CommandText = "UDSP_CREATE_USER";
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
        cmd.Parameters.AddWithValue("p_Name", name);
        cmd.Parameters.AddWithValue("p_Email", email);
        cmd.Parameters.AddWithValue("p_PasswordHash", passwordHash);
        cmd.Parameters.AddWithValue("p_Role", role);

        await using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
            return reader.GetInt32("NewUserId");

        return 0;
    }

    public async Task<UserRecord?> FindByEmailAsync(string email)
    {
        await using var conn = await _db.GetConnectionAsync();
        await using var cmd = conn.CreateCommand();

        cmd.CommandText = "UDSP_GET_USER_BY_EMAIL";
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
        cmd.Parameters.AddWithValue("p_Email", email);

        await using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return new UserRecord(
                reader.GetInt32("Id"),
                reader.GetString("Name"),
                reader.GetString("Email"),
                reader.GetString("PasswordHash"),
                reader.GetString("Role"),
                reader.GetDateTime("CreatedAt")
            );
        }

        return null;
    }

    public async Task<UserRecord?> FindByIdAsync(int id)
    {
        await using var conn = await _db.GetConnectionAsync();
        await using var cmd = conn.CreateCommand();

        cmd.CommandText = "UDSP_GET_USER_BY_ID";
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
        cmd.Parameters.AddWithValue("p_Id", id);

        await using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return new UserRecord(
                reader.GetInt32("Id"),
                reader.GetString("Name"),
                reader.GetString("Email"),
                PasswordHash: string.Empty, 
                reader.GetString("Role"),
                reader.GetDateTime("CreatedAt")
            );
        }

        return null;
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        await using var conn = await _db.GetConnectionAsync();
        await using var cmd = conn.CreateCommand();

        cmd.CommandText = "UDSP_CHECK_EMAIL_EXISTS";
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
        cmd.Parameters.AddWithValue("p_Email", email);

        await using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
            return reader.GetInt32("EmailCount") > 0;

        return false;
    }

    public async Task<List<UserRecord>> GetAllAsync()
    {
        var users = new List<UserRecord>();

        await using var conn = await _db.GetConnectionAsync();
        await using var cmd = conn.CreateCommand();

        cmd.CommandText = "UDSP_GET_ALL_USERS";
        cmd.CommandType = System.Data.CommandType.StoredProcedure;

        await using var reader = await cmd.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            users.Add(new UserRecord(
                reader.GetInt32("Id"),
                reader.GetString("Name"),
                reader.GetString("Email"),
                reader.GetString("PasswordHash"),
                reader.GetString("Role"),
                reader.GetDateTime("CreatedAt")
            ));
        }

        return users;
    }
}

public record UserRecord(
    int Id,
    string Name,
    string Email,
    string PasswordHash,
    string Role,
    DateTime CreatedAt
);