using Draft.DTO;
using Draft.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[Authorize]
[Route("api/comments")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpGet("task/{taskId}")]
    public async Task<IActionResult> GetCommentsByTask(int taskId)
    {
        var comments = await _commentService.GetCommentsByTaskAsync(taskId);
        return Ok(comments);
    }

    [HttpPost]
    public async Task<IActionResult> CreateComment([FromBody] CreateCommentDTO commentDto)
    {
        var authorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var comment = await _commentService.CreateCommentAsync(commentDto, authorId);
        return Ok(comment);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateComment([FromQuery] int commentId, [FromBody] string newContent)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        if (!await _commentService.CanEditCommentAsync(commentId, userId))
        {
            return Forbid();
        }

        await _commentService.UpdateCommentAsync(commentId, newContent);
        return Ok();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteComment([FromQuery] int commentId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        if (!await _commentService.CanEditCommentAsync(commentId, userId))
        {
            return Forbid();
        }

        await _commentService.DeleteCommentAsync(commentId);
        return Ok();
    }
}