using Draft.ApiResponseGlobal;
using Draft.Data.Model;
using Draft.DTO;
using Draft.Exrption;
using Draft.Services.IService;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NETCore.MailKit.Core;
using Org.BouncyCastle.Asn1.Ocsp;
using System.ComponentModel;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Authentication;
using System.Security.Claims;
using System.Text;
using UnauthorizedAccessException = Draft.Exrption.UnauthorizedAccessException;

namespace Draft.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;
        private readonly DBProjectManagerContext _context;
        private readonly IVarificationEmailService _emailService;

        public AuthService(IConfiguration config, DBProjectManagerContext context, IVarificationEmailService emailService)
        {
            _config = config;
            _context = context;
            _emailService = emailService;
        }

        public async Task<UserResponce> LoginAsync(LoginRequest loginUser)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginUser.Email);
            if (user == null)
                throw new InvalidCredentialsException("Email doesn`t exist!");

            //if (!BCrypt.Net.BCrypt.Verify(loginUser.Password, user.Password))
            //    throw new InvalidCredentialsException("Invalid password!");

            var refreshToken = await GenerateToken(user, null, 2880);
            await SaveRefreshToken(user.Id, refreshToken);

            return new UserResponce
            {
                access_token = await GenerateToken(user, null, 1000),
                refresh_token = refreshToken,
                user = MapToUserDto(user, null, null)
            };
        }

        public async Task<UserResponce> RefreshAsync(string token, int? projectId)
        {
            var principal = ValidateToken(token);
            if (principal == null)
                throw new InvalidTokenException("Invalid refresh token");

            var userId = int.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier));

            if (projectId == null)
            {
                var projectIdClaim = principal.Claims
                    .FirstOrDefault(c => c.Type == "ProjectId" || c.Type.EndsWith("ProjectId"))?.Value;

                if (projectIdClaim != null && int.TryParse(projectIdClaim, out var parsedProjectId))
                {
                    projectId = parsedProjectId;
                }
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new UserNotFoundException("User not found");

            var existingToken = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == token);
            if (existingToken == null)
                throw new TokenNotFoundException("Refresh token not found");

            string role = null;

            if (projectId.HasValue)
            {
                bool hasAccess = await _context.UserRoles
                    .AnyAsync(ur => ur.UserId == userId && ur.ProjectId == projectId.Value);

                if (!hasAccess)
                {
                    projectId = null;
                }
                else
                {
                    role = await _context.UserRoles
                        .Where(ur => ur.UserId == userId && ur.ProjectId == projectId.Value)
                        .Select(ur => ur.Role)
                        .FirstOrDefaultAsync();
                }
            }

            var newAccessToken = await GenerateToken(user, projectId, 1000);
            var newRefreshToken = await GenerateToken(user, projectId, 2880);

            existingToken.Token = newRefreshToken;
            existingToken.CreatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return new UserResponce
            {
                user = MapToUserDto(user, projectId, role),
                access_token = newAccessToken,
                refresh_token = newRefreshToken,
            };
        }


        public async Task LogoutAsync(string token)
        {
            var principal = ValidateToken(token);
            if (principal == null)
                throw new InvalidTokenException("Invalid token");

            var userId = int.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier));
            var refreshToken = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.UserId == userId);
            if (refreshToken != null)
            {
                _context.RefreshTokens.Remove(refreshToken);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<UserResponce> VerifyAccountAsync(VerifyUserDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
                throw new UserNotFoundException("User not found");

            if (user.VerificationCode != dto.Code)
                throw new InvalidVerificationCodeException("Incorrect verification code");

            user.IsVerified = true;
            await _context.SaveChangesAsync();

            var refreshToken = await GenerateToken(user, null, 2880);
            await SaveRefreshToken(user.Id, refreshToken);

            return new UserResponce
            {
                access_token = await GenerateToken(user, null, 1000),
                refresh_token = refreshToken,
                user = MapToUserDto(user, null, null)
            };
        }

        public async Task<UserDTO> RegisterAsync(RegistrationRequest request)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null)
                throw new UserAlreadyExistsException("User with this email already exists");

            var user = new User
            {
                Login = request.Login,
                Email = request.Email,
                Password = request.Password,
                VerificationCode = Guid.NewGuid().ToString(),
                IsVerified = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            await _emailService.SendVerificationEmailAsync(user.Email, user.VerificationCode);

            return MapToUserDto(user, null, null);
        }

        private async Task<string> GenerateToken(User user, int? projectId, int time)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Login),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            if (projectId.HasValue)
            {
                var roles = await _context.UserRoles
                    .Where(x => x.UserId == user.Id && x.ProjectId == projectId.Value)
                    .Select(x => x.Role)
                    .ToListAsync();

                claims.Add(new Claim("ProjectId", projectId.Value.ToString()));
                foreach (var role in roles)
                {
                    claims.Add(new Claim("ProjectRole", role));
                }
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddSeconds(time),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private ClaimsPrincipal ValidateToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));

                return tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = true,
                    ValidIssuer = _config["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _config["Jwt:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out _);
            }
            catch
            {
                return null;
            }
        }

        public async Task<UserDTO> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new UserNotFoundException("User not found");
            }

            return MapToUserDto(user, null, null);
        }

        private async Task SaveRefreshToken(int userId, string token)
        {
            var refreshToken = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.UserId == userId);
            if (refreshToken == null)
            {
                refreshToken = new RefreshToken { UserId = userId, Token = token, CreatedAt = DateTime.UtcNow };
                _context.RefreshTokens.Add(refreshToken);
            }
            else
            {
                refreshToken.Token = token;
                refreshToken.CreatedAt = DateTime.UtcNow;
            }
            await _context.SaveChangesAsync();
        }

        private UserDTO MapToUserDto(User user, int? currentProjectId, string role) => new()
        {
            Id = user.Id,
            Login = user.Login,
            Email = user.Email,
            IsVerified = user.IsVerified,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            CurrentProjectId = currentProjectId,
            Role = role
        };
    }
}