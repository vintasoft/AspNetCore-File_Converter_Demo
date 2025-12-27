// create enum that specifies available predefined MRC compression settings profiles
var WebPdfMrcCompressionStateEnumJS = Vintasoft.Shared.EnumGenerator.create([
    { name: "TextWithImages_BestQuality", value: 0 },
    { name: "TextWithImages_Optimal", value: 1 },
    { name: "TextWithImages_BestCompression", value: 2 },
    { name: "Text_BestQuality", value: 3 },
    { name: "Text_Optimal", value: 4 },
    { name: "Text_BestCompression", value: 5 },
], false);



/**
 PDF MRC encoder settings.
*/
var WebPdfMrcEncoderSettingsJS = function () {

    WebPdfMrcEncoderSettingsJS.superclass.constructor.apply(this, arguments);


    /**
     Gets encoder name.
    */
    WebPdfMrcEncoderSettingsJS.prototype.get_Name = function () {
        return "PdfMrc";
    }

    /**
     Gets a value indicating whether MRC compression applies only to the raster images.
    */
    WebPdfMrcEncoderSettingsJS.prototype.get_EnableMrcCompression = function () {
        return this._enableMrcCompression;
    }
    /**
     Sets a value indicating whether MRC compression applies only to the raster images.
    */
    WebPdfMrcEncoderSettingsJS.prototype.set_EnableMrcCompression = function (value) {
        if (typeof value !== "boolean")
            throw new Error("Argument type exception.");
        this._enableMrcCompression = value;
    }

    /**
     Gets a predefined MRC compression settings profile.
    */
    WebPdfMrcEncoderSettingsJS.prototype.get_MrcCompressionSettingProfile = function () {
        return this._mrcCompressionSettingProfile;
    }
    /**
     Sets a predefined MRC compression settings profile.
    */
    WebPdfMrcEncoderSettingsJS.prototype.set_MrcCompressionSettingProfile = function (value) {
        if (!(value instanceof WebPdfMrcCompressionStateEnumJS))
            throw new Error("Argument type exception.");
        this._mrcCompressionSettingProfile = value;
    }


    /**
     Returns image encoder settings as object.
    */
    WebPdfMrcEncoderSettingsJS.prototype.toObject = function () {
        var settingsAsObject = WebPdfMrcEncoderSettingsJS.superclass.toObject.apply(this, arguments);
        settingsAsObject["enableMrcCompression"] = this._enableMrcCompression;
        settingsAsObject["mrcCompressionSettingProfile"] = this._mrcCompressionSettingProfile.valueOf();
        return settingsAsObject;
    }


    this._enableMrcCompression = true;
    this._mrcCompressionSettingProfile = new WebPdfMrcCompressionStateEnumJS("TextWithImages_Optimal");
}
Vintasoft.Shared.extend(WebPdfMrcEncoderSettingsJS, Vintasoft.Imaging.WebPdfEncoderSettingsJS);
