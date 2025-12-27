/**
 A dialog that display progress of file conversion.
*/
FileConversionProgressDialogJS = function (abortFileConversionFunc) {

    function __dialogHidden() {
        abortFileConversionFunc();
        $('#conversionProgressDialog').off('hidden.bs.modal');
    }

    FileConversionProgressDialogJS.prototype.show = function () {
        $('#conversionProgressDialog').on('hidden.bs.modal', __dialogHidden);

        // show the file conversion progress dialog
        $('#conversionProgressDialog').modal('show');
    }

    FileConversionProgressDialogJS.prototype.updateProgress = function (description, progress) {
        // update progress value
        $("#conversionProgress").css('width', progress + '%');
    }

    FileConversionProgressDialogJS.prototype.close = function () {
        // set the progress to 100%
        $('#conversionProgress').css('width', '100%');
        $("#conversionProgressDialog").modal('hide');
    }

}
