/**
 A panel that contains page size settings.
*/
PageSizeSettingsPanelJS = function (parentId) {
    // CONST - centimeters in inch.
    var CM_IN_INCH_D = 2.54;



    /**
     Returns an page size settings.
    */
    PageSizeSettingsPanelJS.prototype.get_Settings = function () {
        var parentElement = document.getElementById(parentId);

        // if custom settings are used
        if (parentElement.querySelector("#defaultSettingsCheckbox").checked)
            return null;

        var select = parentElement.querySelector("#pageSizeSelect");
        if (select.value == "Undefined") {
            return null;
        }


        var widthMm = Number.parseInt(parentElement.querySelector("#widthPageSize").value);
        var heightMm = Number.parseInt(parentElement.querySelector("#heightPageSize").value);
        
        if (widthMm < 10 || widthMm > 10000 || heightMm < 10 || heightMm > 10000)
            throw new Error("Wrong parameters.");

        var resolution = __getResolution();

        if (select.value == "Custom") {
            _widthInPixels = __convertFromMmToPixels(widthMm, resolution.x);
            _heightInPixels = __convertFromMmToPixels(heightMm, resolution.y);
        }

        if (_widthInPixels == null || _heightInPixels == null) {
            __setPageSize(select.value, resolution);
        }

        return {
            width: Math.round(_widthInPixels),
            height: Math.round(_heightInPixels)
        };
    }

    /**
     Initialize logic of markup.
    */
    function __initialize(settings) {
        var parentElement = document.getElementById(parentId);

        var pageSizeSelect = parentElement.querySelector("#pageSizeSelect");
        Vintasoft.Shared.subscribeToEvent(pageSizeSelect, "change", __pageSizeSelect_change);
    }

    /**
     The "Page size" select is changed.
    */
    function __pageSizeSelect_change(event) {
        var selectedValue = event.target.value;
        var parentElement = document.getElementById(parentId);

        widthPageSize = parentElement.querySelector("#widthPageSize");
        heightPageSize = parentElement.querySelector("#heightPageSize");

        var resolution = __getResolution();

        __setPageSize(selectedValue, resolution);

        if (selectedValue == "Custom") {
            widthPageSize.disabled = false;
            heightPageSize.disabled = false;
        }
        else {
            widthPageSize.disabled = true;
            heightPageSize.disabled = true;
        }

        widthPageSize.value = Math.round(__convertFromPixelsToMm(_widthInPixels, resolution.x));
        heightPageSize.value = Math.round(__convertFromPixelsToMm(_heightInPixels, resolution.y));
    }

    /**
     Sets settings width and height, using page size type.
    */
    function __setPageSize(pageSizeType, resolution) {
        var horizontalResolution = resolution.x;
        var verticalResolution = resolution.y;

        switch (pageSizeType) {
            case "Undefined":
            case "Custom":
                return;

            case "A2":
                _widthInPixels = __convertFromMmToPixels(420, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(594, verticalResolution);
                break;
            case "A3":
                _widthInPixels = __convertFromMmToPixels(297, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(420, verticalResolution);
                break;
            case "A4":
                _widthInPixels = __convertFromMmToPixels(210, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(297, verticalResolution);
                break;
            case "A4Plus":
                _widthInPixels = __convertFromMmToPixels(210, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(330, verticalResolution);
                break;
            case "A5":
                _widthInPixels = __convertFromMmToPixels(148, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(210, verticalResolution);
                break;
            case "A6":
                _widthInPixels = __convertFromMmToPixels(105, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(148, verticalResolution);
                break;
            case "APlus":
                _widthInPixels = __convertFromMmToPixels(227, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(356, verticalResolution);
                break;
            case "B4":
            case "B4Envelope":
                _widthInPixels = __convertFromMmToPixels(250, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(353, verticalResolution);
                break;
            case "B5":
            case "B5Envelope":
                _widthInPixels = __convertFromMmToPixels(176, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(250, verticalResolution);
                break;
            case "B6Envelope":
                _widthInPixels = __convertFromMmToPixels(176, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(125, verticalResolution);
                break;
            case "BPlus":
                _widthInPixels = __convertFromMmToPixels(305, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(487, verticalResolution);
                break;
            case "C3Envelope":
                _widthInPixels = __convertFromMmToPixels(324, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(458, verticalResolution);
                break;
            case "C4Envelope":
                _widthInPixels = __convertFromMmToPixels(229, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(324, verticalResolution);
                break;
            case "C5Envelope":
                _widthInPixels = __convertFromMmToPixels(162, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(229, verticalResolution);
                break;
            case "C65Envelope":
                _widthInPixels = __convertFromMmToPixels(114, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(229, verticalResolution);
                break;
            case "C6Envelope":
                _widthInPixels = __convertFromMmToPixels(114, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(162, verticalResolution);
                break;
            case "CSheet":
                _widthInPixels = __convertFromInchesToPixels(17, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(22, verticalResolution);
                break;
            case "DLEnvelope":
                _widthInPixels = __convertFromMmToPixels(110, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(220, verticalResolution);
                break;
            case "DSheet":
                _widthInPixels = __convertFromInchesToPixels(22, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(34, verticalResolution);
                break;
            case "ESheet":
                _widthInPixels = __convertFromInchesToPixels(34, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(44, verticalResolution);
                break;
            case "Folio":
                _widthInPixels = __convertFromInchesToPixels(8.5, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(13, verticalResolution);
                break;
            case "InviteEnvelope":
                _widthInPixels = __convertFromMmToPixels(220, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(220, verticalResolution);
                break;
            case "IsoB4":
                _widthInPixels = __convertFromMmToPixels(250, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(353, verticalResolution);
                break;
            case "Ledger":
                _widthInPixels = __convertFromInchesToPixels(17, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(11, verticalResolution);
                break;
            case "Legal":
                _widthInPixels = __convertFromInchesToPixels(8.5, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(14, verticalResolution);
                break;
            case "Note":
            case "Letter":
                _widthInPixels = __convertFromInchesToPixels(8.5, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(11, verticalResolution);
                break;
            case "LetterPlus":
                _widthInPixels = __convertFromInchesToPixels(8.5, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(12.69, verticalResolution);
                break;
            case "Number10Envelope":
                _widthInPixels = __convertFromInchesToPixels(4.125, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(9.5, verticalResolution);
                break;
            case "Number11Envelope":
                _widthInPixels = __convertFromInchesToPixels(4.5, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(10.375, verticalResolution);
                break;
            case "Number12Envelope":
                _widthInPixels = __convertFromInchesToPixels(4.75, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(11, verticalResolution);
                break;
            case "Number14Envelope":
                _widthInPixels = __convertFromInchesToPixels(5, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(11.5, verticalResolution);
                break;
            case "Number9Envelope":
                _widthInPixels = __convertFromInchesToPixels(3.875, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(8.875, verticalResolution);
                break;
            case "PersonalEnvelope":
                _widthInPixels = __convertFromInchesToPixels(3.625, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(6.5, verticalResolution);
                break;
            case "Quarto":
                _widthInPixels = __convertFromMmToPixels(215, horizontalResolution);
                _heightInPixels = __convertFromMmToPixels(275, verticalResolution);
                break;
            case "Standard10x11":
                _widthInPixels = __convertFromInchesToPixels(10, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(11, verticalResolution);
                break;
            case "Standard10x14":
                _widthInPixels = __convertFromInchesToPixels(10, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(14, verticalResolution);
                break;
            case "Standard11x17":
                _widthInPixels = __convertFromInchesToPixels(11, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(17, verticalResolution);
                break;
            case "Standard15x11":
                _widthInPixels = __convertFromInchesToPixels(15, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(11, verticalResolution);
                break;
            case "Standard9x11":
                _widthInPixels = __convertFromInchesToPixels(9, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(11, verticalResolution);
                break;
            case "Statement":
                _widthInPixels = __convertFromInchesToPixels(5.5, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(8.5, verticalResolution);
                break;
            case "Tabloid":
                _widthInPixels = __convertFromInchesToPixels(11, horizontalResolution);
                _heightInPixels = __convertFromInchesToPixels(17, verticalResolution);
                break;
        }
    }

    function __convertFromMmToPixels(value, resolution) {
        return value / (CM_IN_INCH_D * 10) * resolution;
    }

    function __convertFromInchesToPixels(value, resolution) {
        return value * resolution;
    }

    function __convertFromPixelsToMm(value, resolution) {
        return value / resolution * (CM_IN_INCH_D * 10);
    }

    function __getResolution() {
        var parentElement = document.getElementById(parentId);
        var resX = parseFloat(parentElement.querySelector("#renderingSettingsHorizontalResolution").value);
        var resY = parseFloat(parentElement.querySelector("#renderingSettingsVerticalResolution").value);

        return { x: resX, y: resY };
    }

    var _widthInPixels;
    var _heightInPixels;

    var that = this;
    this._parentId = parentId;
    __initialize(this);
}