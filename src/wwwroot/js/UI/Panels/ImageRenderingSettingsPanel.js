/**
 A panel that contains image rendering settings.
*/
ImageRenderingSettingsPanelJS = function (parentId) {

    /**
     Returns an image rendering settings.
    */
    ImageRenderingSettingsPanelJS.prototype.get_Settings = function () {
        var parentElement = document.getElementById(this._parentId);

        // if custom settings are used
        if (parentElement.querySelector("#defaultSettingsCheckbox").checked)
            return null;

        // create rendering settings
        var renderingSettings = new Vintasoft.Shared.WebRenderingSettingsJS();
        // get information about resolution
        var resX = parseFloat(parentElement.querySelector("#renderingSettingsHorizontalResolution").value);
        var resY = parseFloat(parentElement.querySelector("#renderingSettingsVerticalResolution").value);
        // get information about interpolation mode
        var interpolation = parentElement.querySelector("#renderingSettingsInterpolationMode").value;
        // get information about smoothing mode
        var smoothing = parentElement.querySelector("#renderingSettingsSmoothingMode").value;

        if (isNaN(resX) || isNaN(resY) || resX < 0 || resY < 0)
            throw new Error("Wrong parameters.");

        // change image rendering settings
        renderingSettings.set_Resolution({ x: resX, y: resY });
        renderingSettings.set_InterpolationMode(interpolation);
        renderingSettings.set_SmoothingMode(smoothing);

        return renderingSettings;
    }

    /**
     Initializes an image rendering settings panel.
    */
    ImageRenderingSettingsPanelJS.prototype.initialize = function (renderingSettings) {
        var parentElement = document.getElementById(this._parentId);

        if (renderingSettings == null)
            renderingSettings = new Vintasoft.Shared.WebRenderingSettingsJS({ x: 96, y: 96 });

        // get resolution
        resolution = renderingSettings.get_Resolution();
        // set information about resolution
        parentElement.querySelector("#renderingSettingsHorizontalResolution").value = resolution.x;
        parentElement.querySelector("#renderingSettingsVerticalResolution").value = resolution.y;

        // get interpolation mode
        var interpolation = renderingSettings.get_InterpolationMode();
        // set information about interpolation
        parentElement.querySelector("#renderingSettingsInterpolationMode").value = interpolation.toString();

        // get smoothing mode
        var smoothingMode = renderingSettings.get_SmoothingMode();
        // set information about smoothing
        parentElement.querySelector("#renderingSettingsSmoothingMode").value = smoothingMode.toString();
    }
    
    this._parentId = parentId;
}