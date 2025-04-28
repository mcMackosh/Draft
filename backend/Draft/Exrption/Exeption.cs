namespace Draft.Exrption
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string message) : base(message) { }
    }

    public class ValidationException : Exception
    {
        public ValidationException(string message) : base(message) { }
    }

    public class UnauthorizedAccessException : Exception
    {
        public UnauthorizedAccessException(string message) : base(message) { }
    }

    public class InvalidCredentialsException : Exception
    {
        public InvalidCredentialsException(string message) : base(message) { }
    }

    public class UserNotFoundException : Exception
    {
        public UserNotFoundException(string message) : base(message) { }
    }

    public class TokenNotFoundException : Exception
    {
        public TokenNotFoundException(string message) : base(message) { }
    }

    public class InvalidTokenException : Exception
    {
        public InvalidTokenException(string message) : base(message) { }
    }

    public class UserAlreadyExistsException : Exception
    {
        public UserAlreadyExistsException(string message) : base(message) { }
    }

    public class InvalidVerificationCodeException : Exception
    {
        public InvalidVerificationCodeException(string message) : base(message) { }
    }

    public class ForbidException : Exception
    {
        public ForbidException(string message) : base(message) { }
    }
}
