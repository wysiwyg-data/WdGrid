<?php
    $wdIncludesDir  = 'includes/';

    include_once($wdIncludesDir.'WdDbFuncs.php');

    $wdDbConnect = wd_db_connect();

    try
    {

        $wdDbTable     = rawurldecode($_GET['db_table']);

        // AJAX url sent from the class:
        // ?module=' + pModule + '&db_table=' + pDbTable + '&update_cols_vals=' + vUpdateColsVals + '&uuid_col=' + pUUIdCol + '&row_id=' + pRowId;

        // Format the update string
        if (! empty($_GET['update_cols_vals']))
        {
            $wdAry     = json_decode(rawurldecode($_GET['update_cols_vals']), true);
            $wdCount   = count($wdAry);
            $wdUpdStmt = '';
            for ($i = 0; $i < $wdCount; $i++)
            {
                $wdUpdStmt .= "`" . $wdAry[$i]['column'] . "` = '" . htmlentities($wdAry[$i]['value'], ENT_QUOTES) . "' ,";
            }
            $wdUpdStmt = substr($wdUpdStmt, 0, -1);
        }

        // Then do the update
        $wdUpdAry = wd_db_update_table_row($wdDbConnect, $wdDbTable, $wdUpdStmt, $_GET['uuid_col'], rawurldecode($_GET['row_id']));
        if (array_key_exists('error', $wdUpdAry))
        {
            throw new \Exception('Database error! Error: ' . $wdUpdAry['error']);
        }

        $wdData = ['theData' => $wdUpdAry['data']];

    }
    catch (\Exception $e)
    {
        $wdData = ['dbError' => $e->getMessage()];
    }

    echo json_encode($wdData);

?>
