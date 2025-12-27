using Microsoft.AspNetCore.Mvc;

namespace AspNetCoreFileConverterDemo.Controllers
{
    public class DefaultController : Controller
    {

        public DefaultController()
        {
        }



        public IActionResult Index()
        {
            return View();
        }

    }
}
