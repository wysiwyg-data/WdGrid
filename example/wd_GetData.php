<?php
    $wdIncludesDir  = 'includes/';

    include_once($wdIncludesDir . 'WdDbFuncs.php');

    $wdDbConnect = wd_db_connect();

    try
    {

        $wdDbTable     = rawurldecode($_GET['db_table']);
        $wdShowDels    = true;
        $wdQueryCols   = '*';

        // AJAX url sent from the class:
        // wd_GetData.php?module=' + ['module'] + '&db_table=' + ['db_table'] + '&query_cols=' + vQueryCols + '&show_deleted=' + vShowDels + '&order_by=' + options['grid_cols'][vOrderBy] + '&order_dir=' + vOrderDirs[vOrderDir] + '&start_row=' + vStartRow + '&offset=' + vOffset + '&search_on=' + vSearchOn + '&search_for=' + vSearchFor;

        /* First decode the URL */
        // Format <show_deleted>
        if (intval($_GET['show_deleted']) == 0) $wdShowDels = false;

        // Format the query columns
        if (! empty($_GET['query_cols']))
        {
            $wdAry = json_decode(rawurldecode($_GET['query_cols']), true);
            if (is_array($wdAry))
            {
                $wdCount     = count($wdAry);
                $wdQueryCols = '';
                for ($i = 0; $i < $wdCount; $i++)
                {
                    $wdQueryCols .= $wdAry[$i] . ',';
                }
                $wdQueryCols = substr($wdQueryCols, 0, -1);
            }
            else
            {
                $wdQueryCols = $wdAry;
            }
        }


        /* Then get the queries going */

        // Step 1: get the total number of rows in table (no conditions whatsoever)
        $wdTotAry = wd_db_count_data($wdDbConnect, $wdDbTable);
        if (array_key_exists('error', $wdTotAry))
        {
            throw new \Exception('Database error! Error: ' . $wdTotAry['error']);
        }

        // Step 2: get the number of rows in table satisfying conditions (not deleted, equal to, etc)
        $wdSelAry = wd_db_count_data($wdDbConnect, $wdDbTable, $wdShowDels, $_GET['search_on'], $_GET['search_for']);
        if (array_key_exists('error', $wdSelAry))
        {
            throw new \Exception('Database error! Error: ' . $wdSelAry['error']);
        }

        // Step 3: get the data rows in table satisfying same conditions as in Step 2 (not deleted, equal to, etc)
        $wdQuery  = wd_db_get_data($wdDbConnect, $wdDbTable, $wdQueryCols, $wdShowDels, $_GET['start_row'], $_GET['offset'], ($_GET['order_by'].' '.$_GET['order_dir']), $_GET['search_on'], $_GET['search_for']);
        if (array_key_exists('error', $wdQuery))
        {
            throw new \Exception('Database error! Error : ' . $wdQuery['error']);
        }

        $wdData = ['totRecs' => $wdTotAry['data'],
                   'selRecs' => $wdSelAry['data'],
                   'theData' => json_encode($wdQuery['data'])
                ];

    }
    catch (\Exception $e)
    {
        $wdData = ['totRecs' => 0,
                   'selRecs' => 0,
                   'dbError' => $e->getMessage()
                ];
    }

    echo json_encode($wdData);

?>
