namespace Demo.DTOs;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public string? Error { get; set; } = string.Empty;
    public ApiResponse(bool success, string message, T? data = default, string? error = null)
    {
        Success = success;
        Message = message;
        Data = data;
        Error = error;
    }
}