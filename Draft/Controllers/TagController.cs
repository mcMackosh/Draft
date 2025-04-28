using Draft.ApiResponseGlobal;
using Draft.Attributes;
using Draft.DTO;
using Draft.Enums;
using Draft.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/tags")]
public class TagController : ControllerBase
{
    private readonly ITagService _tagService;

    public TagController(ITagService tagService)
    {
        _tagService = tagService;
    }

    [HttpPost]
    [ProjectAuthorization(RoleEnum.Admin, RoleEnum.Manager)]
    public async Task<ActionResult<ApiResponse<TagResponse>>> CreateTag([FromBody] CreateTagDto tagDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiResponse<object>(400, "Invalid data", ModelState));
        }

        var projectId = GetProjectId();
        if (projectId == 0)
        {
            return BadRequest(new ApiResponse<object>(400, "Project not chosen"));
        }

        try
        {
            var response = await _tagService.CreateTagAsync(tagDto, projectId);
            return Ok(new ApiResponse<TagResponse>(200, "Tag created", response));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(400, ex.Message));
        }
    }

    [HttpGet("all")]
    [ProjectAuthorization(RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Executor, RoleEnum.Viewer)]
    public async Task<ActionResult<ApiResponse<IEnumerable<TagResponse>>>> GetTagsByProjectId()
    {
        var projectId = GetProjectId();
        if (projectId == 0)
        {
            return BadRequest(new ApiResponse<object>(400, "Project not chosen"));
        }

        try
        {
            var response = await _tagService.GetTagsByProjectIdAsync(projectId);
            return Ok(new ApiResponse<IEnumerable<TagResponse>>(200, "Tags retrieved", response));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(400, ex.Message));
        }
    }

    [HttpPut]
    [ProjectAuthorization(RoleEnum.Admin, RoleEnum.Manager)]
    public async Task<ActionResult<ApiResponse<TagResponse>>> UpdateTag([FromQuery] int tagId, [FromBody] UpdateTagDto tagDto)
    {
        var projectId = GetProjectId();
        if (projectId == 0 || !await _tagService.IsTagHaveCorrectProjectId(projectId, tagId))
        {
            return BadRequest(new ApiResponse<object>(400, "Project not chosen or invalid tag for this project"));
        }

        try
        {
            var response = await _tagService.UpdateTagAsync(tagId, tagDto);
            return Ok(new ApiResponse<TagResponse>(200, "Tag updated", response));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(400, ex.Message));
        }
    }

    [HttpDelete]
    [ProjectAuthorization(RoleEnum.Admin, RoleEnum.Manager)]
    public async Task<ActionResult<ApiResponse<string>>> DeleteTag([FromQuery] int tagId)
    {
        var projectId = GetProjectId();
        if (projectId == 0 || !await _tagService.IsTagHaveCorrectProjectId(projectId, tagId))
        {
            return BadRequest(new ApiResponse<object>(400, "Project not chosen or invalid tag for this project"));
        }

        try
        {
            var response = await _tagService.DeleteTagAsync(tagId);
            return Ok(new ApiResponse<string>(200, "Tag deleted", response));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>(400, ex.Message));
        }
    }

    private int GetProjectId()
    {
        return int.TryParse(User.FindFirst("ProjectId")?.Value, out int projectId) ? projectId : 0;
    }
}