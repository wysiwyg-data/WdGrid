<?php
$wdThemesPath = 'assets/app-themes/';
$wdAppTheme   = 'classic';
?>

<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="robots" content="noindex, nofollow">
        <meta name="author" content="WYSIWYG Data development">

        <title>Datagrid Tests</title>

        <script src="assets/js/example.js"></script>
        <script src="assets/js/purify.min.js"></script>
        <script src="assets/js/en-NZ.min.js"></script>
        <script src="assets/js/wdgrid.min.js"></script>

        <link type="text/css" href="assets/css/example.css" rel="stylesheet" media="screen" />
        <link type="text/css" href="<?php echo $wdThemesPath.$wdAppTheme; ?>/css/example.css" rel="stylesheet" media="screen" />
        <link type="text/css" href="assets/css/wdgrid.css" rel="stylesheet" media="screen" />
        <link type="text/css" href="<?php echo $wdThemesPath.$wdAppTheme; ?>/css/wdgrid.css" rel="stylesheet" media="screen" />

        <script>
            document.onreadystatechange = () =>
            {
                if (document.readyState === "complete")
                {
                    const firstGridTest = new WdGrid(
                    {
                        parent_element:     'wd_MainContent',
                        grid_element:       'wd_FirstGrid',
                        module:             'Test1',
                        ajax_data_func:     'wd_GetData.php',
                        user_id:            '0',
                        security:           {'new':'1', 'edit':'1', 'dupe':'1', 'delete':'1', 'trash':'1'},      // object!
                        themes_path:        '<?php echo $wdThemesPath; ?>',
                        app_theme:          '<?php echo $wdAppTheme; ?>',
                        show_new_opt:       true,
                        db_table:           'wdgrid_test',
                        warn_no_uuid:       false,
                        uuid_col:           'idKey',
                        delete_col:         'isDeleted',
                        currency_dec:       2,
                        grid_cols:          ['aDate', 'aString', 'aValue'],                      // array!
                        grid_cols_type:     ['long_med_date|short_time', 'string', 'currency'],  // array!
                        grid_cols_width:    [250, 200, 150],                                     // array!
                        grid_cols_align:    ['', '', 'right'],                                   // array!
                        grid_labels_align:  ['', '', 'center'],                                  // array!
                        sortable_cols:      [true, true, true],                                  // array!
                        order_by:           1,
                        order_cols_main:    ['aDate', 'aString', 'aValue'],                      // array!
                        hidden_cols:        ['aDate', 'aString'],                                // array!
                        hidden_cols_type:   ['long_date|short_time', 'string'],                  // array!
                    });
                    firstGridTest.wg_NewGrid;

                    const secondGridTest = new WdGrid(
                    {
                        parent_element:     'wd_MainContent',
                        grid_element:       'wd_SecondGrid',
                        module:             'Test2',
                        ajax_data_func:     'wd_GetData.php',
                        user_id:            '0',
                        security:           {'new':'1', 'edit':'1', 'dupe':'1', 'delete':'1', 'trash':'1'},      // object!
                        themes_path:        '<?php echo $wdThemesPath; ?>',
                        app_theme:          '<?php echo $wdAppTheme; ?>',
                        show_new_opt:       false,
                        db_table:           'wdgrid_test',
                        warn_no_uuid:       false,
                        uuid_col:           'idKey',
                        delete_col:         'isDeleted',
                        currency_dec:       4,
                        grid_cols:          ['aDate', 'aString', 'aValue'],                      // array!
                        grid_cols_type:     ['long_med_date|short_time', 'string', 'currency'],  // array!
                        grid_cols_width:    [250, 200, 150],                                     // array!
                        grid_cols_align:    ['', '', 'right'],                                   // array!
                        grid_labels_align:  ['', '', 'center'],                                  // array!
                        sortable_cols:      [true, false, false],                                // array!
                        order_by:           0,
                        order_cols_main:    ['aDate', 'aString', 'aValue'],                      // array!
                        hidden_cols:        ['aString', 'aValue'],                               // array!
                        hidden_cols_type:   ['string', 'currency'],                              // array!
                    });
                    secondGridTest.wg_NewGrid;

                }
            };
        </script>
    </head>

    <body>

        <div id="wd_HeaderDiv" class="wd_BorderBottomClass">
            <p>Yet another datagrid</p>
        </div>

        <div id="wd_ContentDiv">

            <div id="wd_MainContent">
<?php
/*
                    The first grid will be generated inside this <div>
*/
?>
<?php
/*
                    The second grid will be generated inside this <div>
*/
?>
            </div>

        </div>

        <div id="wd_FooterDiv" class="wd_BorderTopClass">
            <p><b><em>&copy; WYSIWYG Data <?php echo date('Y'); ?></em></b></p>
        </div>

    </body>
</html>
