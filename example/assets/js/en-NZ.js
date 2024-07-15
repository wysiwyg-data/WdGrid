/**
 * Localisation file for the Wysiwyg Data grid hooks
 * File: assets/js/en-NZ.js
 *
 * @author     WYSIWYG Data development
 * @copyright  (c) 2024
**/


/* Text strings used by all grids */
var vGenStrings =  {"noUUId":           "No unique row identifier has been provided.\nThe grid has been set in read-only mode.",
                    "badUUId":          "Invalid unique data record identifier.",
                    "noData":           "No data could be located.",
                    "confirm":          "This action cannot be undone. Proceed anyway?",
                    "searchOn":         "Search in",
                    "searchOnTt":       "Select a column to search on.",
                    "searchFor":        "for",
                    "searchForTt":      "Whatever is searched for...",
                    "filterOff":        "Remove filter.",
                    "totRecs":          "records in the system,",
                    "selRecs":          "records selected.",
                    "first":            "First grid page.",
                    "prev":             "Previous grid page.",
                    "offset":           "Number of records to display.",
                    "next":             "Next grid page.",
                    "last":             "Last grid page.",
                    "showHidden":       "Show more data.",
                    "hideHidden":       "Hide more data.",
                    "sort":             "Sort the list.",
                };

/* Text strings used by individual grids */
function js_grid_strings(pModule)
{
    switch(pModule)
    {
        case 'Test1':       // grid module name
            return {"gridName":         "Test One",
                    "incDels":          "Show deleted tests?",
                    "editRow":          "Edit/view this test.",
                    "newRow":           "Create a new test.",
                    "delRow":           "Delete this test.",
                    "recRow":           "Recover this test.",
                    "trashRow":         "Permanently delete (trash) this test.",
                    "gridColsLabels":   ['Created', 'String', 'Price'],             // grid column header labels
                    "hiddenColsLabels": ['Created:', 'String:'],                    // hidden column header labels
                    "searchIn":         {'aString':'String', 'aValue':'Price'}      // object of field:labels pairs for the 'Search in' dropdown
                };
        case 'Test2':
            return {"gridName":         "Test Two",
                    "incDels":          "Show deleted OtherTests?",
                    "editRow":          "Edit/view this OtherTest.",
                    "newRow":           "Create a new OtherTest.",
                    "delRow":           "Delete this OtherTest.",
                    "recRow":           "Recover this OtherTest.",
                    "trashRow":         "Permanently delete (trash) this OtherTest.",
                    "gridColsLabels":   ['Date Created', 'A String', 'The Price'],
                    "hiddenColsLabels": ['A String', 'The Price'],
                    "searchIn":         {'aString':'A String', 'aValue':'The Price'}
                };
    }
}

/* Locale-specific options */
var vLocaleOpts =  {"currency":      "NZD",
                    "currency_symb": "$",
                    "clock_type":    "12",
                };

/* Date formats used by the grid */
function js_wd_date_format(pModule, pUnixDate, pFormat, pLocale)
{
    var vDate        = new Date(pUnixDate);         // ensure pUnixDate is in milliseconds format as required by JS
    var vDateStr     = '';
    var vHrCycle     = 'h12';                       // Hour cycle. No cross-browser compatibility so hardcode for each localisation file
    var vHour12      = true;
    if (Number(vLocaleOpts.clock_type) == 24)
    {
        vHrCycle     = 'h23';
        vHour12      = false;
    }
    var vDateOptions = {"DayN1d": vDate.toLocaleDateString(pLocale, { day: 'numeric' }),
                        "DayN2d": vDate.toLocaleDateString(pLocale, { day: '2-digit' }),
                        "WDaySh": vDate.toLocaleDateString(pLocale, { weekday: 'short' }),
                        "WDayLo": vDate.toLocaleDateString(pLocale, { weekday: 'long' }),
                        "MthN1d": vDate.toLocaleDateString(pLocale, { month: 'numeric' }),
                        "MthN2d": vDate.toLocaleDateString(pLocale, { month: '2-digit' }),
                        "MthSsh": vDate.toLocaleDateString(pLocale, { month: 'short' }),
                        "MthSlo": vDate.toLocaleDateString(pLocale, { month: 'long' }),
                        "Year4d": vDate.toLocaleDateString(pLocale, { year: 'numeric' }),
                        "Year2d": vDate.toLocaleDateString(pLocale, { year: '2-digit' }),
                        "H1dM1d": vDate.toLocaleTimeString(pLocale, { hour: 'numeric', minute: 'numeric', hour12: vHour12, hourCycle: vHrCycle }),
                        "H1dM2d": vDate.toLocaleTimeString(pLocale, { hour: 'numeric', minute: '2-digit', hour12: vHour12, hourCycle: vHrCycle }),
                        "H2dM1d": vDate.toLocaleTimeString(pLocale, { hour: '2-digit', minute: 'numeric', hour12: vHour12, hourCycle: vHrCycle }),
                        "H2dM2d": vDate.toLocaleTimeString(pLocale, { hour: '2-digit', minute: '2-digit', hour12: vHour12, hourCycle: vHrCycle })
                    };

    // English ordinal suffix
    var vDayOrd  = 'th';
    switch(vDateOptions.DayN1d)
    {
        case '1':
        case '21':
        case '31':
            vDayOrd = 'st';
            break;
        case '2':
        case '22':
            vDayOrd = 'nd';
            break;
        case '3':
        case '23':
            vDayOrd = 'rd';
    }

    // These formats would be changed according to the locale
    switch(pFormat)
    {
        case 'long_date':
            vDateStr = vDateOptions.WDayLo + ' ' + vDateOptions.DayN1d + vDayOrd + ' ' + vDateOptions.MthSlo + ' ' + vDateOptions.Year4d;    // PHP: 'l jS F Y' -> Wednesday 10th January 2024
            break;
        case 'long_med_date':
            vDateStr = vDateOptions.DayN1d + vDayOrd + ' ' + vDateOptions.MthSsh + ' ' + vDateOptions.Year4d;    // PHP: 'jS M Y' -> 10th Jan 2024
            break;
        case 'medium_date':
            vDateStr = vDateOptions.DayN2d + '/' + vDateOptions.MthN2d + '/' + vDateOptions.Year4d;      // PHP: 'd/m/Y' -> 10/01/2024
            break;
        case 'short_date':
            vDateStr = vDateOptions.DayN1d + '/' + vDateOptions.MthN1d + '/' + vDateOptions.Year2d;      // PHP: 'j/n/y' -> 10/1/24
            break;
        case 'short_time':
            if (vLocaleOpts.clock_type == '12')
            {
                vDateStr = vDateOptions.H1dM2d;              // PHP: 'g:ia' -> 9:52 am
            }
            else
            {
                vDateStr = vDateOptions.H2dM2d;              // PHP: 'g:ia' -> 09:52
            }
            break;
        default:
            vDateStr = vDateOptions.Year4d + '-' + vDateOptions.MthN2d + '-' + vDateOptions.DayN2d;
    }

    return vDateStr;
}
