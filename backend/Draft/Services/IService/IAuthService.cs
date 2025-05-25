using Draft.ApiResponseGlobal;
using Draft.Data.Model;
using Draft.DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Draft.Services.IService
{
    public interface IAuthService
    {
        Task<UserResponce> LoginAsync(LoginRequest loginUser);
        Task<UserResponce> RefreshAsync(string token, int? projectId);
        Task LogoutAsync(string token);
        Task<UserResponce> VerifyAccountAsync(VerifyUserDto dto);
        Task<UserDTO> RegisterAsync(RegistrationRequest request);
        Task<UserDTO> GetUserByIdAsync(int userId);
    }
}


