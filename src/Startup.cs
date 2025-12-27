using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace AspNetCoreFileConverterDemo
{
    public class Startup
    {

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }



        public IConfiguration Configuration { get; }



        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // initialize Vintasoft.Imaging.Pdf.Office assembly (necessary to support conversion from PDF to DOCX)
            Vintasoft.Imaging.PdfOfficeAssembly.Init();

            // set the custom font program controller as the default font program controller
            CustomFontProgramsController.SetDefaultFontProgramsController();

            // specify that VintaSoft Imaging .NET SDK should use SkiaSharp library for drawing of 2D graphics
            Vintasoft.Imaging.Drawing.SkiaSharp.SkiaSharpDrawingFactory.SetAsDefault();

            // register a text encoding provider (can be necessary during loading of XLS/XLSX documents)
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            // configure Newtonsoft JSON as input and output formatter
            services.AddControllersWithViews().AddNewtonsoftJson();
            // add services required for application session state
            services.AddSession();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            var contentTypeProvider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
            contentTypeProvider.Mappings[".jb2"] = "application/image";
            contentTypeProvider.Mappings[".jp2"] = "application/image";
            contentTypeProvider.Mappings[".tga"] = "application/image";
            app.UseStaticFiles(new StaticFileOptions
            {
                ContentTypeProvider = contentTypeProvider
            });

            app.UseRouting();

            app.UseAuthorization();
            app.UseSession();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Default}/{action=Index}");
            });
        }
    }
}
