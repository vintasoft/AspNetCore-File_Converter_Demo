using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Vintasoft.Imaging.AspNetCore.ApiControllers;
using Vintasoft.Imaging.Web.Services;

namespace AspNetCoreFileConverterDemo.Controllers
{
    /// <summary>
    /// A Web API controller for image conversion.
    /// </summary>
    public class MyVintasoftImageConverterApiController : VintasoftImageConverterApiController
    {

        /// <summary>
        /// Initializes a new instance of the <see cref="MyVintasoftImageConverterApiController"/> class.
        /// </summary>
        public MyVintasoftImageConverterApiController(IWebHostEnvironment hostingEnvironment)
            : base(hostingEnvironment)
        {
        }



        /// <summary>
        /// Starts the asynchronous process that converts an image file to the PDF format using MRC compression.
        /// </summary>
        /// <param name="requestParams">Conversion settings and information about image file.</param>
        /// <returns>The server response, which contains information about file conversion process.</returns>
        [HttpPost]
        public virtual ConvertToResponseParams ConvertFileToPdfMrc([FromBody] ConvertFileToPdfMrcRequestParams requestParams)
        {
            VintasoftImageConverterWebService service = CreateWebService(requestParams.sessionId);
            return ((MyVintasoftImageConverterWebService)service).ConvertFileToPdfMrc(requestParams);
        }


        /// <summary>
        /// Creates the <see cref="VintasoftImageConverterWebService"/>.
        /// that handles HTTP requests from clients and allows to convert image files.
        /// </summary>
        /// <param name="sessionId">Session ID.</param>
        /// <returns>
        /// The <see cref="VintasoftImageConverterWebService"/>.
        /// that handles HTTP requests from clients and allows to convert image files.
        /// </returns>
        protected override VintasoftImageConverterWebService CreateWebService(string sessionId)
        {
            return new MyVintasoftImageConverterWebService(
                CreateSessionDataStorage(sessionId),
                CreateGlobalResourcesDataStorage(),
                CreateSerializedDocumentsDataStorage(sessionId),
                CreateConvertedFilesCacheManager(sessionId));
        }

    }
}
