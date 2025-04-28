using System.Net.Mail;
using System.Net;
using NETCore.MailKit.Core;
using Draft.Services.IService;
using Draft.ApiResponseGlobal;
using Draft.DTO;
using Draft.Exrption;
using Microsoft.AspNetCore.Mvc;

namespace Draft.Services
{
    public class VarificationEmailService : IVarificationEmailService
    {
        private readonly IConfiguration _config;

        public VarificationEmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendVerificationEmailAsync(string email, string verificationCode)
        {
            var smtpClient = new SmtpClient(_config["Smtp:Host"])
            {
                Port = int.Parse(_config["Smtp:Port"]),
                Credentials = new NetworkCredential(_config["Smtp:Username"], _config["Smtp:Password"]),
                EnableSsl = true,
            };

            var message = new MailMessage
            {
                From = new MailAddress(_config["Smtp:From"]),
                Subject = "Підтвердження реєстрації",
                Body = $"Ваш код підтвердження: {verificationCode}",
                IsBodyHtml = false,
            };

            message.To.Add(email);
            await smtpClient.SendMailAsync(message);
        }
    }
}


    //[HttpPost("login")]
    //public async Task<IActionResult> LoginAsync([FromBody] LoginRequest request)

    //[HttpPost("register")]
    //public async Task<IActionResult> RegisterAsync([FromBody] RegistrationRequest request)

    //[HttpPost("verify")]
    //public async Task<IActionResult> VerifyAsync([FromBody] VerifyUserDto dto)

    //[HttpGet("refresh")]
    //public async Task<IActionResult> RefreshTokenAsync([FromQuery] int? projectId)

    //[HttpDelete("logout")]
    //public async Task<IActionResult> LogoutAsync()
