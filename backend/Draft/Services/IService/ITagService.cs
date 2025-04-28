using Draft.ApiResponseGlobal;
using Draft.Data.Model;
using Draft.DTO;
using Microsoft.EntityFrameworkCore;

namespace Draft.Services.IService
{
    public interface ITagService
    {
        public Task<TagResponse> CreateTagAsync(CreateTagDto tagDto, int projectId);
        public Task<IEnumerable<TagResponse>> GetTagsByProjectIdAsync(int projectId);
        public Task<TagResponse> GetTagByIdAsync(int tagId);
        public Task<TagResponse> UpdateTagAsync(int tagId, UpdateTagDto tagDto);
        public Task DeleteTagAsync(int tagId);
        public Task<bool> IsTagHaveCorrectProjectId(int projectId, int tagId);
    }
}
