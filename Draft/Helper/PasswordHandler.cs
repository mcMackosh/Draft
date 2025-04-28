using Org.BouncyCastle.Crypto.Generators;

namespace Draft.Helper
{
    public class PasswordHandler
    {
        // Хешування пароля перед збереженням у базі даних
        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // Перевірка введеного пароля з хешем у базі даних
        public static bool VerifyPassword(string enteredPassword, string storedHash)
        {
            return BCrypt.Net.BCrypt.Verify(enteredPassword, storedHash);
        }
    }
}
