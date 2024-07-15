<?php

/**
 * Connect to the database.
 */
function wd_db_connect()
{
    // Create connection
    $cConn = new mysqli('localhost', '', '', '');

    // Check connection
    if ($cConn->connect_errno) {
        die("Connection failed: " . $cConn->connect_error);
    }
    return $cConn;
}

/**
 * function db_count_data()
 */
function wd_db_count_data($pConnect, $pTableName, $pIncludeDeleted=true, $pSearchOn=null, $pSearchFor=null)
{

    $cSQL = "SELECT COUNT(`IdKey`) `recCount` FROM `" . $pTableName . "`";

    $cSQL .= wd_db_build_where($pIncludeDeleted, $pSearchOn, $pSearchFor);

    $cSQL .= ";";

    $cQuery = $pConnect->query($cSQL);

    if (! $cQuery)
    {
        return ['error' => $pConnect->error];
    }
    $cRow = $cQuery->fetch_assoc();
    return ['data' => $cRow['recCount']];

}

/**
 * Get table data.
 */
function wd_db_get_data($pConnect, $pTableName, $pColumns=null, $pIncludeDeleted=true, $pStartRow=0, $pOffset=10, $pOrderBy=null, $pSearchOn=null, $pSearchFor=null)
{

//    $cSQL = "SELECT " . $pColumns . " FROM `" . $pTableName . "`";
    $cSQL = "SELECT idKey, CASE WHEN aDate = '0' THEN 'Unknown Date' ELSE aDate END AS aCreateDate, aString, aValue, isDeleted FROM `" . $pTableName . "`";

    $cSQL .= wd_db_build_where($pIncludeDeleted, $pSearchOn, $pSearchFor);

    if (! empty($pOrderBy))
    {
        $cSQL .= " ORDER BY " . $pOrderBy;
    }

    $cSQL .= " LIMIT " . $pOffset . " OFFSET " . $pStartRow . ";";

    $cQuery = $pConnect->query($cSQL);

    if ($cQuery->num_rows == 0)
    {
        return ['data' => []];
    }
    else
    {
        return ['data' => $cQuery->fetch_all(MYSQLI_ASSOC)];
    }
    return ['error' => $pConnect->error];

}

/**
 * Flag table row as deleted.
 */
function wd_db_update_table_row($pConnect, $pTableName, $pRowValues, $pUUIdCol, $pUUIdVal)
{

    if (! empty($pRowValues))
    {
        $cSQL = "UPDATE `" . $pTableName . "` SET " . $pRowValues . " WHERE `" . $pUUIdCol . "` = '" . $pUUIdVal . "';";

        $cQuery = $pConnect->query($cSQL);

        if (! $cQuery)
        {
            return ['error' => $pConnect->error];
        }
        else
        {
            return ['data' => mysqli_affected_rows($pConnect)];
        }

    }

}

function wd_db_build_where($pIncludeDeleted=true, $pSearchOn=null, $pSearchFor=null)
{

    $cCond = "";
    if (! $pIncludeDeleted)
    {
        $cCond = " WHERE `IsDeleted`='0'";
    }
    if (empty($pSearchOn) || empty($pSearchFor))
    {
        return $cCond;
    }
    if ($cCond == '')
    {
        $cCond = " WHERE";
    }
    else
    {
        $cCond .= " AND";
    }
    return $cCond .= " (" . rawurldecode($pSearchOn) . " LIKE '%" . htmlentities(rawurldecode($pSearchFor), ENT_QUOTES) ."%')";

}
