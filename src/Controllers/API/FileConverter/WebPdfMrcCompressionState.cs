namespace AspNetCoreFileConverterDemo.Controllers
{
    /// <summary>
    /// Specifies available predefined MRC compression settings profiles.
    /// </summary>
    public enum WebPdfMrcCompressionState : int
    {
        TextWithImages_BestQuality = 0,
        TextWithImages_Optimal = 1,
        TextWithImages_BestCompression = 2,
        Text_BestQuality = 3,
        Text_Optimal = 4,
        Text_BestCompression = 5
    }
}