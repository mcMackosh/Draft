using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Draft.ApiResponseGlobal;

namespace Draft.Attributes
{
    public class ValidateModelStateFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                var errors = context.ModelState
                    .Where(m => m.Value.Errors.Count > 0)
                    .Select(m => new
                    {
                        Field = m.Key,
                        Errors = m.Value.Errors.Select(e => e.ErrorMessage).ToList()
                    })
                    .ToList();

                var errorMessage = string.Join(",\n", errors.Select(e => $"{e.Field}: {string.Join(", ", e.Errors)}"));

                var apiResponse = new ApiResponse<object>(400, errorMessage, null);

                context.Result = new BadRequestObjectResult(apiResponse);
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
           
        }
    }
}
