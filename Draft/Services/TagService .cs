using Draft.ApiResponseGlobal;
using Draft.Data.Model;
using Draft.DTO;
using Draft.Enums;
using Draft.Exrption;
using Draft.Services.IService;
using Microsoft.EntityFrameworkCore;

namespace Draft.Services
{
    public class TagService : ITagService
    {
        private readonly DBProjectManagerContext _context;

        public TagService(DBProjectManagerContext context)
        {
            _context = context;
        }

        public async Task<TagResponse> CreateTagAsync(CreateTagDto tagDto, int projectId)
        {
            
            var tag = new Tag
            {
                Name = tagDto.Name,
                Color = tagDto.Color,
                ProjectId = projectId
            };
            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();
            return new TagResponse { Id = tag.Id, Name = tag.Name, Color = tag.Color};
        }

        public async Task<IEnumerable<TagResponse>> GetTagsByProjectIdAsync(int projectId)
        {
            // Логіка отримання тегів за проектом
            var tags = await _context.Tags
                .Where(t => t.ProjectId == projectId)
                .ToListAsync();
            return tags.Select(tag => new TagResponse { Id = tag.Id, Name = tag.Name, Color = tag.Color});
        }

        public async Task<TagResponse> GetTagByIdAsync(int tagId)
        {
            var tag = await _context.Tags.FindAsync(tagId);
            if (tag == null)
            {
                throw new NotFoundException("Tag not found");
            }
            return new TagResponse { Id = tag.Id, Name = tag.Name, Color = tag.Color };
        }

        public async Task<TagResponse> UpdateTagAsync(int tagId, UpdateTagDto tagDto)
        {
            // Логіка оновлення тегу
            var tag = await _context.Tags.FindAsync(tagId);
            if (tag == null)
            {
                throw new NotFoundException("Tag not found");
            }
            tag.Name = tagDto.Name;
            tag.Color = tagDto.Color;
            await _context.SaveChangesAsync();
            return new TagResponse { Id = tag.Id, Name = tag.Name, Color = tag.Color };
        }

        public async Task<string> DeleteTagAsync(int tagId)
        {
            // Логіка видалення тегу
            var tag = await _context.Tags.FindAsync(tagId);
            if (tag == null)
            {
                throw new NotFoundException("Tag not found");
            }
            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();
            return "Tag deleted successfully";
        }

        public async Task<bool> IsTagHaveCorrectProjectId(int projectId, int tagId)
        {
            var tag = await _context.Tags.FindAsync(tagId);
            return tag?.ProjectId == projectId;
        }
    }

}
