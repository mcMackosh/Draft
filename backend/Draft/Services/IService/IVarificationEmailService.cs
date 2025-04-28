using Draft.Data.Model;

namespace Draft.Services.IService
{
    public interface IVarificationEmailService
    {
        Task SendVerificationEmailAsync(string email, string verificationCode);
    }
}
