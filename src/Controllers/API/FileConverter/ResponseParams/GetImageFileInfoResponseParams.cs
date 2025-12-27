using System;

using Vintasoft.Shared.Web;

namespace AspNetCoreFileConverterDemo.Controllers
{
    /// <summary>
    /// Response from web service.
    /// Contains information about uploaded image file.
    /// </summary>
    public class GetImageFileInfoResponseParams : WebImageFileResponseParams
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GetImageFileInfoResponseParams"/> class.
        /// </summary>
        public GetImageFileInfoResponseParams()
            : base()
        {
        }



        int _pageCount = 0;
        /// <summary>
        ///  Gets or sets the number of pages in the source image file.
        /// </summary>
        public int pageCount
        {
            get 
            { 
                return _pageCount; 
            }
            set 
            {
                if (value <= 0)
                    throw new ArgumentOutOfRangeException();
                _pageCount = value; 
            }
        }

        string _decoderName = "unknown";
        /// <summary>
        /// Gets or sets the name of the decoder.
        /// </summary>
        public string decoderName
        {
            get { return _decoderName; }
            set { _decoderName = value; }
        }

    }
}