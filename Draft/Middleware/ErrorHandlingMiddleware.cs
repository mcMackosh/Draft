using Draft.ApiResponseGlobal;
using Draft.Exrption;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Net;
using UnauthorizedAccessException = Draft.Exrption.UnauthorizedAccessException;

namespace Draft.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _next(context);
                //_logger.LogError(ex, "An unhandled exception occurred");
                //await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            var response = new ApiResponse<string>(500, "Internal Server Error");
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            //switch (exception)
            //{
            //    case NotFoundException:
            //        context.Response.StatusCode = (int)HttpStatusCode.NotFound;
            //        response = new ApiResponse<string>(404, exception.Message);
            //        break;

            //    case ValidationException:
            //        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            //        response = new ApiResponse<string>(400, exception.Message);
            //        break;

            //    case DbUpdateException:
            //        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            //        response = new ApiResponse<string>(500, "Problem with saving data");
            //        break;

            //    case UnauthorizedAccessException:
            //    case InvalidCredentialsException:
            //    case UserNotFoundException:
            //    case TokenNotFoundException:
            //    case InvalidTokenException:
            //        context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            //        response = new ApiResponse<string>(401, exception.Message);
            //        break;

            //    case UserAlreadyExistsException:
            //    case InvalidVerificationCodeException:
            //        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            //        response = new ApiResponse<string>(400, exception.Message);
            //        break;
            //    case ForbidException:
            //        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            //        response = new ApiResponse<string>(400, exception.Message);
            //        break;
            //}

            return context.Response.WriteAsJsonAsync(response);
        }

    }
}
