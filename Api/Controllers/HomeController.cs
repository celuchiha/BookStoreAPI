using Microsoft.AspNetCore.Mvc;

namespace Bookstore.Api.Controllers
{
    [Route("")]
	public partial class HomeController : Controller 
    {
        [HttpGet]
        public IActionResult Index()
        {
            return new ObjectResult("The bookstore API is running. Use any of the 'api/' actions or start the web application to manage resources.");
        }        
    }
}