namespace Draft.ApiResponseGlobal
{
    public class ApiResponse<T>
    {
        public int StatusCode { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }

        public ApiResponse(int statusCode, string message, T data = default)
        {
            StatusCode = statusCode;
            Success = statusCode >= 200 && statusCode < 300;
            Message = message;
            Data = data;
        }

        public ApiResponse(int statusCode, string message) : this(statusCode, message, default) { }
    }

}
