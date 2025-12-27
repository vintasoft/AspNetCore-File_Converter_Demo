using System;

using Vintasoft.Data;
using Vintasoft.Imaging.Codecs.Encoders;
using Vintasoft.Imaging.Codecs.ImageFiles.Jpeg2000;
using Vintasoft.Imaging.ImageProcessing.Info;
using Vintasoft.Imaging.Pdf;
using Vintasoft.Imaging.Web.Services;

namespace AspNetCoreFileConverterDemo.Controllers
{
    /// <summary>
    /// A platform-independent web service
    /// that handles HTTP requests from clients and allows to convert image files.
    /// </summary>
    public class MyVintasoftImageConverterWebService : VintasoftImageConverterWebService
    {

        #region Constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="MyVintasoftImageConverterWebService"/> class.
        /// </summary>
        /// <param name="sessionDataStorage">A data storage that stores images.</param>
        /// <param name="serializedDocumentsDataStorage">A data storage that stores serialized documents.</param>
        /// <param name="convertedFilesCacheManager">A cache manager that manages cache of converted image files.</param>
        public MyVintasoftImageConverterWebService(
            IDataStorage sessionDataStorage,
            IDataStorage serializedDocumentsDataStorage,
            ConvertedFilesCacheManager convertedFilesCacheManager)
            : base(sessionDataStorage, serializedDocumentsDataStorage, convertedFilesCacheManager)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="MyVintasoftImageConverterWebService"/> class.
        /// </summary>
        /// <param name="sessionDataStorage">A data storage that stores images.</param>
        /// <param name="globalResourcesDataStorage">A data storage that stores global resources.</param>
        /// <param name="serializedDocumentsDataStorage">A data storage that stores serialized documents.</param>
        /// <param name="convertedFilesCacheManager">A cache manager that manages cache of converted image files.</param>
        public MyVintasoftImageConverterWebService(
            IDataStorage sessionDataStorage,
            IDataStorage globalResourcesDataStorage,
            IDataStorage serializedDocumentsDataStorage,
            ConvertedFilesCacheManager convertedFilesCacheManager)
            : base(sessionDataStorage, globalResourcesDataStorage, serializedDocumentsDataStorage, convertedFilesCacheManager)
        {
        }

        #endregion



        #region Methods

        /// <summary>
        /// Starts the asynchronous process that converts an image file to the PDF format using MRC compression.
        /// </summary>
        /// <param name="requestParams">Conversion settings and information about image file.</param>
        /// <returns>The server response, which contains information about file conversion process.</returns>
        public ConvertToResponseParams ConvertFileToPdfMrc(ConvertFileToPdfMrcRequestParams requestParams)
        {
            ConvertToResponseParams answer = new ConvertToResponseParams();
            try
            {
                PdfMrcEncoder encoder = CreatePdfMrcEncoder(requestParams.settings);
                answer = ConvertImageFileTo(requestParams, encoder);
            }
            catch (Exception e)
            {
                answer.success = false;
                answer.errorMessage = e.Message;
            }
            return answer;
        }


        /// <summary>
        /// Creates the PDF MRC encoder.
        /// </summary>
        /// <param name="bmpSettings">Web PDF MRC encoder settings.</param>
        /// <returns>The PDF MRC encoder.</returns>
        protected PdfMrcEncoder CreatePdfMrcEncoder(WebPdfMrcEncoderSettings settings)
        {
            PdfMrcEncoder encoder = new PdfMrcEncoder();
            encoder.Settings = CreatePdfEncoderSettings(settings);
            encoder.MrcCompressionSettings = CreatePdfMrcCompressionSettings(settings);
            return encoder;
        }

        /// <summary>
        /// Creates the PDF MRC encoder settings.
        /// </summary>
        /// <param name="bmpSettings">Web PDF MRC encoder settings.</param>
        /// <returns>The PDF MRC encoder settings.</returns>
        protected PdfMrcCompressionSettings CreatePdfMrcCompressionSettings(WebPdfMrcEncoderSettings settings)
        {
            PdfMrcCompressionSettings mrcCompressionSettings = new PdfMrcCompressionSettings();
            mrcCompressionSettings.EnableMrcCompression = settings.enableMrcCompression;
            if (mrcCompressionSettings.EnableMrcCompression)
            {
                switch (settings.mrcCompressionSettingProfile)
                {
                    // Text with images, best quality
                    case WebPdfMrcCompressionState.TextWithImages_BestQuality:
                        mrcCompressionSettings.CreateBackgroundLayer = true;
                        mrcCompressionSettings.BackgroundLayerCompression = PdfCompression.Jpeg | PdfCompression.Zip;
                        mrcCompressionSettings.BackgroundLayerCompressionSettings.JpegQuality = 60;

                        mrcCompressionSettings.ImageSegmentation = new ImageSegmentationCommand();

                        mrcCompressionSettings.CreateImagesLayer = false;

                        mrcCompressionSettings.HiQualityMask = true;
                        mrcCompressionSettings.MaskCompression = PdfCompression.Jbig2;
                        mrcCompressionSettings.MaskCompressionSettings.Jbig2Settings.Lossy = true;

                        mrcCompressionSettings.CreateFrontLayer = true;
                        mrcCompressionSettings.HiQualityFrontLayer = true;
                        mrcCompressionSettings.FrontLayerCompression = PdfCompression.Jpeg2000;
                        mrcCompressionSettings.FrontLayerCompressionSettings.Jpeg2000Settings.CompressionRatio = 300 * 3;
                        mrcCompressionSettings.FrontLayerCompressionSettings.Jpeg2000Settings.CompressionType = Jpeg2000CompressionType.Lossy;
                        break;

                    // Text with images, optimal
                    case WebPdfMrcCompressionState.TextWithImages_Optimal:
                        mrcCompressionSettings.CreateBackgroundLayer = true;
                        mrcCompressionSettings.BackgroundLayerCompression = PdfCompression.Jpeg | PdfCompression.Zip;
                        mrcCompressionSettings.BackgroundLayerCompressionSettings.JpegQuality = 35;

                        mrcCompressionSettings.ImageSegmentation = new ImageSegmentationCommand();

                        mrcCompressionSettings.CreateImagesLayer = false;

                        mrcCompressionSettings.HiQualityMask = true;
                        mrcCompressionSettings.MaskCompression = PdfCompression.Jbig2;
                        mrcCompressionSettings.MaskCompressionSettings.Jbig2Settings.Lossy = true;

                        mrcCompressionSettings.CreateFrontLayer = true;
                        mrcCompressionSettings.HiQualityFrontLayer = true;
                        mrcCompressionSettings.FrontLayerCompression = PdfCompression.Jpeg | PdfCompression.Zip;
                        mrcCompressionSettings.FrontLayerCompressionSettings.JpegQuality = 25;
                        mrcCompressionSettings.FrontLayerCompressionSettings.Jpeg2000Settings.CompressionRatio = 400 * 3;
                        mrcCompressionSettings.FrontLayerCompressionSettings.Jpeg2000Settings.CompressionType = Jpeg2000CompressionType.Lossy;
                        break;

                    // Text with images, best compression
                    case WebPdfMrcCompressionState.TextWithImages_BestCompression:
                        mrcCompressionSettings.CreateBackgroundLayer = true;
                        mrcCompressionSettings.BackgroundLayerCompression = PdfCompression.Jpeg | PdfCompression.Zip;
                        mrcCompressionSettings.BackgroundLayerCompressionSettings.JpegQuality = 20;


                        mrcCompressionSettings.ImageSegmentation = new ImageSegmentationCommand();

                        mrcCompressionSettings.CreateImagesLayer = false;

                        mrcCompressionSettings.HiQualityMask = false;
                        mrcCompressionSettings.MaskCompression = PdfCompression.Jbig2;
                        mrcCompressionSettings.MaskCompressionSettings.Jbig2Settings.Lossy = true;

                        mrcCompressionSettings.CreateFrontLayer = true;
                        mrcCompressionSettings.HiQualityFrontLayer = false;
                        mrcCompressionSettings.FrontLayerCompression = PdfCompression.Zip;
                        break;

                    // Text, best quality
                    case WebPdfMrcCompressionState.Text_BestQuality:
                        mrcCompressionSettings.CreateBackgroundLayer = true;
                        mrcCompressionSettings.BackgroundLayerCompression = PdfCompression.Jpeg | PdfCompression.Zip;
                        mrcCompressionSettings.BackgroundLayerCompressionSettings.JpegQuality = 30;

                        mrcCompressionSettings.ImageSegmentation = null;

                        mrcCompressionSettings.CreateImagesLayer = false;

                        mrcCompressionSettings.HiQualityMask = true;
                        mrcCompressionSettings.MaskCompression = PdfCompression.Jbig2;
                        mrcCompressionSettings.MaskCompressionSettings.Jbig2Settings.Lossy = true;

                        mrcCompressionSettings.CreateFrontLayer = true;
                        mrcCompressionSettings.HiQualityFrontLayer = true;
                        mrcCompressionSettings.FrontLayerCompression = PdfCompression.Jpeg2000;
                        mrcCompressionSettings.FrontLayerCompressionSettings.Jpeg2000Settings.CompressionRatio = 300 * 3;
                        mrcCompressionSettings.FrontLayerCompressionSettings.Jpeg2000Settings.CompressionType = Jpeg2000CompressionType.Lossy;
                        break;

                    // Text, optimal
                    case WebPdfMrcCompressionState.Text_Optimal:
                        mrcCompressionSettings.CreateBackgroundLayer = true;
                        mrcCompressionSettings.BackgroundLayerCompression = PdfCompression.Jpeg | PdfCompression.Zip;
                        mrcCompressionSettings.BackgroundLayerCompressionSettings.JpegQuality = 25;

                        mrcCompressionSettings.ImageSegmentation = null;

                        mrcCompressionSettings.CreateImagesLayer = false;

                        mrcCompressionSettings.HiQualityMask = true;
                        mrcCompressionSettings.MaskCompression = PdfCompression.Jbig2;
                        mrcCompressionSettings.MaskCompressionSettings.Jbig2Settings.Lossy = true;

                        mrcCompressionSettings.CreateFrontLayer = true;
                        mrcCompressionSettings.HiQualityFrontLayer = false;
                        mrcCompressionSettings.FrontLayerCompression = PdfCompression.Jpeg2000;
                        mrcCompressionSettings.FrontLayerCompressionSettings.Jpeg2000Settings.CompressionRatio = 350 * 3;
                        mrcCompressionSettings.FrontLayerCompressionSettings.Jpeg2000Settings.CompressionType = Jpeg2000CompressionType.Lossy;
                        break;

                    // Text, best compression
                    case WebPdfMrcCompressionState.Text_BestCompression:
                        mrcCompressionSettings.CreateBackgroundLayer = true;
                        mrcCompressionSettings.BackgroundLayerCompression = PdfCompression.Jpeg | PdfCompression.Zip;
                        mrcCompressionSettings.BackgroundLayerCompressionSettings.JpegQuality = 20;

                        mrcCompressionSettings.ImageSegmentation = null;

                        mrcCompressionSettings.CreateImagesLayer = false;

                        mrcCompressionSettings.HiQualityMask = false;
                        mrcCompressionSettings.MaskCompression = PdfCompression.Jbig2;
                        mrcCompressionSettings.MaskCompressionSettings.Jbig2Settings.Lossy = true;

                        mrcCompressionSettings.CreateFrontLayer = true;
                        mrcCompressionSettings.HiQualityFrontLayer = false;
                        mrcCompressionSettings.FrontLayerCompression = PdfCompression.Jpeg2000;
                        mrcCompressionSettings.FrontLayerCompressionSettings.Jpeg2000Settings.CompressionRatio = 450 * 3;
                        mrcCompressionSettings.FrontLayerCompressionSettings.Jpeg2000Settings.CompressionType = Jpeg2000CompressionType.Lossy;
                        break;
                }
            }
            return mrcCompressionSettings;
        }

        #endregion

    }
}
