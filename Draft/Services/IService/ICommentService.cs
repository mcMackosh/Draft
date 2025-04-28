using Draft.Data.Model;
using Draft.DTO;

namespace Draft.Services.IService
{
    public interface ICommentService
    {
        Task<List<CommentDTO>> GetCommentsByTaskAsync(int taskId);
        Task<CommentDTO> CreateCommentAsync(CreateCommentDTO commentDto, int authorId);
        Task<bool> CanEditCommentAsync(int commentId, int userId);
        Task UpdateCommentAsync(int commentId, string newContent);
        Task DeleteCommentAsync(int commentId);
    }
}
 