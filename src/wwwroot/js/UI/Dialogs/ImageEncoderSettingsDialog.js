/**
 A dialog that display settings of image encoder.
*/
var ImageEncoderSettingsDialogJS = function (encoderSettings, convertFunc, closeFunc) {
        
    // create dialog title
    var titleLabel = new Vintasoft.Imaging.UI.UIElements.WebUiLabelElementJS({
        text: "Image encoder settings",
        cssClass: "modal-title"
    });
    titleLabel.set_HeaderIndex(5);


    // create property grid
    var propertyGrid = new Vintasoft.Shared.WebPropertyGridJS(encoderSettings);


    // create property grid panel settings
    var propertyGridPanelSettings = {
        cssClass: "vsui-dialogContent",
        css: {
            "padding": "0px",
            "border": "1px solid gray",
            "overflow-x": "auto"
        }
    };

    // create property grid panel
    var propertyGridPanel = new Vintasoft.Imaging.UI.Panels.WebUiPropertyGridPanelJS(propertyGrid, propertyGridPanelSettings);


    // self link
    var that = this;
    // create button "Convert"
    var convertButton = new Vintasoft.Imaging.UI.UIElements.WebUiButtonInputJS({
        cssClass: "btn btn-primary",
        value: "Convert",
        localizationId: "convertButton",
        onClick: {
            callback: function () {
                that.hide();

                convertFunc(encoderSettings);
                closeFunc(that);
            }
        }
    });

    // create button "Close"
    var closeButton = new Vintasoft.Imaging.UI.UIElements.WebUiButtonInputJS({
        cssClass: "btn btn-primary",
        value: "Close",
        localizationId: "closeButton",
        onClick: {
            callback: function () {
                that.hide();

                closeFunc(that);
            }
        }
    });

    
    ImageEncoderSettingsDialogJS.superclass.constructor.call(this, [titleLabel], [propertyGridPanel], [convertButton, closeButton], {});
    
}
Vintasoft.Shared.extend(ImageEncoderSettingsDialogJS, Vintasoft.Imaging.UI.Dialogs.WebUiDialogJS);