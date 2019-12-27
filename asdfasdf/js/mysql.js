var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'bit04',
  password : 'bit04',
  database : 'bitdb_connection'
});
 
connection.connect();
// var sql = 'SELECT `emp_id`,`emp_name` FROM `employee`';
var sql = 'select now()'
connection.query(sql, function (error, results, fields) {
 if (error) console.log(error.code);
 else {
     console.log(results);
    //  $('#resultDiv').text(results[0].emp_name); //emp_name is column name in your database
 }
});
connection.end(); 
