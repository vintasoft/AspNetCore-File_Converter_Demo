/**
 A dialog that display result of file conversion.
*/
FileConversionResultDialogJS = function (fileIds) {

    FileConversionResultDialogJS.prototype.show = function () {
        // create the markup for file conversion result dialog
        var markup = __createMarkup(fileIds);

        $("#conversionResultHtml").empty();
        // set markup in file conversion result dialog
        $("#conversionResultHtml").append(markup);

        // show the file conversion result dialog
        $('#fileConversionResultDialog').modal('show');
    }

    /**
     Returns the markup for file conversion result dialog.
    */
    function __createMarkup(fileIds) {
        var markup = document.createElement("div");
        markup.style.overflow = "auto";
        // for each result URL
        for (var i = 0; i < fileIds.length; i++) {
            // add URL to the markup

            var fileId = fileIds[i];
            var filename = fileId.substr(fileId.lastIndexOf("/") + 1);

            var a = document.createElement("a");
            a.href = fileId;
            a.target = "_blank";
            a.download = filename;
            a.textContent = filename;

            var br = document.createElement("br");

            markup.append(a, br);
        }
        return markup;
    }

}
