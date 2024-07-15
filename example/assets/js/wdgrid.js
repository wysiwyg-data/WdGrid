/**
 * wdgrid js data grid class 1.1
 *
 * File: wdgrid.js
 *
 * http://github.com/
 *
 * Author: Pierrick Parigot <pierrick@wysiwyg-data.co.nz>
 * Copyright (c) 2024 WISYWIG Data
 *
 * Licensed under the MIT licenses:
 *   http://www.opensource.org/licenses/mit-license.php
**/

/* Is the localisation file loaded */
if (typeof vGenStrings === 'undefined' || typeof vLocaleOpts === 'undefined')
{
    alert('The localisation file has not been loaded.\nThis file is needed to use WdGrid.');
    vGenStrings = {};
    vLocaleOpts = {};
}

class WdGrid
{

    constructor({
                // Default values which can be overriden when calling the class
                parent_element     = '',
                grid_element       = '',
                module             = '',
                security           = {},
                user_id            = '',
                themes_path        = '',
                app_theme          = '',
                locale             = 'en-NZ',
                currency_dec       = 2,
                float_dec          = 2,
                max_height         = '400',
                show_title         = true,
                show_deleted_opt   = true,
                show_new_opt       = false,
                warn_no_uuid       = true,
                uuid_col           = '',
                delete_col         = '',
                show_deleted       = '1',
                nav_type           = 'simple',
                offsets            = {"10": "10", "25": "25", "50": "50", "100": "100", "250": "250", "500": "500"},
                offset             = '10',
                query_cols         = '*',
                ajax_data_func     = '',
                db_table           = '',
                grid_cols          = [],
                grid_cols_type     = [],
                grid_cols_width    = [],
                grid_cols_align    = [],
                grid_labels_align  = [],
                sortable_cols      = [],
                order_by           = '0',
                order_dir          = '0',
                order_cols_main    = [],
                order_cols_other   = [],
                hidden_cols        = [],
                hidden_cols_type   = [],
                fixed_filter_on    = '-',     // for future use
                fixed_filter_opnd  = '=',     // for future use
                use_filters        = false    // for future use
            })
    {
        this.cDOMParentElement  = parent_element
        this.cGridDOMElement    = grid_element
        this.cSecurity          = security;
        this.cHasSecurity       = true;
        this.cUserId            = user_id;
        this.cModule            = module;
        this.cImagesPath        = themes_path + app_theme + '/images/';
        this.cLocale            = locale;
        this.cCurrencyDec       = currency_dec;
        this.cFloatDec          = float_dec;
        this.cMaxHeight         = Number(max_height);
        this.cShowTitle         = show_title;
        this.cShowDeletedOpt    = show_deleted_opt;
        this.cShowNewOpt        = show_new_opt;
        this.cWarnNoUuid        = warn_no_uuid;
        this.cUuidCol           = uuid_col;
        this.cHasUuidCol        = true;
        this.cDeleteCol         = delete_col;
        this.cShowDeleted       = Number(show_deleted);
        this.cNavType           = nav_type;
        this.cOffsets           = offsets;
        this.cOffset            = Number(offset);
        this.cQueryCols         = query_cols;
        this.cAjaxDataFunc      = ajax_data_func;
        this.DbTable            = db_table;
        this.cGridCols          = grid_cols;
        this.cGridColsType      = grid_cols_type;
        this.cGridColsWidth     = grid_cols_width;
        this.cGridColsAlign     = grid_cols_align;
        this.cGridLabelsAlign   = grid_labels_align;
        this.cSortableCols      = sortable_cols;
        this.cColCount          = grid_cols.length;
        this.cOrderBy           = Number(order_by);
        this.cOrderDir          = Number(order_dir);
        this.cOrderDirs         = ['ASC', 'DESC'];
        this.cOrderColsMain     = order_cols_main;
        this.cOrderColsOther    = order_cols_other;
        this.cHiddenCols        = hidden_cols;
        this.cHiddenColsType    = hidden_cols_type;
        this.cHidColCount       = hidden_cols.length;
        this.cFixedFilterOn     = fixed_filter_on;
        this.cFixedFilterOpnd   = fixed_filter_opnd;
        this.cUseFilters        = use_filters;
        this.cImgDelete         = 'icon_delete.png';
        this.cImgCheck          = 'check_checked.png';
        this.cImgUnCheck        = 'check_unchecked.png';
        this.cImgSortAsc        = 'icon_sort_asc.png';
        this.cImgSortDsc        = 'icon_sort_desc.png';
        this.cImgSortNone       = 'icon_sort_none.png';
        this.cImgNew            = 'icon_new.png';
        this.cImgSDIdle         = 'slide-down_idle.png';
        this.cImgSDHover        = 'slide-down_hover.png';
        this.cImgSUIdle         = 'slide-up_idle.png';
        this.cImgSUHover        = 'slide-up_hover.png';
        this.cImgFIdle          = 'icon_first_idle.png';
        this.cImgFHover         = 'icon_first_hover.png';
        this.cImgPIdle          = 'icon_prev_idle.png';
        this.cImgPHover         = 'icon_prev_hover.png';
        this.cImgNIdle          = 'icon_next_idle.png';
        this.cImgNHover         = 'icon_next_hover.png';
        this.cImgLIdle          = 'icon_last_idle.png';
        this.cImgLHover         = 'icon_last_hover.png';
        this.cSearchOn          = '';
        this.cSearchFor         = '';
        this.cDataWidth         = 0;
        this.cMaxWidth          = 0;
        this.cStartRow          = 0;
        this.cTotRecs           = 0;
        this.cSelRecs           = 0;
        this.cNavAction         = 'first';
        this.cFixedFilterWhat   = '-';
        this.cSearchWhat        = '-';
        this.cGridHTML          = '';
        this.cStrings           = js_grid_strings(module);

        if (this.cUuidCol == '')
        {
            this.cHasUuidCol = false;
        }
        if (this.cGridLabelsAlign.length == 0)
        {
            this.cGridLabelsAlign = this.cGridColsAlign;
        }
    }


    /**
     * Grid main routine
     */

    get wg_NewGrid()
    {
        try
        {
            /* Check necessary stuff is present */
            this.wg_check_grid();

            /* Set the grid width */
            this.wg_set_grid_width();

            /* Render the grid HTML */
            this.wg_render_grid_html();

            /* Render the column headers HTML */
            this.wg_do_col_headers();

            /* Initialise the grid (events, checkbox, etc) */
            if (this.cDeleteCol != '' && this.cShowDeletedOpt == true)
            {
                this.wg_init_checkbox('wd_Dg' + this.cModule + 'ShowDelsTrigger');
            }

            /* Set the query columns to send to the database engine */
            this.wg_set_query_cols();

            /* Get the data */
            this.wg_refresh_grid_data();

            /* Set the grid listeners for the various options */
            this.wg_set_grid_listeners();

        }
        catch(e)
        {
            console.log(e);
        }
    }

    /**
     * Grid refresh
     */

    get wg_RefreshGrid()
    {
        try
        {
            this.wg_refresh_grid_data();
        }
        catch(e)
        {
            console.log(e);
        }
    }



    /**
     * All the Grid Methods
     */

    /* Initialise the grid (events, checkbox, etc) */
    wg_check_grid()
    {
        // check unique row identifier
        if (this.cHasUuidCol == false && this.cWarnNoUuid == true)
        {
            alert(vGenStrings.noUUId);
        }
        // check security settings
        if (Object.keys(this.cSecurity).length == 0)
        {
            // No security
            this.cSecurity    = {};
            this.cHasSecurity = false;
        }
        else
        {
            this.cHasSecurity = true;
        }
    }

    /* Set the grid width */
    wg_set_grid_width()
    {
        var vResWidth = 150; // space reserved for the icons on each row

        for (var i = 0; i < this.cColCount; i++)
        {
            this.cDataWidth += Number(this.cGridColsWidth[i]);
        }
        this.cMaxWidth = this.cDataWidth + vResWidth;
    }

    /* Set the query columns to send to the database engine */
    wg_set_query_cols()
    {
        var vQueryCols = this.cQueryCols;
        if (typeof vQueryCols == 'object')
        {
            if (this.cUuidCol != '')
            {
                vQueryCols.push(this.cUuidCol);
            }
            if (this.cDeleteCol != '')
            {
                vQueryCols.push(this.cDeleteCol);
            }
        }
        this.cQueryCols = vQueryCols;
    }

    /* Render the grid HTML */
    wg_render_grid_html()
    {
        var vStr = '<div class="wd_DgWrapper" style="width:' + this.cMaxWidth + 'px;height:' + this.cMaxHeight + 'px;">';

        // Grid title
        if (this.cShowTitle == true)
        {
            vStr += '    <div class="wd_DgTitle">';
            if (Object.keys(this.cStrings.searchIn).length > 0)
            {
                vStr += '        <div class="wd_DgFlexSubDiv-f">' +
                        '            <p class="wd_DgTitleText">' + vGenStrings.searchOn + '</p>' +
                        '        </div>' +
                        '        <div class="wd_DgFlexSubDiv-f">' +
                        '            <p class="wd_DgTitleInput"><select id="wd_Dg' + this.cModule + 'SearchOn" size="1" class="wd_DgInputBox" title="' + vGenStrings.searchOnTt + '">' + this.wg_do_select_options(this.cStrings.searchIn) + '</select></p>' +
                        '        </div>' +
                        '        <div class="wd_DgFlexSubDiv-f">' +
                        '            <p class="wd_DgTitleText">' + vGenStrings.searchFor + '</p>' +
                        '        </div>' +
                        '        <div class="wd_DgFlexSubDiv-f">' +
                        '            <p class="wd_DgTitleInput"><input type="text" value="" id="wd_Dg' + this.cModule + 'SearchFor" maxlength="50" style="width:150px;" size="50" class="wd_DgInputBox" title="' + vGenStrings.searchForTt + '" /></p>' +
                        '        </div>' +
                        '        <div class="wd_DgFlexSubDiv-f">' +
                        '            <span id="wd_Dg' + this.cModule + 'RemoveFilterTrigger">' +
                        '                <a href="#" title="' + vGenStrings.filterOff + '">' +
                        '                    <img src="' + this.cImagesPath + this.cImgDelete + '" alt="remove filter" class="wd_DgNoFilterImg" />' +
                        '                </a>' +
                        '            </span>' +
                        '        </div>';
            }
            if (this.cDeleteCol == '' || this.cShowDeletedOpt == false)
            {
                vStr += '        <div class="wd_DgFlexSubDiv-gs">&nbsp;</div>';
            }
            else
            {
                vStr += '        <div class="wd_DgFlexSubDiv-gs">' +
                        '            <p class="wd_DgTitleText wd_DgShowDel">' + this.cStrings.incDels + '&nbsp;<input type="hidden" name="wd_Dg' + this.cModule + 'ShowDels" id="wd_Dg' + this.cModule + 'ShowDels" value="" /></p>' +
                        '        </div>' +
                        '        <div class="wd_DgFlexSubDiv-f">' +
                        '            <a href="#">' +
                        '               <p class="wd_DgTitleImg"><img src="' + this.cImagesPath + this.cImgUnCheck + '" id="wd_Dg' + this.cModule + 'ShowDelsTrigger" alt="" /></p>' +
                        '            </a>' +
                        '        </div>';
            }
            vStr += '    </div>';
        }

        // Grid header
        vStr += '    <div class="wd_DgHeader">' +
                this.wg_do_blank_column(15) +
                '        <div id="wd_Dg' + this.cModule + 'ColHeader" class="wd_DgDataHeader" style="width:' + this.cDataWidth + 'px;">' +
                '        </div>';

        vStr += this.wg_do_blank_column(110);

        if (this.cHasSecurity == false || (this.cHasSecurity == true && 'new' in this.cSecurity && Number(this.cSecurity['new']) == 1))
        {
            if (this.cHasUuidCol == true && this.cShowNewOpt == true)
            {
                vStr += '        <div class="wd_DgFlexSubDiv-f wd_DgNewImgDiv">' +
                        '            <a href="#" title="' + this.cStrings.newRow + '">' +
                        '                <p><img src="' + this.cImagesPath + this.cImgNew + '" id="wd_Dg' + this.cModule + 'AddNewImgTrigger" alt="new" /></p>' +
                        '            </a>' +
                        '        </div>';
            }
            else
            {
                vStr += this.wg_do_blank_column(20);
            }
        }
        else
        {
            vStr += this.wg_do_blank_column(20);
        }
        vStr += '    </div>';

        // Grid data area
        var vExtra = 72; // header and footer divs heights
        if (this.cDeleteCol != '' && (this.cShowTitle == true || this.cShowDeletedOpt == true))
        {
            vExtra = 112;
        }
        vStr += '    <div id="wd_Dg' + this.cModule + 'DataDiv" class="wd_DgTable" style="height:' + (this.cMaxHeight - vExtra) + 'px;">' +
                '        <div id="wd_Dg' + this.cModule + 'DataTable" style="width:' + (this.cMaxWidth - 15) + 'px;">' +
                '        </div>' +
                '    </div>' +

        // Grid footer
                '    <div class="wd_DgFooter">' +
                '        <div class="wd_DgFlexSubDiv-gs">' +
                '            <p class="wd_DgFooterText">' +
                '                <span id="wd_Dg' + this.cModule + 'TotRecsSpan"></span> ' + vGenStrings.totRecs + ' <span id="wd_Dg' + this.cModule + 'SelRecsSpan"></span> ' + vGenStrings.selRecs +
                '            </p>' +
                '        </div>' +
                '        <div class="wd_DgFlexSubDiv-f" id="wd_Dg' + this.cModule + 'NavDiv">' +
                '            <div class="wd_NavControls">' +
                this.wg_do_simple_nav() +
                '            </div>' +
                '        </div>' +
                '    </div>';

        vStr += '</div>';

        var vGridDiv = document.createElement('div');
        vGridDiv.setAttribute('id', this.cGridDOMElement);
        vGridDiv.innerHTML = DOMPurify.sanitize(vStr);
        document.getElementById(this.cDOMParentElement).appendChild(vGridDiv);

    }

    /* Create separate function for the header HTML so it can be called independantly to refresh sort icons */
    wg_do_col_headers()
    {
        var vStr = '';
        for (var i = 0; i < this.cColCount; i++)
        {
            var vPStyle   = '';
            if (this.cGridLabelsAlign[i] != '')
            {
                vPStyle = 'style="text-align:' + this.cGridLabelsAlign[i] + ';"';
            }
            if (this.cSortableCols[i] == true)
            {
                vStr += '            <div class="wd_DgFlexSubDiv-f wd_DgSortImgDiv">';
                if (i == this.cOrderBy)
                {
                    if (this.cOrderDir == 0)
                    {
                        var vImg = this.cImagesPath + this.cImgSortAsc;
                        vStr += '                <p><img id="wd_Dg' + this.cModule + 'SortImg' + i + '" src="' + vImg + '" alt="sort" /></p>';
                    }
                    else
                    {
                        var vImg = this.cImagesPath + this.cImgSortDsc;
                        vStr += '                <p><img id="wd_Dg' + this.cModule + 'SortImg' + i + '" src="' + vImg + '" alt="sort" /></p>';
                    }
                }
                else
                {
                    var vImg = this.cImagesPath + this.cImgSortNone;
                    vStr += '                <p><img id="wd_Dg' + this.cModule + 'SortImg' + i + '" src="' + vImg + '" alt="sort" /></p>';
                }
                vStr += '            </div>' +
                        '            <div class="wd_DgFlexSubDiv-f" style="width:' + (Number(this.cGridColsWidth[i]) - 14) + 'px;">' +
                        '                <p class="wd_DgHeaderText" ' + vPStyle + '>' +
                        '                    <span class="wd_Dg' + this.cModule + 'HeaderTrigger">' +
                        '                        <a href="#" data-colId="' + i + '" title="' + vGenStrings.sort + '">' + this.cStrings.gridColsLabels[i] + '</a>' +
                        '                    </span>' +
                        '                </p>';
            }
            else
            {
                vStr += '            <div class="wd_DgFlexSubDiv-f" style="width:' + this.cGridColsWidth[i] + 'px;">' +
                        '                <p class="wd_DgHeaderText" ' + vPStyle + '">' +
                        '                    <span class="wd_Dg' + this.cModule + 'HeaderTrigger">' +
                        '                        ' + this.cStrings.gridColsLabels[i] +
                        '                    </span>' +
                        '                </p>';
            }
            vStr += '            </div>';
        }
        document.getElementById('wd_Dg' + this.cModule + 'ColHeader').innerHTML = DOMPurify.sanitize(vStr);
    }

    /* Create a 'simple' video controls based navigation system */
    wg_do_simple_nav()
    {

        var vNav = '          <div class="wd_DgVideoImgDiv">' +
                '              <div id="wd_Dg' + this.cModule + 'LeftNavDivActive" class="wd_DgNavImg">' +
                '                  <a href="#" title="' + vGenStrings.first + '">' +
                '                      <img src="' + this.cImagesPath + this.cImgFIdle + '" id="wd_Dg' + this.cModule + 'NavFirstImgTrigger" class="wd_Dg' + this.cModule + 'NavImgTrigger" data-action="first" alt="first" />' +
                '                  </a>' +
                '                  <a href="#" title="' + vGenStrings.prev + '">' +
                '                      <img src="' + this.cImagesPath + this.cImgPIdle + '" id="wd_Dg' + this.cModule + 'NavPrevImgTrigger" class="wd_Dg' + this.cModule + 'NavImgTrigger" data-action="prev" alt="prev" />' +
                '                  </a>' +
                '              </div>' +
                '              <div id="wd_Dg' + this.cModule + 'LeftNavDiv" class="wd_DgNavImg">' +
                '                  <img src="' + this.cImagesPath + this.cImgFIdle + '" alt="first" class="wd_DgOpacity5" />' +
                '                  <img src="' + this.cImagesPath + this.cImgPIdle + '" alt="prev" class="wd_DgOpacity5" />' +
                '              </div>' +
                '          </div>' +
                '          <div class="wd_DgOffsetsDiv">' +
                '              <p class="wd_DgFooterText">' +
                '                  <span id="wd_Dg' + this.cModule + 'OffsetDropDown" title="' + vGenStrings.offset + '">' +
                this.wg_do_offsets() +
                '                  </span>' +
                '              </p>' +
                '          </div>' +
                '          <div class="wd_DgVideoImgDiv">' +
                '              <div id="wd_Dg' + this.cModule + 'RightNavDivActive" class="wd_DgNavImg">' +
                '                  <a href="#" title="' + vGenStrings.next + '">' +
                '                      <img src="' + this.cImagesPath + this.cImgNIdle + '" id="wd_Dg' + this.cModule + 'NavNextImgTrigger" class="wd_Dg' + this.cModule + 'NavImgTrigger" data-action="next" alt="next" />' +
                '                  </a>' +
                '                  <a href="#" title="' + vGenStrings.last + '">' +
                '                      <img src="' + this.cImagesPath + this.cImgLIdle + '" id="wd_Dg' + this.cModule + 'NavLastImgTrigger" class="wd_Dg' + this.cModule + 'NavImgTrigger" data-action="last" alt="last" />' +
                '                  </a>' +
                '              </div>' +
                '              <div id="wd_Dg' + this.cModule + 'RightNavDiv" class="wd_DgNavImg">' +
                '                  <img src="' + this.cImagesPath + this.cImgNIdle + '" alt="next" class="wd_DgOpacity5" />' +
                '                  <img src="' + this.cImagesPath + this.cImgLIdle + '" alt="last" class="wd_DgOpacity5" />' +
                '              </div>' +
                '          </div>';

        return vNav;
    }

    /* Update the footer with number of data rows and nav buttons */
    wg_update_grid_footer()
    {
        document.getElementById('wd_Dg' + this.cModule + 'TotRecsSpan').textContent = this.cTotRecs;
        document.getElementById('wd_Dg' + this.cModule + 'SelRecsSpan').textContent = this.cSelRecs;
        if (this.cTotRecs <= this.cOffset || this.cSelRecs <= this.cOffset)
        {
            document.getElementById('wd_Dg' + this.cModule + 'NavDiv').style.display = 'none';
        }
        else
        {
            var vOffsets = this.wg_do_offsets();
            this.wg_do_nav();
            document.getElementById('wd_Dg' + this.cModule + 'OffsetDropDown').innerHTML = DOMPurify.sanitize(vOffsets);
            document.getElementById('wd_Dg' + this.cModule + 'NavDiv').style.display = '';
        }
    }

    /* Build the offsets dropdown */
    wg_do_offsets()
    {
        var vOffsetDd = '<select id="wd_Dg' + this.cModule + 'RecOffset" size="1" class="wd_DgInputBox">' +
                        this.wg_do_select_options(this.cOffsets, 'val', this.cOffset) +
                        '</select>';
        return vOffsetDd;
    }

    /* Pagination (here using video-type controls) */
    wg_do_nav()
    {
        switch(this.cNavAction)
        {
            case 'first':
                this.cStartRow = 0;
                document.getElementById('wd_Dg' + this.cModule + 'LeftNavDivActive').style.display = 'none';
                document.getElementById('wd_Dg' + this.cModule + 'LeftNavDiv').style.display = '';
                document.getElementById('wd_Dg' + this.cModule + 'RightNavDivActive').style.display = '';
                document.getElementById('wd_Dg' + this.cModule + 'RightNavDiv').style.display = 'none';
                break;
            case 'prev':
                var vStart = this.cStartRow - this.cOffset;
                if (vStart <= 0)
                {
                    this.cStartRow = 0;
                    document.getElementById('wd_Dg' + this.cModule + 'LeftNavDivActive').style.display = 'none';
                    document.getElementById('wd_Dg' + this.cModule + 'LeftNavDiv').style.display = '';
                    document.getElementById('wd_Dg' + this.cModule + 'RightNavDivActive').style.display = '';
                    document.getElementById('wd_Dg' + this.cModule + 'RightNavDiv').style.display = 'none';
                }
                else
                {
                    this.cStartRow = vStart;
                    document.getElementById('wd_Dg' + this.cModule + 'LeftNavDivActive').style.display = '';
                    document.getElementById('wd_Dg' + this.cModule + 'LeftNavDiv').style.display = 'none';
                    document.getElementById('wd_Dg' + this.cModule + 'RightNavDivActive').style.display = '';
                    document.getElementById('wd_Dg' + this.cModule + 'RightNavDiv').style.display = 'none';
                }
                break;
            case 'next':
                var vStart = this.cStartRow + this.cOffset;
                if (vStart >= this.cSelRecs)
                {
                    this.cStartRow = this.cSelRecs - this.cOffset;
                    document.getElementById('wd_Dg' + this.cModule + 'LeftNavDivActive').style.display = '';
                    document.getElementById('wd_Dg' + this.cModule + 'LeftNavDiv').style.display = 'none';
                    document.getElementById('wd_Dg' + this.cModule + 'RightNavDivActive').style.display = 'none';
                    document.getElementById('wd_Dg' + this.cModule + 'RightNavDiv').style.display = '';
                }
                else
                {
                    this.cStartRow = vStart;
                    document.getElementById('wd_Dg' + this.cModule + 'LeftNavDivActive').style.display = '';
                    document.getElementById('wd_Dg' + this.cModule + 'LeftNavDiv').style.display = 'none';
                    document.getElementById('wd_Dg' + this.cModule + 'RightNavDivActive').style.display = '';
                    document.getElementById('wd_Dg' + this.cModule + 'RightNavDiv').style.display = 'none';
                }
                break;
            case 'last':
                this.cStartRow = this.cSelRecs - this.cOffset;
                document.getElementById('wd_Dg' + this.cModule + 'LeftNavDivActive').style.display = '';
                document.getElementById('wd_Dg' + this.cModule + 'LeftNavDiv').style.display = 'none';
                document.getElementById('wd_Dg' + this.cModule + 'RightNavDivActive').style.display = 'none';
                document.getElementById('wd_Dg' + this.cModule + 'RightNavDiv').style.display = '';
                break;
        }
        this.cNavAction = '';
    }

    /* Set the grid listeners for the various options */
    wg_set_grid_listeners()
    {
        var vClassRef = this;

        // Grid title
        if (vClassRef.cShowTitle == true)
        {
            if (Object.keys(vClassRef.cStrings.searchIn).length > 0)
            {
                document.getElementById('wd_Dg' + vClassRef.cModule + 'SearchOn').addEventListener('change', function(e)
                {
                    var vElId = 'wd_Dg' + vClassRef.cModule + 'SearchFor';
                    document.getElementById(vElId).value = '';
                    document.getElementById(vElId).focus();
                });
                document.getElementById('wd_Dg' + vClassRef.cModule + 'SearchFor').addEventListener('blur', function(e)
                {
                    vClassRef.wg_build_filter();
                });
                document.getElementById('wd_Dg' + vClassRef.cModule + 'RemoveFilterTrigger').addEventListener('click', function(e)
                {
                    vClassRef.wg_remove_filter();
                });
            }
            if (vClassRef.cDeleteCol != '' && vClassRef.cShowDeletedOpt == true)
            {
                var vElId = 'wd_Dg' + vClassRef.cModule + 'ShowDelsTrigger';
                document.getElementById(vElId).addEventListener('click', function(e)
                {
                    vClassRef.wg_set_checkbox(vElId);
                    vClassRef.cStartRow = 0;
                    vClassRef.wg_refresh_grid_data();
                });
            }
        }

        // Grid header stuff
        var vHeaderDiv = document.getElementById('wd_Dg' + vClassRef.cModule + 'ColHeader');
        vHeaderDiv.addEventListener('click', function(e)
        {
            vClassRef.wg_set_sort_col(e.target.dataset.colid);
        });
        if (vClassRef.cHasSecurity == false || (vClassRef.cHasSecurity == true && 'new' in vClassRef.cSecurity && Number(vClassRef.cSecurity['new']) == 1))
        {
            if (vClassRef.cHasUuidCol == true && vClassRef.cShowNewOpt == true)
            {
                document.getElementById('wd_Dg' + vClassRef.cModule + 'AddNewImgTrigger').addEventListener('click', function(e)
                {
                    vClassRef.wg_db_hook('new');
                });
            }
        }

        // Grid footer stuff
        var vNavFirstImgTrigger = document.getElementById('wd_Dg' + vClassRef.cModule + 'NavFirstImgTrigger');
        vNavFirstImgTrigger.addEventListener('mouseenter', function(e)
        {
            vNavFirstImgTrigger.setAttribute('src', (vClassRef.cImagesPath + vClassRef.cImgFHover));
        });
        vNavFirstImgTrigger.addEventListener('mouseout', function(e)
        {
            vNavFirstImgTrigger.setAttribute('src', (vClassRef.cImagesPath + vClassRef.cImgFIdle));
        });
        var vNavPrevImgTrigger = document.getElementById('wd_Dg' + vClassRef.cModule + 'NavPrevImgTrigger');
        vNavPrevImgTrigger.addEventListener('mouseenter', function(e)
        {
            vNavPrevImgTrigger.setAttribute('src', (vClassRef.cImagesPath + vClassRef.cImgPHover));
        });
        vNavPrevImgTrigger.addEventListener('mouseout', function(e)
        {
            vNavPrevImgTrigger.setAttribute('src', (vClassRef.cImagesPath + vClassRef.cImgPIdle));
        });
        var vNavNextImgTrigger = document.getElementById('wd_Dg' + vClassRef.cModule + 'NavNextImgTrigger');
        vNavNextImgTrigger.addEventListener('mouseenter', function(e)
        {
            vNavNextImgTrigger.setAttribute('src', (vClassRef.cImagesPath + vClassRef.cImgNHover));
        });
        vNavNextImgTrigger.addEventListener('mouseout', function(e)
        {
            vNavNextImgTrigger.setAttribute('src', (vClassRef.cImagesPath + vClassRef.cImgNIdle));
        });
        var vNavLastImgTrigger = document.getElementById('wd_Dg' + vClassRef.cModule + 'NavLastImgTrigger');
        vNavLastImgTrigger.addEventListener('mouseenter', function(e)
        {
            vNavLastImgTrigger.setAttribute('src', (vClassRef.cImagesPath + vClassRef.cImgLHover));
        });
        vNavLastImgTrigger.addEventListener('mouseout', function(e)
        {
            vNavLastImgTrigger.setAttribute('src', (vClassRef.cImagesPath + vClassRef.cImgLIdle));
        });

        var vNavImgTrigger = document.querySelectorAll('.wd_Dg' + vClassRef.cModule + 'NavImgTrigger');
        for (var i = 0; i < vNavImgTrigger.length; i++)
        {
            vNavImgTrigger[i].addEventListener('click', function(e)
            {
                vClassRef.cNavAction = e.target.dataset.action;
                vClassRef.wg_do_nav();
                vClassRef.wg_refresh_grid_data();
            });
        }

        var vRecOffsetSpan = document.getElementById('wd_Dg' + vClassRef.cModule + 'OffsetDropDown');
        var vRecOffset = document.getElementById('wd_Dg' + vClassRef.cModule + 'RecOffset');
        if (!!vRecOffset == true)
        {
            vRecOffsetSpan.addEventListener('change', function(e)
            {
                if (e.target.id == 'wd_Dg' + vClassRef.cModule + 'RecOffset')
                {
                    vClassRef.cOffset = Number(e.target.value);
                    vClassRef.wg_refresh_grid_data();
                }
            });
        }

        // Grid lines stuff (only works when there is data in the grid) :-)
        // highlight the show/hide icon for the hidden data div
        var vDataTable = document.getElementById('wd_Dg' + vClassRef.cModule + 'DataTable');
        if (vClassRef.cHidColCount > 0)
        {
            vDataTable.addEventListener('mouseover', function(e)
            {

                var vIdKey = e.target.dataset.idkey;
                var vElId  = e.target.id;
                if (vIdKey != undefined && vElId == 'wd_Dg' + vClassRef.cModule + 'ShowHideDivImg' + vIdKey)
                {
                    var vAction = e.target.dataset.action;
                    if (vAction == 'show')
                    {
                        var vImage = vClassRef.cImgSDHover;
                    }
                    else if (vAction == 'hide')
                    {
                        var vImage = vClassRef.cImgSUHover;
                    }
                    document.getElementById('wd_Dg' + vClassRef.cModule + 'ShowHideDivImg' + vIdKey).setAttribute('src', (vClassRef.cImagesPath + vImage));
                }
            });
            vDataTable.addEventListener('mouseout', function(e)
            {

                var vIdKey = e.target.dataset.idkey;
                var vElId  = e.target.id;
                if (vIdKey != undefined && vElId == 'wd_Dg' + vClassRef.cModule + 'ShowHideDivImg' + vIdKey)
                {
                    var vAction = e.target.dataset.action;
                    if (vAction == 'show')
                    {
                        var vImage = vClassRef.cImgSDIdle;
                    }
                    else if (vAction == 'hide')
                    {
                        var vImage = vClassRef.cImgSUIdle;
                    }
                    document.getElementById('wd_Dg' + vClassRef.cModule + 'ShowHideDivImg' + vIdKey).setAttribute('src', (vClassRef.cImagesPath + vImage));
                }
            });
        }
        // click listener for the hidden data div and the end of line icons
        vDataTable.addEventListener('click', function(e)
        {
            var vIdKey  = e.target.dataset.idkey;
            var vAction = e.target.dataset.action;
            var vElId   = e.target.id;
            if (vIdKey != undefined)
            {
                // hidden data div
                if (vElId == 'wd_Dg' + vClassRef.cModule + 'ShowHideDivImg' + vIdKey)
                {
                    var vTrigId = 'wd_Dg' + vClassRef.cModule + 'ShowHideDivImg' + vIdKey;
                    var vAction = document.getElementById(vTrigId).dataset.action;
                    vClassRef.wg_show_hide_div(vAction, vTrigId, vClassRef.cImgSUIdle, vClassRef.cImgSDIdle, ('wd_Dg' + vClassRef.cModule + 'HiddenDiv' + vIdKey), vIdKey);
                }
                // edit line
                if (vClassRef.cHasSecurity == false || (vClassRef.cHasSecurity == true && 'edit' in vClassRef.cSecurity && Number(vClassRef.cSecurity['edit']) == 1))
                {
                    if (e.target.parentNode.id == 'wd_Dg' + vClassRef.cModule + 'EditSpanRow' + vIdKey)
                    {
                        vClassRef.wg_db_hook('edit', vIdKey);
                    }
                }
                // end of line icons
                if (vElId == 'wd_Dg' + vClassRef.cModule + 'RowImg' + vAction + vIdKey)
                {
                    vClassRef.wg_db_hook(vAction, vIdKey);
                }
            }
        });

    }

    /* Build the data filter */
    wg_build_filter()
    {
        this.cSearchOn  = document.getElementById('wd_Dg' + this.cModule + 'SearchOn').value;
        this.cSearchFor = document.getElementById('wd_Dg' + this.cModule + 'SearchFor').value;
        if (this.cSearchOn != '' && this.cSearchOn != '0' && this.cSearchOn != '-' && this.cSearchFor != ''  && this.cSearchFor != '0' && this.cSearchFor != '-')
        {
            this.cStartRow = 0;
            this.wg_refresh_grid_data();
        }
    }

    /* Remove previously set filter */
    wg_remove_filter()
    {
        this.cSearchOn  = '';
        this.cSearchFor = '';
        this.cStartRow  = 0;
        document.getElementById('wd_Dg' + this.cModule + 'SearchOn').value  = Object.keys(this.cStrings.searchIn)[0];
        document.getElementById('wd_Dg' + this.cModule + 'SearchFor').value = '';
        this.wg_refresh_grid_data();
    }

    /* Sort grid data by specific column(s) */
    wg_set_sort_col(pColNum)
    {
        var vPrevSort = this.cOrderBy;
        var vPrevDir  = this.cOrderDir;

        if (vPrevDir == 0)
        {
            this.cOrderDir = 1;
            document.getElementById('wd_Dg' + this.cModule + 'SortImg' + pColNum).setAttribute('src', (this.cImagesPath + this.cImgSortDsc));
        }
        else
        {
            this.cOrderDir = 0;
            document.getElementById('wd_Dg' + this.cModule + 'SortImg' + pColNum).setAttribute('src', (this.cImagesPath + this.cImgSortAsc));
        }

        this.cOrderBy = pColNum;
        this.wg_do_col_headers();
        this.wg_refresh_grid_data();
    }

    /* Get the data */
    /* Here a PHP data retrieving routine is used to return the data */
    wg_refresh_grid_data()
    {
        var vClassRef = this;
        var vDataDiv = document.getElementById('wd_Dg' + this.cModule + 'DataTable');
        vDataDiv.innerHTML = DOMPurify.sanitize('<div class="wd_DgDataMsgDiv"><img src="' + this.cImagesPath + 'wait_ring_64.gif" class="wd_DgCenterImg" alt="" /></div>');

        var vXhttp = new XMLHttpRequest();
        var vURL   = vClassRef.cAjaxDataFunc +
                        '?module=' + vClassRef.wg_URL_encode(vClassRef.cModule) +
                        '&db_table=' + vClassRef.wg_URL_encode(vClassRef.DbTable) +
                        '&query_cols=' + vClassRef.wg_URL_encode(JSON.stringify(vClassRef.cQueryCols)) +
                        '&show_deleted=' + vClassRef.cShowDeleted +
                        '&order_by=' + vClassRef.wg_URL_encode(vClassRef.cOrderColsMain[vClassRef.cOrderBy]) +
                        '&order_dir=' + vClassRef.cOrderDirs[vClassRef.cOrderDir] +
                        '&start_row=' + vClassRef.cStartRow +
                        '&offset=' + vClassRef.cOffset +
                        '&search_on=' + vClassRef.wg_URL_encode(vClassRef.cSearchOn) +
                        '&search_for=' + vClassRef.wg_URL_encode(vClassRef.cSearchFor) +
                        '&t=' + Math.random();

        vXhttp.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                var vContentType = this.getResponseHeader('Content-Type');
                if (vContentType.substring(0, 9) == 'text/html')
                {
                    var vResp = JSON.parse(this.responseText);
                    vClassRef.cTotRecs = Number(vResp.totRecs);
                    vClassRef.cSelRecs = Number(vResp.selRecs);

                    if (Object.hasOwn(vResp, 'dbError'))
                    {
                        vDataDiv.innerHTML = DOMPurify.sanitize('<div class="wd_DgDataMsgDiv"><p class="wd_DgErrorClass">' + vResp.dbError + '</p></div>');
                    }
                    else
                    {
                        if (vClassRef.cTotRecs == 0 || vClassRef.cSelRecs == 0)
                        {
                            vDataDiv.innerHTML = DOMPurify.sanitize('<div class="wd_DgDataMsgDiv"><p class="wd_DgInfoClass">' + vGenStrings.noData + '</p></div>');
                        }
                        else
                        {
                            vDataDiv.innerHTML = DOMPurify.sanitize(vClassRef.wg_do_grid_db_data(vResp.theData));
                        }
                    }
                    vClassRef.wg_update_grid_footer();
                }
                else
                {
                    vDataDiv.innerHTML = DOMPurify.sanitize('<div class="wd_DgDataMsgDiv"><p class="wd_DgInfoClass">' + vGenStrings.noData + '</p></div>');
                }
            }
        };
        vXhttp.open('GET', vURL, true);
        vXhttp.send();
    }

    /* Process and display the data */
    wg_do_grid_db_data(pJSONdata)
    {
        var vClassRef  = this;
        var vDataBlock = JSON.parse(pJSONdata);
        var vCount     = Object.keys(vDataBlock).length;
        var vIDCond    = false;
        var vEdit      = false;
        if (this.cHasSecurity == false || (this.cHasSecurity == true && 'edit' in this.cSecurity && Number(this.cSecurity['edit']) == 1))
        {
            vEdit      = true;
        }

        var vStr  = '';
        for (const [vKey, vRow] of Object.entries(vDataBlock))
        {

            var vRowId      = vRow[vClassRef.cUuidCol];
            var vDataStyles = vClassRef.wg_do_data_style(vRow);
            var vCol        = [];
            if (vClassRef.cHasUuidCol == true && vClassRef.cUuidCol in vRow && Number(vRow[vClassRef.cUuidCol]) > 0)
            {
                vIDCond = true;
            }

            vStr += '        <div class="wd_DgDataTableRow">';

            if (vIDCond == true && vClassRef.cHidColCount > 0)
            {
                vStr += vClassRef.wg_do_hidden_div_trigger(vRowId);
            }
            else
            {
                vStr += vClassRef.wg_do_blank_column('15');
            }

            if (vIDCond == true && vEdit == true)
            {
                vStr += '            <a href="#" title="' + vClassRef.cStrings.editRow + '">';
            }
            vStr += '                <div style="width:' + vClassRef.cDataWidth + 'px;" class="wd_DgEditSpanRow" id="wd_Dg' + vClassRef.cModule + 'EditSpanRow' + vRowId + '">';

            for (var i = 0; i < vClassRef.cColCount; i++)  // do the row
            {
                vCol[i] = vClassRef.wg_format_grid_col(vRowId, vRow[vClassRef.cGridCols[i]], vClassRef.cGridColsType[i], vClassRef.cGridColsWidth[i]);
                vStr += '                    <div class="wd_DgTableText"' + vDataStyles[i] + ' data-idkey="' + vRowId + '">' + vCol[i] + '</div>';
            }

            vStr += '                </div>';
            if (vIDCond == true && vEdit == true)
            {
                vStr += '            </a>';
            }

            if (vIDCond == true)
            {
                vStr += this.wg_set_icons(vRow);
            }
            else
            {
                vStr += vClassRef.wg_do_blank_column('120');
            }

            vStr += '        </div>';

            if (vIDCond == true && vClassRef.cHidColCount > 0)
            {
                var vHiddenData = [];
                // Format hidden div
                for (var i = 0; i < vClassRef.cHidColCount; i++)
                {
                    vHiddenData[i] = vClassRef.wg_format_grid_col(vRowId, vRow[vClassRef.cHiddenCols[i]], vClassRef.cHiddenColsType[i]);
                }
                vStr += vClassRef.wg_do_hidden_data_div(vRowId, vHiddenData);
            }
        }

        return vStr;
    }

    /* Create the hidden data trigger if need be */
    wg_do_hidden_div_trigger(pIdKey)
    {
        var vTrig = '            <div class="wd_DgHiddenDivTriggerDiv">' +
                    '                <a href="#">' +
                    '                    <img src="' + this.cImagesPath + this.cImgSDIdle + '" data-idkey="' + pIdKey + '" id="wd_Dg' + this.cModule + 'ShowHideDivImg' + pIdKey + '" class="wd_Dg' + this.cModule + 'ShowHideDivImgTrigger" title="' + vGenStrings.showHidden + '" data-action="show" alt="" />' +
                    '                </a>' +
                    '            </div>';
        return vTrig;
    }

    /* Create and fill the hidden data div */
    wg_do_hidden_data_div(pIdKey, pTheData)
    {
        var vHid = '      <div id="wd_Dg' + this.cModule + 'HiddenDiv' + pIdKey + '" class="wd_Dg' + this.cModule + 'GridHiddenData wd_DgHiddenDataDiv">' +
                '          <table>' +

        /* Here we can insert some module-specific hidden data formats through a hook */
        this.wg_set_hidden_data(pTheData) +
        /* =========== */

                '          </table>' +
                '      </div>';
        return vHid;
    }

    /* Show/hide hidden data section (below current row) */
    wg_show_hide_div(pMode, pTriggerId, pTriggerImgVis, pTriggerImgHid, pDivId, pId)
    {
        var vTriggerEl = document.getElementById(pTriggerId);
        var vHiddenDiv = document.getElementById(pDivId);
        if (pMode == 'show')
        {
            var vShowHideDivImgTrigger = document.querySelectorAll('.wd_Dg' + this.cModule + 'ShowHideDivImgTrigger');
            var vGridHiddenData        = document.querySelectorAll('.wd_Dg' + this.cModule + 'GridHiddenData');
            for (var i = 0; i < vGridHiddenData.length; i++)
            {
                this.wg_hide_div(vShowHideDivImgTrigger[i], vGridHiddenData[i], pTriggerImgHid);
            }
            vTriggerEl.dataset.action = 'hide';
            vTriggerEl.setAttribute('title', vGenStrings.hideHidden);
            vTriggerEl.setAttribute('src', (this.cImagesPath + pTriggerImgVis));
            vHiddenDiv.style.display = 'block';
        }
        else if (pMode == 'hide')
        {
            this.wg_hide_div(vTriggerEl, vHiddenDiv, pTriggerImgHid);
        }
    }
    /* Hide any visible hidden data section */
    wg_hide_div(pTriggerEl, pHiddenEl, pTriggerImgHid)
    {
        pTriggerEl.dataset.action = 'show';
        pTriggerEl.setAttribute('title', vGenStrings.showHidden);
        pTriggerEl.setAttribute('src', (this.cImagesPath + pTriggerImgHid));
        pHiddenEl.style.display = 'none';
    }

    /* Do the styling for the grid rows text */
    wg_do_data_style(pRow)
    {
        var vStyles = [];
        for (var i = 0; i < this.cColCount; i++)
        {
            vStyles[i] = ' style="width:' + this.cGridColsWidth[i] + 'px;';
            if (Number(pRow[this.cDeleteCol]) == 1)
            {
                vStyles[i] += ' font-weight:normal;text-decoration:line-through;';
            }
            else
            {
                vStyles[i] += ' font-weight:bold;';
            }

            /* Here we can place some module-specific styling through a hook */
            vStyles[i] = this.wg_set_styles(vStyles[i], pRow);
            /* =========== */

            if (this.cGridColsAlign[i] != '')
            {
                vStyles[i] += 'text-align:' + this.cGridColsAlign[i] + ';';
            }
            vStyles[i] += '"';
        }
        return vStyles;
    }

    /* Format the grid rows text according to their type */
    wg_format_grid_col(pIdKey, pColContent, pColType, pColWidth)
    {

        // Composite 'dateFormat|timeFormat' type with '|' separator for date-time data as integer (unix date format) or string (no date)
        if (pColType.indexOf('|') > 0)
        {
            var vColTypes   = pColType.split('|');
            var vColContent = Number(pColContent);

            // if date-time is NaN then display string (set in the SQL query)
            if (Number.isNaN(vColContent) == true)
            {
                return pColContent;
            }
            else
            {
                var vDate = vColContent * 1000;
                return this.wg_date_format(vDate, vColTypes[0]) + ' - ' + this.wg_date_format(vDate, vColTypes[1]);
            }
        }

        if (pColType == 'string' || pColType == 'integer')
        {
            return pColContent;
        }

        if (pColType == 'float')
        {
            return Number(pColContent).toLocaleString(this.cLocale, {minimumFractionDigits: this.cFloatDec, maximumFractionDigits: this.cFloatDec});
        }

        if (pColType == 'currency')
        {
            return Number(pColContent).toLocaleString(this.cLocale, {style: 'currency', currency: vLocaleOpts.currency, currencyDisplay: 'symbol', minimumFractionDigits: this.cCurrencyDec, maximumFractionDigits: this.cCurrencyDec});
        }

        // 'date' OR 'time'
        if (pColType.indexOf('date') > 0 || pColType.indexOf('time') > 0)
        {
            var vColContent = Number(pColContent);
            // if date is NaN then display string (set in the SQL query)
            if (Number.isNaN(vColContent) == true)
            {
                return pColContent;
            }
            else
            {
                return this.wg_date_format((vColContent * 1000), pColType);
            }
        }

    }


    //==============================================================================
    //
    // Here is where we set the content for each grid row's hidden data section.
    // If a hook function isn't found then a default format is used.
    // To ensure simple grid-like format, a <table> HTML element is used.
    // See examples.
    //
    //==============================================================================

    wg_set_hidden_data(pHiddenData)
    {
        var vStr      = '';
        var vHookFunc = 'js_' + this.cModule + '_hidden_data';

        if (typeof self[vHookFunc] == 'function')
        {
            // use hook function for new hidden data format
            vStr = self[vHookFunc](this.cModule, pHiddenData, this.cImagesPath);
        }
        else
        {
            // use default hidden data format
            for(var i = 0; i < this.cHidColCount; i++)
            {
                if (pHiddenData[i].length > 0)
                {
                    vStr += '      <table>' +
                            '          <tr>' +
                            '              <td>' +
                            '                  <p class="wd_DgHiddenText"><b>' + this.cStrings.hiddenColsLabels[i] + '&nbsp;</b></p>' +
                            '              </td>' +
                            '              <td>' +
                            '                  <p class="wd_DgHiddenText">' + pHiddenData[i] + '</p>' +
                            '              </td>' +
                            '          </tr>' +
                            '      </table>';
                }
            }
        }
        return vStr;
    }

    //==============================================================================
    //
    // Here is where we set the style for each grid row.
    // Preset styles are:
    //   - font-weight:bold;text-align:<align> -> default standard grid row
    //   - font-weight:normal;text-decoration:line-through;text-align:<align> -> default
    //     deleted grid row
    // Note: the text-align css directive uses the 'grid_cols_styles' array to set the
    // grid row column text alignment. This can not be overridden here.
    // The hook function "js_set_<module>_row_styles" needs to return a string of css
    // directives in order to style the text. It is possible to 1. override the two
    // default presets above, or 2. add to the presets above, or 3. do a combination of
    // override and add to.
    //   Case 1: the hook function needs to return a string such as
    //           ' style="<new style>: <place your style here>;'
    //   Case 2: the hook function needs to return a string such as
    //           ' style="pStyles; <new style>: <place your style here>;'
    //   Case 3: combination of the above
    // See examples.
    //
    //==============================================================================

    wg_set_styles(pStyles, pRow)
    {
        var vHookFunc = 'js_' + this.cModule + '_row_styles';

        if (typeof self[vHookFunc] == 'function')
        {
            return self[vHookFunc](this.cModule, pStyles, pRow, this.cDeleteCol);
        }
        return pStyles;
    }

    //==============================================================================
    //
    // Here is where we add the icons at the end of each grid row.
    // Each grid row can have up to 6 icons.
    // The hook function "js_set_<module>_row_icons" needs to return specific values
    // in order to create the icon. These values must form a JSON string of the
    // following format:
    //   "toolTip":  URL-encoded string for the icon tooltip
    //   "iconName": something like <icon_delete.png>
    //   "action":   same action name as in the listener and the hook function
    // See examples.
    //
    //==============================================================================

    /* Create the grid rows icons */
    wg_set_icons(pRow)
    {
        var vIconsParams = '';
        var vHookFunc    = 'js_' + this.cModule + '_set_row_icons';

        if (typeof self[vHookFunc] == 'function')
        {
            vIconsParams = self[vHookFunc](this.cModule, this.cSecurity, this.cDeleteCol, pRow, this.cStrings);
        }
        if (vIconsParams.length > 0)
        {
            var vStr   = '';
            var vIcons = JSON.parse(vIconsParams);
            var vCount = Object.keys(vIcons).length;
            for (var i = 0; i < vCount; i++)
            {
                if (vIcons[i]['toolTip'] == '' || vIcons[i]['iconName'] == '' || vIcons[i]['action'] == '')
                {
                    vStr += this.wg_do_blank_column('20');
                }
                else
                {
                    vStr += '        <div class="wd_DgLineIconImgDiv">' +
                            '            <a href="#" title="' + this.wg_URL_decode(vIcons[i]['toolTip']) + '">' +
                            '                <p class="wd_DgTableImage">' +
                            '                    <img src="' + this.cImagesPath + vIcons[i]['iconName'] + '" id="wd_Dg' + this.cModule + 'RowImg' + vIcons[i]['action'] + pRow[this.cUuidCol] + '" class="wd_Dg' + this.cModule + 'RowImgTrigger" data-idkey="' + pRow[this.cUuidCol] + '" data-action="' + vIcons[i]['action'] + '" alt="' + vIcons[i]['action'] + '" />' +
                            '                </p>' +
                            '            </a>' +
                            '        </div>';
                }
            }
            return vStr;
        }
        return '';
    }

    //==============================================================================
    //
    // Here is where we place the grid interactions with the database (typically,
    // the 'new' icon, the row click ('edit') and the icons at the end of each row)
    // Each interaction corresponds to an 'action': 'new', 'dupe', 'edit', 'delete',
    // 'recover', 'trash', etc
    // New interactions can easily be added by:
    //   1. including a new listener
    //   2. ensuring the listener exposes its 'action' and the db 'row id'
    //   3. the listener calls: js_wg_db_hook(<action>, <row id>)
    // See examples.
    //
    //==============================================================================

    /* 'new', 'dupe', 'edit', 'delete', 'recover', 'trash', ... */
    wg_db_hook(pAction, pRowId='0')
    {
        var vAction   = pAction.toLowerCase();
        var vHookFunc = 'js_' + this.cModule + '_' + vAction + '_row';

        if (typeof self[vHookFunc] == 'function')
        {
            self[vHookFunc](this.cModule, this.DbTable, this.cUuidCol, pRowId, this.cDeleteCol, this);
        }
    }


    //==============================================================================
    //
    // The following hook is provided for localisation purposes.
    // Dates can thus be formatted according to the locale.
    // See the provided example in the localisation file "en-NZ.js"
    //
    //==============================================================================

    /* Utility method: format a date */
    wg_date_format(pUnixDate, pFormat)
    {

        if (typeof self['js_wd_date_format'] == 'function')
        {
            return js_wd_date_format(this.cModule, pUnixDate, pFormat, this.cLocale);
        }
    }

    //==============================================================================
    //
    // Here be support methods for the grid functionality
    //
    //==============================================================================

    /* Create a blank <div></div> HTML of specified width */
    wg_do_blank_column(pWidth)
    {
        return '<div style="width:' + pWidth + 'px;">&nbsp;</div>';
    }

    /* Create an <option></option> string for a <select> HTML element */
    wg_do_select_options(pList, pKey='key', pSelected='')
    {
        var vOpts  = '';
        var vKey   = '';
        var vValue = '';
        for (const [vKey, vValue] of Object.entries(pList))
        {
            if (vKey == pSelected)
            {
                if (pKey == 'val')
                {
                    vOpts += '<option selected="selected" value="' + vValue + '">' + vValue + '</option>';
                }
                else
                {
                    vOpts += '<option selected="selected" value="' + vKey + '">' + vValue + '</option>';
                }
            }
            else
            {
                if (pKey == 'val')
                {
                    vOpts += '<option value="' + vValue + '">' + vValue + '</option>';
                }
                else
                {
                    vOpts += '<option value="' + vKey + '">' + vValue + '</option>';
                }
            }
        }
        return vOpts;
    }

    /* Checkbox functionality */
    // Initialise
    wg_init_checkbox(pTrigElId)
    {
        const vTrig = document.getElementById(pTrigElId);
        if (this.cShowDeleted == 0)
        {
            vTrig.setAttribute('src', (this.cImagesPath + this.cImgUnCheck));
        }
        else
        {
            vTrig.setAttribute('src', (this.cImagesPath + this.cImgCheck));
        }
    }
    // set
    wg_set_checkbox(pTrigElId)
    {
        var vTrig = document.getElementById(pTrigElId);
        if (this.cShowDeleted == 0)
        {
            vTrig.setAttribute('src', (this.cImagesPath + this.cImgCheck));
            this.cShowDeleted = 1;
        }
        else
        {
            vTrig.setAttribute('src', (this.cImagesPath + this.cImgUnCheck));
            this.cShowDeleted = 0;
        }
    }

    /* Utility method: capitalise first letter of single word */
    wg_ucfirst(pString)
    {
        var vFirst = pString.charAt(0).toUpperCase();
        return vFirst + pString.substring(1, (pString.length));
    }
    /* Utility method: js properly encode string for URL */
    wg_URL_encode(pString)
    {
        if (typeof pString == 'number')
        {
            return pString;
        }
        var vString = encodeURIComponent(pString.replace('/', '|'));
        var vMap = {'!': '%21',
                    '*': '%2a',
                    '+': '%2b',
                    '"': '%22',
                    "'": '%27',
                    '(': '%28',
                    ')': '%29'
                };
        return vString.replace(/[!*+"'()]/g, function(m) {return vMap[m];});
    }
    /* Utility method: js decode string for URL */
    wg_URL_decode(pString)
    {
        if (typeof pString == 'number')
        {
            return pString;
        }
        var vMap = {'%21': '!',
                    '%2a': '*',
                    '%2b': '+',
                    '%22': '"',
                    '%27': "'",
                    '%28': '(',
                    '%29': ')'
                };
        var vString = pString.replace(/(%21)(%2a)(%2b)(%22)(%27)(%28)(%29)/, function(m) {return vMap[m];});
        return decodeURIComponent(vString);
    }

}
