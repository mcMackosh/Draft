using Draft.ApiResponseGlobal;
using Draft.DTO;
using Draft.Exrption;
using Draft.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Authentication;
using System.Security.Claims;
using UnauthorizedAccessException = Draft.Exrption.UnauthorizedAccessException;

namespace Draft.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthController(IAuthService authService, IHttpContextAccessor httpContextAccessor)
        {
            _authService = authService;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginRequest request)
        {
            try
            {
                var response = await _authService.LoginAsync(request);
                SetRefreshTokenCookie(response.refresh_token);
                return Ok(new ApiResponse<UserResponce>(200, "Login successful", response));
            }
            catch (InvalidCredentialsException ex)
            {
                return Unauthorized(new ApiResponse<string>(401, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<string>(400, ex.Message));
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegistrationRequest request)
        {
            try
            {
                var dto = await _authService.RegisterAsync(request);
                return Ok(new ApiResponse<UserDTO>(200, "Verification code is sended", dto));
            }
            catch (UserAlreadyExistsException ex)
            {
                return BadRequest(new ApiResponse<string>(400, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<string>(400, ex.Message));
            }
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUserAsync()
        {
            try
            {
                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var projectIdClaim = User.FindFirstValue("ProjectId");

                if (!int.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new ApiResponse<string>(401, "Invalid token"));
                }

                var user = await _authService.GetUserByIdAsync(userId);
                if (!int.TryParse(projectIdClaim, out var projectId))
                {
                    user.CurrentProjectId = null;
                }
                user.CurrentProjectId = projectId;
                return Ok(new ApiResponse<UserDTO>(200, "User data retrieved", user));
            }
            catch (UserNotFoundException ex)
            {
                return NotFound(new ApiResponse<string>(404, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<string>(400, ex.Message));
            }
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyAsync([FromBody] VerifyUserDto dto)
        {
            try
            {
                var response = await _authService.VerifyAccountAsync(dto);
                SetRefreshTokenCookie(response.refresh_token);
                return Ok(new ApiResponse<UserResponce>(200, "Account verified successfully", response));
            }
            catch (UserNotFoundException ex)
            {
                return NotFound(new ApiResponse<string>(404, ex.Message));
            }
            catch (InvalidVerificationCodeException ex)
            {
                return BadRequest(new ApiResponse<string>(400, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<string>(400, ex.Message));
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshTokenAsync([FromQuery] int? projectId = null)
        {
            var data = _httpContextAccessor.HttpContext.Request.Cookies;
            try
            {
                if (!_httpContextAccessor.HttpContext.Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
                {
                    return Unauthorized(new ApiResponse<string>(401, "No refresh token found"));
                }

                var response = await _authService.RefreshAsync(refreshToken, projectId);
                if (response.user.CurrentProjectId != null)
                {
                    SetRefreshTokenCookie(response.refresh_token);
                    return Ok(new ApiResponse<UserResponce>(200, "Tokens refreshed successfully", response));
                }
                SetRefreshTokenCookie(response.refresh_token);
                return Ok(new ApiResponse<UserResponce>(200, "Tokens refreshed successfully: without ProjectId", response));
            }
            catch (InvalidTokenException ex)
            {
                return Unauthorized(new ApiResponse<string>(401, ex.Message));
            }
            catch (UserNotFoundException ex)
            {
                return NotFound(new ApiResponse<string>(404, ex.Message));
            }
            catch (TokenNotFoundException ex)
            {
                return NotFound(new ApiResponse<string>(404, ex.Message));
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new ApiResponse<string>(401, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<string>(400, ex.Message));
            }
        }

        [HttpDelete("logout")]
        public async Task<IActionResult> LogoutAsync()
        {
            try
            {
                if (!_httpContextAccessor.HttpContext.Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
                {
                    return BadRequest(new ApiResponse<string>(400, "No refresh token found"));
                }

                await _authService.LogoutAsync(refreshToken);
                Response.Cookies.Delete("refresh_token");

                return Ok(new ApiResponse<string>(200, "Logout successful"));
            }
            catch (InvalidTokenException ex)
            {
                return Unauthorized(new ApiResponse<string>(401, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<string>(400, ex.Message));
            }
        }

        private void SetRefreshTokenCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refresh_token", refreshToken, cookieOptions);
        }
    }
}
