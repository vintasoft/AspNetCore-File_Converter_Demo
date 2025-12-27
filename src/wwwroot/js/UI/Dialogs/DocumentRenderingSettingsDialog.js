/**
 A dialog that allows to view and edit the rendering settings for PDF, DOCX or XLSX document.
*/
DocumentRenderingSettingsDialogJS = function (showPageSizeSettings, closedFunc) {

    var _imageRenderingSettingsPanel;
    var _pageSizeSettingsPanel;

    var dialogId = "documentRenderingSettingsDialog";



    DocumentRenderingSettingsDialogJS.okButton_clicked = function () {
        $('#' + dialogId).modal('hide');

        var renderingSettings = _imageRenderingSettingsPanel.get_Settings();
        var pageSizeSettings = null;
        if (showPageSizeSettings) {
            pageSizeSettings = _pageSizeSettingsPanel.get_Settings();
        }

        closedFunc(renderingSettings, pageSizeSettings);
    }

    DocumentRenderingSettingsDialogJS.prototype.show = function () {
        if (_imageRenderingSettingsPanel == null) {
            // create a panel with image rendering settings
            _imageRenderingSettingsPanel = new ImageRenderingSettingsPanelJS(dialogId);
        }
        _imageRenderingSettingsPanel.initialize();

        if (_pageSizeSettingsPanel == null) {
            // create a panel with page size settings
            _pageSizeSettingsPanel = new PageSizeSettingsPanelJS(dialogId);

            // get DIV-element that represents dialog
            var documentRenderingSettingsDialogDiv = document.getElementById(dialogId);
            // get page size panel
            var pageSizeSettingsPanel = documentRenderingSettingsDialogDiv.querySelector("#pageSizeSettingsPanel");
            // show/hide panel
            pageSizeSettingsPanel.style.display = showPageSizeSettings ? "" : "none";
        }

        // show the dialog
        $('#' + dialogId).modal('show');
    }

    /**
     The "Default settings" checkbox is changed.
    */
    function __useDefaultSettingsCheckboxChanged(event) {
        var useDefaultSettingsCheckbox = this;

        var documentRenderingSettingsDialogDiv = document.getElementById(dialogId);
        var customSettingsFieldset = documentRenderingSettingsDialogDiv.querySelector("#customSettingsFieldset");
        customSettingsFieldset.disabled = useDefaultSettingsCheckbox.checked ? "disabled" : "";
    }



    var documentRenderingSettingsDialogDiv = document.getElementById(dialogId);
    var defaultSettingsCheckbox = documentRenderingSettingsDialogDiv.querySelector("#defaultSettingsCheckbox");
    Vintasoft.Shared.subscribeToEvent(defaultSettingsCheckbox, "change", __useDefaultSettingsCheckboxChanged);

}
