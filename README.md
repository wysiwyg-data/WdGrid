# WdGrid ~ A vanilla Javascript data grid

WdGrid is a lightweight, basic grid-based data presentation Javascript class. It is very simple to include into existing projects and even simpler to use!

## Some features
- vanilla Javascript means no dependencies on external libraries such as jQuery.
- uses purify.js for security.
- ability to style the grid with css, create themes/skins. Comes with basic theme.
- localised, comes with a localisation example file.
- offers many options for data presentation.
- abstracts from the database engine.
- abstracts from the server scripting language.
- accepts database data as string or integer. Includes customisable function to convert UNIX-based dates into human-readable formats in the localisation file.
- provide hooks for various data operations (insert, update, delete, etc) and data presentation (styles).

## Documentation

### Dependencies
- `<locale>.js` -> file for the grid localisation
- `<your_script>.js` -> file for the grid hooks
- `purify.js` -> tool for securely inserting HTML into the DOM, as recommended by MDN (https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Safely_inserting_external_content_into_a_page). See https://github.com/cure53/DOMPurify
- `wdgrid.css` -> main css file
- `wdgrid.css` -> optional theme css file (located in a themes directory for example)
- server-side script(s) to provide database interaction.

### Loading WdGrid
- Please refer to the index.php example file.
- Load the grid when the DOM loading has completed.
- Typically: `const aConst = new WdGrid({ option1:value1, option2:value2, ... });`
- And then call the WdGrid class method that starts the grid: `aConst.wg_NewGrid;`

### WdGrid options
**Please note**: the grid won't display properly unless all compulsory options are set. See the list of options below.

Compulsory options

- `'parent_element'    <string>  - (C) Default: ''. DOM parent element where the grid will be located`
- `'grid_element'      <string>  - (C) Default: ''. DOM grid wrapper element`
- `'module'            <string>  - (C) Default: ''. Grid unique module name`
- `'ajax_data_func'    <string>  - (C) Default: ''. Name of server-side script for fetching data`
- `'offset'            <integer> - (C) Default: 10. If different, must be a value in 'offsets' array below. Modify offsets to start at 'offset'`
- `'db_table'          <string>  - (C) Default: ''. Name of data table for the SQL queries for the data manipulations`
- `'warn_no_uuid'      <boolean> - (O) Default: true. Show an alert if no uuid field has been given (see below)`
- `'uuid_col'          <string>  - (C) Default: ''. Column name in the db table containing the unique row identifier`
- `'delete_col'        <string>  - (C) Default: ''. Column name in the db table containing the 'deleted flag' ('0' or '1')`
- `'show_deleted'      <integer> - (C) Default: 1. Show deleted rows`
- `'query_cols'        <string>  - (C) Default: '*'. Columns for the db 'SELECT' statement: '<col1_name>, <col2_name>, ...'`
- `'order_cols_main'   <array>   - (C) if 'sortable_cols' below is set, primary sort columns: ['<col1_name>', '<col2_name>', ...]`
- `'sortable_cols'     <array>   - (C) <boolean> sortable columns: [true, true, false, ...]`
- `'grid_cols'         <array>   - (C) columns whose data will be displayed in the grid: ['<col1_name>', '<col2_name>', ...]`
- `'grid_cols_type'    <array>   - (C) column types: 'string', 'integer', 'date', 'time', 'date|time' (| separated): ['string', 'integer', ...] (see below)`
- `'grid_cols_width'   <array>   - (C) column widths. Each an integer of pixels: [100, 200, 300, ...]`
- `'grid_cols_align'   <array>   - (C) column styles: '', 'center' or 'right': ['', 'center', 'right', ...] ('' = 'left')`
- `'grid_labels_align' <array>   - (C) header column labels styles: '', 'center' or 'right': ['', 'center', 'right', ...] ('' = 'left')`

General optional options

- `'user_id'           <integer> - (O) Default: '0'. ID of logged in user (* IMPORTANT *). Not needed. Provided if need be for security reason`
- `'security'          <object>  - (O) security settings: {"edit":1,...} Security settings for each action. if not needed, leave blank, add /remove options as per the listeners and icons that are defined`
- `'max_height'        <integer> - (O) Default: 400(px). Maximum height of the grid's wrapper div`
- `'app_theme'         <string>  - (O) Default: ''. Application theme/skin to include in images_path if needed`
- `'themes_path'       <string>  - (O) Default: ''. Path to application themes/skins to include in images_path if needed`
- `'locale'            <string>  - (O) Default: 'en-NZ'. Locale for dates and UI messages/text strings`
- `'currency_dec'      <integer> - (O) Default: 2. Currency number of digits after the decimal marker`
- `'float_dec'         <integer> - (O) Default: 2. General float number of digits after the decimal marker`
- `'show_title'        <boolean> - (O) Default: true. Display title/search bar and show_deleted option`
- `'show_deleted_opt'  <boolean> - (O) Default: true. Show option to display (or not) deleted rows`
- `'show_new_opt'      <boolean> - (O) Default: false. Show 'new' record icon and enables its functionality`
- `'nav_type'          <string>  - (O) Default: 'simple'. If 'none' no navigation ever`
- `'offsets'           <object>  - (O) if 'nav_type' is set to 'simple' see default object below, else {}`
- `'order_cols_other'  <array>   - (O) secondary sort columns groups: ['<col1_name>, <col2_name>, <col3_name>', '<col2_name>, <col1_name>, <col3_name>', ...]`
- `'hidden_cols'       <array>   - (O) Default: []. Columns to display in the hidden section: ['<col1_name>', '<col2_name>', ...]`
- `'hidden_cols_type'  <string>  - (O) Default: []. Hidden columns types: ['string', 'integer', ...] (see column Types below)`
- `'order_by'          <integer> - (O) Default: 0. Initial order on first grid column`
- `'order_dir'         <integer> - (O) Default: 0 (ASC). Initial order direction (1 for DESC)`

Key to abbreviations: (**C**) = Compulsory, (**O**) = Optional

### Additional notes
**Column Types:**

- apply to 'grid_cols_type' and 'hidden_cols_type' options.
- possible values for array are: 'string', 'integer', 'float', 'currency' and for UNIX dates, see Date Formats below.

**Date Formats:**

- possible values for date formats array: 'long_date', 'long_med_date', 'medium_date', 'short_date', 'short_time' (if using the default **en-NZ locale** date formats are provided)
- combinations are possible for date+time data presentation, in that case use a '`|`' as separator between the options. Example: `['long_date|short_time', ...]`
- these formats use the PHP Date() coding system (https://www.php.net/manual/en/datetime.format.php).
- the examples here follow the 'en-NZ' locale date/time formats:
  - `'long_date'     -> 'l jS F Y' (Wednesday 10th January 2024)`
  - `'long_med_date' -> 'jS M Y'   (10th Jan 2024)`
  - `'medium_date'   -> 'd/m/Y'    (10/01/2024)`
  - `'short_date'    -> 'j/n/y'    (10/1/24)`
  - `'short_time'    -> 'g:ia'     (9:52am)`
- to change these, or add to, simply go to the `js_wd_date_format()` function in the localisation file. Then change or add in the `switch(pFormat)` section.

**Offsets:**

By default the grid offers a basic navigation, or pagination, system based on video controls, set by the `'nav_type'` option. This `'simple'` navigation option requires a list of offsets or number of lines per grid page. This list is defined using the `'offsets'` option, and is set by default as follows: `{"10":"10", "25":"25", "50":"50", "100":"100", "250":"250", "500":"500"}` (object)

Like other options this can be overridden with another list. **Caution is required with the number of rows as this is dependent upon the RAM on the device**.

**Fetching data:**

An example is provided, see the PHP script `wd_GetData.php`

This script only shows the database abstracted layer of the process. You will need to write your own functions/methods to connect to your database engine and interact with it.

Here is the dataset format returned by the PHP script:
  `[{"<column1_name>":"<column1_value>","<column2_name>":"<column2_value>","<column3_name>":"<column3_value>","<column4_name>":"<column4_value>","<column5_name>":"<column5_value>"},`
  `{"<column1_name>":"<column1_value>","<column2_name>":"<column2_value>","<column3_name>":"<column3_value>","<column4_name>":"<column4_value>","<column5_name>":"<column5_value>"}, ... ]`

One of the columns **MUST** contain a unique row identifier for the grid to be functional in read/write mode. This unique identifier column name is passed as an option: see the `'uuid_col'` option above.
In cases of read-only grids the unique identifier may be omitted. In that case, set the `warn_no_uuid` flag to `false` so no error message is generated.

WdGrid provides a means to mark a row as 'deleted', which then allows to hide it from view: see the `'show_deleted_opt'` and `'show_deleted'` options above. This capability will only be available if:

1. the data table contains a column only containing a '1' (deleted row) or '0' (not deleted row), herein called the 'deleted flag'.
2. the table column name containing the 'deleted flag' is passed as an option: see the `'delete_col'` option above.
3. the appropriate function(s) exist(s) in the support js file to display the icons, and act upon the data when the icons are clicked. See the `example.js` file.

## Demo

All basic files for the demo can be found in the `/example` directory.

Steps to follow:

1. create a database, then use the `wdgrid_test.sql` SQL script to create an example table and insert data into it. The provided script works for MySQL, you may need to tweak it for other database engines.
2. create a script (PHP, ASP, etc) to connect to your database engine and interface with the `wd_GetData.php` and/or `wd_UpdateData.php`, or other scripts you may have written. If you've written your own script to fetch data, remember to update the `'ajax_data_func'` option.
3. run the `index.php` script in a web server, and all should be revealed!

## Conclusion
Please feel free to use this and feedback any request for enhancement, or bugs if any.
