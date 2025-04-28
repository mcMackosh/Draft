using System.Net.Mail;
using System.Net;
using Draft.Services.IService;


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