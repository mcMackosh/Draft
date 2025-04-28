using Draft.Data.Model;
using Draft.DTO;
using Draft.Enums;
using Draft.Services.IService;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Data;

namespace Draft.Services
{
    public class CommentService : ICommentService
    {
        private readonly DBProjectManagerContext _context;

        public CommentService(DBProjectManagerContext context)
        {
            _context = context;
        }
        public async Task<List<CommentDTO>> GetCommentsByTaskAsync(int taskId)
        {
            return await _context.Comments
                .Where(c => c.TaskItemId == taskId)
                .Include(c => c.Author)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new CommentDTO
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    AuthorId = c.AuthorId,
                    AuthorName = c.Author.Login,
                    TaskItemId = c.TaskItemId,
                    ProjectId = c.ProjectId
                })
                .ToListAsync();
        }
        public async Task<CommentDTO> CreateCommentAsync(CreateCommentDTO commentDto, int authorId)
        {
            var comment = new Comment
            {
                Content = commentDto.Content,
                CreatedAt = DateTime.UtcNow,
                AuthorId = authorId,
                TaskItemId = commentDto.TaskItemId,
                ProjectId = await _context.Tasks
                    .Where(t => t.Id == commentDto.TaskItemId)
                    .Select(t => t.ProjectId)
                    .FirstOrDefaultAsync()
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return new CommentDTO
            {
                Id = comment.Id,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                AuthorId = comment.AuthorId,
                AuthorName = (await _context.Users.FindAsync(authorId))?.Login,
                TaskItemId = comment.TaskItemId,
                ProjectId = comment.ProjectId
            };
        }

        public async Task<bool> CanEditCommentAsync(int commentId, int userId)
        {
            var comment = await _context.Comments
                .Include(c => c.Project)
                .ThenInclude(p => p.UserRoles)
                .FirstOrDefaultAsync(c => c.Id == commentId);

            if (comment == null)
                return false;

            if (comment.AuthorId == userId)
                return true;

            var isAdmin = comment.Project.UserRoles.Any(ur => ur.UserId == userId && ur.Role == RoleEnum.Admin);

            return isAdmin;
        }
        public async Task<CommentDTO> UpdateCommentAsync(int commentId, string newContent)
        {
            var comment = await _context.Comments.FindAsync(commentId);
            if (comment != null)
            {
                comment.Content = newContent;
                await _context.SaveChangesAsync();
            }

            return new CommentDTO
            {
                Id = comment.Id,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                AuthorId = comment.AuthorId,
                AuthorName = comment.Author.Login,
                TaskItemId = comment.TaskItemId,
                ProjectId = comment.ProjectId
            };
        }
        public async Task DeleteCommentAsync(int commentId)
        {
            var comment = await _context.Comments.FindAsync(commentId);
            if (comment != null)
            {
                _context.Comments.Remove(comment);
                await _context.SaveChangesAsync();
            }
        }
    }
}

