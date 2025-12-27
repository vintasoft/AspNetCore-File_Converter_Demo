using Vintasoft.Imaging.Web.Services;

namespace AspNetCoreFileConverterDemo.Controllers
{
    /// <summary>
    /// Contains settings of PDF MRC encoder.
    /// </summary>
    public class WebPdfMrcEncoderSettings : WebPdfEncoderSettings
    {

        /// <summary>
        /// Initializes a new instance of the <see cref="WebPdfMrcEncoderSettings"/> class.
        /// </summary>
        public WebPdfMrcEncoderSettings()
            : base()
        {
        }



        bool _enableMrcCompression = true;
        /// <summary>
        /// Gets or sets a value indicating whether the MRC compression is enabled.
        /// </summary>
        /// <value>
        /// <b>true</b> - the MRC compression is enabled;
        /// <b>true</b> - the MRC compression is disabled.<br />
        /// Default value is <b>true</b>.
        /// </value>
        public bool enableMrcCompression
        {
            get { return _enableMrcCompression; }
            set { _enableMrcCompression = value; }
        }

        WebPdfMrcCompressionState _mrcCompressionSettingProfile = WebPdfMrcCompressionState.TextWithImages_Optimal;
        /// <summary>
        /// Gets or sets a predefined MRC compression setting profile.
        /// </summary>
        /// <value>
        /// Default value if <see cref="WebPdfMrcCompressionState"/>.Optimal.
        /// </value>
        public WebPdfMrcCompressionState mrcCompressionSettingProfile
        {
            get { return _mrcCompressionSettingProfile; }
            set { _mrcCompressionSettingProfile = value; }
        }

    }
}