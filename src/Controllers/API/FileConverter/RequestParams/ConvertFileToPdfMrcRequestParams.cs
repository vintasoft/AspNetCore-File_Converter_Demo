using Vintasoft.Imaging.Web.Services;

namespace AspNetCoreFileConverterDemo.Controllers
{
    public class ConvertFileToPdfMrcRequestParams : BaseConvertFileToRequestParams
    {

        /// <summary>
        /// Initializes a new instance of the <see cref="ConvertFileToPdfMrcRequestParams"/> class.
        /// </summary>
        public ConvertFileToPdfMrcRequestParams()
            : base()
        {
        }


        WebPdfMrcEncoderSettings _settings = new WebPdfMrcEncoderSettings();
        /// <summary>
        /// Gets or sets settings of PDF MRC encoder.
        /// </summary>
        public WebPdfMrcEncoderSettings settings
        {
            get { return _settings; }
            set { _settings = value; }
        }
    }
}