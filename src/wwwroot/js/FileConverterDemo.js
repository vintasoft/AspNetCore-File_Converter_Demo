var _fileConverterControl;

var _fileId, _filePassword;
var _decoderName, _renderingSettings, _pageSize;

var _bmpEncoderSettings;
var _docxEncoderSettings;
var _gifEncoderSettings;
var _htmlEncoderSettings;
var _jbig2EncoderSettings;
var _jpegEncoderSettings;
var _jpeg2000EncoderSettings;
var _pbmEncoderSettings;
var _pcxEncoderSettings;
var _pdfEncoderSettings;
var _pdfMrcEncoderSettings;
var _pngEncoderSettings;
var _psdEncoderSettings;
var _svgEncoderSettings;
var _tgaEncoderSettings;
var _tiffEncoderSettings;
var _webpEncoderSettings;
var _xlsxEncoderSettings;

var _imageConverter;

var _fileConversionProgressDialog;

var _blockUiDialog;



// === Upload image file ===

/**
 "Upload Image File" button is clicked.
*/
function __uploadImageButtonClicked() {
    // block the UI
    __blockUI("File Uploading...");
    // get files to upload
    var files = document.getElementById("uploadImageFile").files;
    // if there is files to upload
    if (files.length > 0) {
        // upload images to the server asynchronously
        Vintasoft.Imaging.VintasoftFileAPI.uploadImageFile(files[0], __onUploadFile_success, __onUploadFile_error);
    }
    else
        // unblock the UI
        __unblockUI();
    return false;
}

/**
 Request for uploading file is executed successfully.
*/
function __onUploadFile_success(data) {
    // unblock the UI
    __unblockUI();
    // clear the list of files to upload
    __clearFileInputContent();

    // authenticate file without password
    __authenticateFileWithoutPassword(data.fileId);
}

/**
 Request for uploading file is failed.
*/
function __onUploadFile_error(error) {
    // clear the list of files to upload
    __clearFileInputContent();

    // show information about error
    __showErrorMessage(error);
}

/**
 Clears content of file input.
*/
function __clearFileInputContent() {
    document.getElementById("uploadImageFile").value = null;
}



// === File authentication ===

/**
 Authenticate file without password.
*/
function __authenticateFileWithoutPassword(fileId) {
    // use empty password
    _filePassword = "";
    // authenticate the file using specified password
    Vintasoft.Imaging.VintasoftFileAPI.authenticateFile(fileId, _filePassword, __authenticateFileWithoutPassword_success, __authenticateFileWithoutPassword_error);
}

/**
 File authentication without password is finished successfully.
*/
function __authenticateFileWithoutPassword_success(data) {
    // if file does NOT need password
    if (data.isAuthenticationSucceeded) {
        // send an asynchronous request for getting information about image file
        __getImageFileInfo(data.fileId, _filePassword);
    }
    // if file needs password
    else {
        // open a password dialog
        __openPasswordDialog(data.fileId);
    }
}

/**
 File authentication without password is failed.
*/
function __authenticateFileWithoutPassword_error(data) {
    if (data.isAuthenticationRequired) {
        // open a password dialog
        __openPasswordDialog(data.fileId);
    }
    else {
        // show information about error
        __showErrorMessage(data);
    }
}

/**
 Creates a modal window for entering the password and shows the dialog.
*/
function __openPasswordDialog(fileId) {
    // create password dialog
    var filePasswordDialog = new Vintasoft.Imaging.UI.Dialogs.WebUiDocumentPasswordDialogJS(fileId);
    // subscribe to the authenticationSucceeded of password dialog
    Vintasoft.Shared.subscribeToEvent(filePasswordDialog, "authenticationSucceeded", __filePasswordDialog_authenticationSuccess);

    _fileConverterControl.get_Items().addItem(filePasswordDialog);

    // show password dialog
    filePasswordDialog.show();
}

function __filePasswordDialog_authenticationSuccess(event, data) {
    // destroy password dialog
    __destroyPasswordDialog(this);

    var fileId = data.fileId;
    var filePassword = data.filePassword;

    // save the file password
    _filePassword = filePassword;
    // send an asynchronous request for getting information about uploaded image file
    __getImageFileInfo(fileId, filePassword);
}

/**
 Destroys password dialog.
*/
function __destroyPasswordDialog(filePasswordDialog) {
    // remove password dialog from the file converter control
    _fileConverterControl.get_Items().removeItem(filePasswordDialog);
}



// === Get image file info ===

/**
 Sends an asynchronous request for getting information about image file.
*/
function __getImageFileInfo(fileId, password) {
    // block the UI
    __blockUI("Open file");

    // reset information about previous image file
    _fileId = fileId;
    _decoderName = null;

    var imageSource = new Vintasoft.Shared.WebImageSourceJS(fileId);
    imageSource.set_Password(password);
    var image = new Vintasoft.Shared.WebImageJS(imageSource, 0);
    image.getImageInfo(__getImageFileInfo_success, __getImageFileInfo_error);
}

/**
 Request for getting information about image file is executed successfully.
*/
function __getImageFileInfo_success(data) {
    // unblock UI
    __unblockUI();

    // save and show information about image file

    _decoderName = data.decoderName;

    document.getElementById("activeFileId").innerText = _fileId;
    document.getElementById("fileTypeSelect").disabled = false;
    document.getElementById("convertButton").disabled = false;
}

/**
 Request for getting information about image file is failed.
*/
function __getImageFileInfo_error(data) {
    // unblock UI
    __unblockUI();

    // show error message
    __showErrorMessage(data);
}



// === File conversion ===

/**
 "Convert" button is clicked.
*/
function __convertButtonClicked() {
    document.getElementById("uploadFileButton").disabled = true;
    document.getElementById("convertButton").disabled = true;

    // reset information about rendering settings
    _renderingSettings = null;

    _pageSize = null;

    // show a dialog with image decoder settings
    __showDecoderSettingsDialog();
}

/**
 Opens a dialog with image decoder settings.
*/
function __showDecoderSettingsDialog() {
    // if source file is PDF, DOCX or XLSX file
    if (_decoderName === "Pdf" || _decoderName === "Docx" || _decoderName === "Xlsx") {
        var showPageSizeSettings = _decoderName != "Pdf";

        // create dialog that allows to view and edit the rendering settings for PDF, DOCX or XLSX document
        var documentRenderingSettingsDialog = new DocumentRenderingSettingsDialogJS(showPageSizeSettings, __documentRenderingSettingsDialog_closed);
        // show the dialog
        documentRenderingSettingsDialog.show();
    }
    // if source file is NOT PDF, DOCX or XLSX file
    else {
        // show the encoder settings dialog
        __showEncoderSettingsDialog();
    }
}

/**
 Custom settings dialog is closed.
*/
function __documentRenderingSettingsDialog_closed(renderingSettings, pageSizeSettings) {
    // save rendering settings
    _renderingSettings = renderingSettings;
    // save page size settings
    _pageSize = pageSizeSettings;
    // show the encoder settings dialog
    __showEncoderSettingsDialog();
}

/**
 Returns the encoder settings from UI settings.
*/
function __getEncoderSettingsFromUI() {
    var val = document.getElementById("fileTypeSelect").value;
    switch (val) {
        case "BMP":
            return _bmpEncoderSettings;
        case "DOCX":
            return _docxEncoderSettings;
        case "GIF":
            return _gifEncoderSettings;
        case "HTML":
            return _htmlEncoderSettings;
        case "JBIG2":
            return _jbig2EncoderSettings;
        case "JPEG":
            return _jpegEncoderSettings;
        case "JPEG2000":
            return _jpeg2000EncoderSettings;
        case "PBM":
            return _pbmEncoderSettings;
        case "PCX":
            return _pcxEncoderSettings;
        case "PDF":
            return _pdfEncoderSettings;
        case "PDF MRC":
            return _pdfMrcEncoderSettings;
        case "PNG":
            return _pngEncoderSettings;
        case "PSD":
            return _psdEncoderSettings;
        case "SVG":
            return _svgEncoderSettings;
        case "TGA":
            return _tgaEncoderSettings;
        case "TIFF":
            return _tiffEncoderSettings;
        case "WEBP":
            return _webpEncoderSettings;
        case "XLSX":
            return _xlsxEncoderSettings;
    }
    return null;
}

/**
 Opens a dialog with encoder settings.
*/
function __showEncoderSettingsDialog() {
    // get the encoder settings from UI
    var encoderSettings = __getEncoderSettingsFromUI();
    // if encoder settings are defined
    if (encoderSettings != null) {
        var encoderName = encoderSettings.get_Name();
        if (encoderName === "Docx" || encoderName === "Pcx" || encoderName === "Xlsx" || encoderName === "Html") {
            var fileConverterParams = {
                fileId: _fileId,
                password: _filePassword,
                encoderSettings: encoderSettings,
                renderingSettings: _renderingSettings,
                pageSize: _pageSize
            };
            // start the asynchronous image file conversion
            _imageConverter.convertFileTo(fileConverterParams, _imageConverter_convertFileTo_success, _imageConverter_convertFileTo_error);
        }
        else {
            var imageEncoderSettingsDialog = new ImageEncoderSettingsDialogJS(encoderSettings, __imageEncoderSettingsDialog_convert, __imageEncoderSettingsDialog_close);

            _fileConverterControl.get_Items().addItem(imageEncoderSettingsDialog);

            // show dialog that display settings of image encoder
            imageEncoderSettingsDialog.show();
        }
    }
}

/**
 "Convert" button is clicked in image encoder settings dialog.
*/
function __imageEncoderSettingsDialog_convert(encoderSettings) {
    try {
        var fileConverterParams = {
            fileId: _fileId,
            password: _filePassword,
            encoderSettings: encoderSettings,
            renderingSettings: _renderingSettings,
            pageSize: _pageSize
        };
        // start the asynchronous image file conversion
        _imageConverter.convertFileTo(fileConverterParams, _imageConverter_convertFileTo_success, _imageConverter_convertFileTo_error);
    }
    catch (e) {
        // show the error message
        alert(e.message);
    }
}

/**
 Image encoder settings dialog is closed.
*/
function __imageEncoderSettingsDialog_close(dialog) {
    _fileConverterControl.get_Items().removeItem(dialog);
}

/**
 File conversion process is started successfully.
*/
function _imageConverter_convertFileTo_success(data) {
}

/**
 File conversion process is NOT started.
*/
function _imageConverter_convertFileTo_error(data) {
    // show error message
    __showErrorMessage(data);

    document.getElementById("uploadFileButton").disabled = false;
    document.getElementById("convertButton").disabled = false;
}

/**
 File conversion is started.
*/
function __fileConversionStarted() {
    _fileConversionProgressDialog = new FileConversionProgressDialogJS(__abortFileConversion);
    // show dialog that display progress of file conversion
    _fileConversionProgressDialog.show();
}

/**
 File conversion is in progress.
*/
function __fileConversionProgress(event, status) {
    _fileConversionProgressDialog.updateProgress(status.description, status.progress);
}

/**
 File conversion is finished.
*/
function __fileConversionFinished(event, status) {
    // close the file conversion progress dialog
    _fileConversionProgressDialog.close();

    // if file conversion results exist
    if (status.resultFilesIds != null)
        // open dialog with file conversion results
        __openFileConversionResultDialog(status.resultFilesIds);
    // if error occurred
    if (status.errorMessage != null)
        // show error message
        __showErrorMessage(status);

    document.getElementById("uploadFileButton").disabled = false;
    document.getElementById("convertButton").disabled = false;
}

/**
 Sends an asynchronous request for aborting file conversion.
*/
function __abortFileConversion() {
    if (_imageConverter.get_IsActive())
        _imageConverter.abortConverting();
}



// === File conversion results ===

/**
 Opens a dialog with results of file conversion.
*/
function __openFileConversionResultDialog(fileIds) {
    var fileConversionResultDialog = new FileConversionResultDialogJS(fileIds);
    // show dialog that display result of file conversion
    fileConversionResultDialog.show();
}



// === Utils ===

/**
 Blocks the UI. 
 @param {string} text Message that describes why UI is blocked.
*/
function __blockUI(text) {
    _blockUiDialog = new BlockUiDialogJS(text);
}

/**
 Unblocks the UI.
*/
function __unblockUI() {
    if (_blockUiDialog != null) {
        _blockUiDialog.close();
        _blockUiDialog = null;
    }
}

/**
 Shows an error message.
 @param {object} data Information about error.
*/
function __showErrorMessage(data) {
    __unblockUI();
    new ErrorMessageDialogJS(data);
}

/**
 Returns application URL.
*/
function __getApplicationUrl() {
    var applicationUrl = window.location.toString();
    if (applicationUrl[applicationUrl.length - 1] != '/')
        applicationUrl = applicationUrl + '/';
    return applicationUrl;
}

/**
 Initialize HTML elements custom styles.
*/
function __initStyles() {
    document.getElementById("fileConverterDemoControl").style.textAlign = "center";
    document.getElementById("uploadFileButton").style.cursor = "pointer";
    document.getElementById("uploadImageFile").style.display = "none";
    document.getElementById("activeFileId").style.marginBottom = "0px";

    var convertButton = document.getElementById("convertButton");
    convertButton.style.width = "200px";
    convertButton.style.display = "inline-block";

    document.getElementById("customSettingsFieldset").style.border = "1px solid rgb(137,137,137)";
    document.getElementById("renderingSettingsHorizontalResolution").style.width = "100px";
    document.getElementById("renderingSettingsVerticalResolution").style.width = "100px";
    document.getElementById("pageSizeSelect").style.width = "100%";
    document.getElementById("progressbar").style.width = "0%";
}



// === Main ===

/**
 Main function.
*/
function __main() {
    __initStyles();

    // set the session identifier
    var hiddenSessionFieldElement = document.getElementById('hiddenSessionField');
    Vintasoft.Shared.WebImagingEnviromentJS.set_SessionId(hiddenSessionFieldElement.value);

    _fileConverterControl = new WebFileConverterDemoControlJS();

    // specify web services, which should be used in this demo

    Vintasoft.Shared.WebServiceJS.defaultFileService = new Vintasoft.Shared.WebServiceControllerJS(__getApplicationUrl() + "vintasoft/api/MyVintasoftFileApi");
    Vintasoft.Shared.WebServiceJS.defaultImageCollectionService = new Vintasoft.Shared.WebServiceControllerJS(__getApplicationUrl() + "vintasoft/api/MyVintasoftImageCollectionApi");
    Vintasoft.Shared.WebServiceJS.defaultImageService = new Vintasoft.Shared.WebServiceControllerJS(__getApplicationUrl() + "vintasoft/api/MyVintasoftImageApi");
    Vintasoft.Shared.WebServiceJS.defaultConverterService = new Vintasoft.Shared.WebServiceControllerJS(__getApplicationUrl() + "vintasoft/api/MyVintasoftImageConverterApi");

    // create the encoder settings for all supported encoders

    _bmpEncoderSettings = new Vintasoft.Imaging.WebBmpEncoderSettingsJS();
    _docxEncoderSettings = new Vintasoft.Imaging.WebDocxEncoderSettingsJS();
    _gifEncoderSettings = new Vintasoft.Imaging.WebGifEncoderSettingsJS();
    _htmlEncoderSettings = new Vintasoft.Imaging.WebHtmlEncoderSettingsJS();
    _jbig2EncoderSettings = new Vintasoft.Imaging.WebJbig2EncoderSettingsJS();
    _jpegEncoderSettings = new Vintasoft.Imaging.WebJpegEncoderSettingsJS();
    _jpeg2000EncoderSettings = new Vintasoft.Imaging.WebJpeg2000EncoderSettingsJS();
    _pbmEncoderSettings = new Vintasoft.Imaging.WebPbmEncoderSettingsJS();
    _pcxEncoderSettings = new Vintasoft.Imaging.WebPcxEncoderSettingsJS();
    _pdfEncoderSettings = new Vintasoft.Imaging.WebPdfEncoderSettingsJS();
    _pdfMrcEncoderSettings = new WebPdfMrcEncoderSettingsJS();
    _pngEncoderSettings = new Vintasoft.Imaging.WebPngEncoderSettingsJS();
    _psdEncoderSettings = new Vintasoft.Imaging.WebPsdEncoderSettingsJS();
    _svgEncoderSettings = new Vintasoft.Imaging.WebSvgEncoderSettingsJS();
    _tgaEncoderSettings = new Vintasoft.Imaging.WebTgaEncoderSettingsJS();
    _tiffEncoderSettings = new Vintasoft.Imaging.WebTiffEncoderSettingsJS();
    _webpEncoderSettings = new Vintasoft.Imaging.WebWebpEncoderSettingsJS();
    _xlsxEncoderSettings = new Vintasoft.Imaging.WebXlsxEncoderSettingsJS();

    // create image converter
    _imageConverter = new Vintasoft.Imaging.WebImageConverterJS(10);
    Vintasoft.Shared.subscribeToEvent(_imageConverter, "started", __fileConversionStarted);
    Vintasoft.Shared.subscribeToEvent(_imageConverter, "progress", __fileConversionProgress);
    Vintasoft.Shared.subscribeToEvent(_imageConverter, "finished", __fileConversionFinished);

    // subscribe to the events

    document.getElementById("uploadFileButton").onclick = function () { document.getElementById('uploadImageFile').click(); };
    document.getElementById("uploadImageFile").onchange = __uploadImageButtonClicked;
    document.getElementById("convertButton").onclick = __convertButtonClicked;
    window.addEventListener("beforeunload", __abortFileConversion);
}


// run main function
__main();
