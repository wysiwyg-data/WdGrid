/**
 * Example Js functions to illustrate the Wysiwyg Data grid hooks
 * File: assets/js/example.js
 *
 * @author     WYSIWYG Data development
 * @copyright  (c) 2024
**/


/* Formatting the data in the hidden data section
 * Note: the presence of this hook function will override the default hidden data formatting.
 * Parameters exposed for processing:
 *   pModule        <string>    module name
 *   pHidDataCols   <object>    hidden data columns
 *   pHidDataLabels <object>    column labels
 *   pImagesPath    <string>    path to the icons
 * Return:
 *   HTML string starting with <table> and ending with </table>
 */
/*
function js_Test1_hidden_data(pModule, pHidDataCols, pHidDataLabels, pImagesPath)
{
    var vStr = '';
    if (pHidDataCols[1].length > 0)
    {
        vStr += '      <table>' +
                '          <tr>' +
                '              <td>' +
                '                  <p class="wd_DgHiddenText"><b>' + pHidDataLabels[1] + '&nbsp;</b></p>' +
                '              </td>' +
                '              <td>' +
                '                  <p class="wd_DgHiddenText"><b><a href="' + pHidDataCols[1] + '" target="_blank">' + pHidDataCols[1] + '&nbsp;<img src="' + pImagesPath + 'icon_external_link.png" border="0" alt=""></a></p></td>' +
                '              </td>' +
                '          </tr>' +
                '      </table>';
    }
    return vStr;
}
*/

/* Adding row styling
 * This is an example of how to set the response to a grid listener
 * Parameters exposed for processing:
 *   pModule        <string>    module name
 *   pStyles        <string>    existing style
 *   pRow           <object>    complete set of row values
 *   pDeleteCol     <string>    column name for the delete flag
 * Return:
 *   String of CSS style combinations
 */
function js_Test1_row_styles(pModule, pStyles, pRow, pDeleteCol)
{
/*
    if (pRow['dg_Code'].indexOf('191') >= 0)
    {
         return pStyles +'color:#ff0000;';
    }
*/
    return pStyles;
}


/* Grid row icons - module name: Test1
 * This is an example of how to set icons for a specific module
 * Two icons are set here: 'delete' and 'trash', with a blank space between the two
 * Parameters exposed for processing:
 *   pModule        <string>    module name
 *   pSecurity      <object>    security settings
 *   pDeleteCol     <string>    column name for the delete flag
 *   pRow           <object>    complete set of row values
 *   pGridStrings   <object>    set of strings such as tooltips
 * Return:
 *   JSON String of icon definitions: '[{"toolTip": "...", "iconName": "...", "action": "..."}, {"toolTip": "...", "iconName": "...", "action": "..."}, ...]'
 */
function js_Test1_set_row_icons(pModule, pSecurity, pDeleteCol, pRow, pGridStrings)
{
    // if not using the security option, simply omit the "if (<action> in pSecurity...)" condition(s) altogether

    var vIconsSetup = '[';

    // delete / recover icon (assuming the pDeleteCol is set, ie. not empty)
    if (pDeleteCol.length > 0)
    {
        if ('delete' in pSecurity && Number(pSecurity['delete']) == 1)  // omit if no security
        {
            // Deleting is allowed
            if (Number(pRow[pDeleteCol]) == 0)
            {
                // Not deleted so show delete icon
                vIconsSetup += '{"toolTip": "' + js_URL_encode(pGridStrings.delRow) + '", "iconName": "icon_delete.png", "action": "delete"},';
            }
            else
            {
                // Already deleted so show recover icon
                vIconsSetup += '{"toolTip": "' + js_URL_encode(pGridStrings.recRow) + '", "iconName": "icon_recover.png", "action": "recover"},';
            }
        }

        // only add a blank space if the above icon is present
        if (vIconsSetup.length > 2)
        {
            // blank space
            vIconsSetup += '{"toolTip": "", "iconName": "", "action": ""},';
        }

        // trash icon
        if ('trash' in pSecurity && Number(pSecurity['trash']) == 1)  // omit if no security
        {
            // Trashing is allowed
            if (Number(pRow[pDeleteCol]) == 0)
            {
                // Not yet deleted so no trashing icon
                vIconsSetup += '{"toolTip": "", "iconName": "", "action": ""},';
            }
            else
            {
                // Already deleted so show trashing icon
                vIconsSetup += '{"toolTip": "' + js_URL_encode(pGridStrings.trashRow) + '", "iconName": "icon_trash.png", "action": "trash"},';
            }
        }
    }

    if (vIconsSetup.length > 2)
    {
        return vIconsSetup.substring(0, (vIconsSetup.length - 1)) + ']';
    }
    else
    {
        return '';
    }
}


/* Response to a listener
 * This is an example of how to set the response to a grid listener
 * Parameters exposed for processing:
 *   pModule        <string>    module name
 *   pDbTable       <string>    DB table to update
 *   pUUIdCol       <string>    column name for the unique row identifier
 *   pRowId         <integer>   unique row identifier
 *   pDeleteCol     <string>    column name for the delete flag
 * Return:
 *   Void. Refresh grid if appropriate.
 */
// First: delete
function js_Test1_delete_row(pModule, pDbTable, pUUIdCol, pRowId, pDeleteCol, pGrid)
{
    js_Test1_delete_recover_row(pModule, pDbTable, pUUIdCol, pRowId, pDeleteCol, '1', pGrid);
}
// Another: recover
function js_Test1_recover_row(pModule, pDbTable, pUUIdCol, pRowId, pDeleteCol, pGrid)
{
    js_Test1_delete_recover_row(pModule, pDbTable, pUUIdCol, pRowId, pDeleteCol, '0', pGrid);
}
// And because 'delete' and 'recover' do pretty much the same thing (update a single column)
function js_Test1_delete_recover_row(pModule, pDbTable, pUUIdCol, pRowId, pDeleteCol, pVal, pGrid)
{
    var vUpdScript      = 'wd_UpdateData.php';
    var vUpdateColsVals = '[{"column": "' + pDeleteCol + '", "value": "' + pVal + '"}]';

    var vXhttp = new XMLHttpRequest();
    var vURL   = vUpdScript +
                    '?module=' + js_URL_encode(pModule) +
                    '&db_table=' + js_URL_encode(pDbTable) +
                    '&update_cols_vals=' + js_URL_encode(vUpdateColsVals) +
                    '&uuid_col=' + js_URL_encode(pUUIdCol) +
                    '&row_id=' + pRowId +
                    '&t=' + Math.random();

    vXhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var vContentType = this.getResponseHeader('Content-Type');
            if (vContentType.substring(0, 9) == 'text/html')
            {
                var vResp = JSON.parse(this.responseText);

                if (Object.hasOwn(vResp, 'dbError'))
                {
                    alert('DB error: ' + vResp.dbError);
                }
                else
                {
                    console.log('Updated: ' + vResp.theData);
                    pGrid.wg_RefreshGrid;        // refresh data
                }
            }
            else
            {
                alert('DB error: Invalid data!');
            }
        }
    };
    vXhttp.open('GET', vURL, true);
    vXhttp.send();
}
// Another: new
function js_Test1_new_row(pModule, pDbTable, pUUIdCol, pRowId, pDeleteCol, pGrid)
{
    alert('Stub for adding new grid row.');
}
// Another: edit
function js_Test1_edit_row(pModule, pDbTable, pUUIdCol, pRowId, pDeleteCol, pGrid)
{
    alert('Stub for editing grid row.');
}
// Another: trash
function js_Test1_trash_row(pModule, pDbTable, pUUIdCol, pRowId, pDeleteCol, pGrid)
{
    alert('Stub for trashing grid row.');
}






/* Support functions */
function js_URL_encode(pString)
{
    if (typeof pString == 'number')
    {
        return pString;
    }
    var vString = encodeURIComponent(pString.replace('/', '|'));
    var vMap = {
    '!': '%21',
    '*': '%2a',
    '+': '%2b',
    '"': '%22',
    "'": '%27',
    '(': '%28',
    ')': '%29'
    };
    return vString.replace(/[!*+"'()]/g, function(m) {return vMap[m];});
}

