
/**
 A JavaScript UI control that represents web file converter demo control.
 @class @public
 @constructor
*/
var WebFileConverterDemoControlJS = function () {

    // create control settings
    var settings = new Vintasoft.Imaging.UI.UIElements.WebUiControlSettingsJS("fileConverterDemoControl");


    WebFileConverterDemoControlJS.superclass.constructor.call(this, settings);


    var containerId = this.get_ContainerId();
    var fileConverterControlContainer = document.getElementById(containerId);
    if (fileConverterControlContainer.length === 0)
        _NS_SHARED.ParametersValidator.throwException("Container with '" + containerId + "' for FileConverterDemoControl does not exist.");
        
}
Vintasoft.Shared.extend(WebFileConverterDemoControlJS, Vintasoft.Imaging.UI.UIElements.WebUiControlJS);