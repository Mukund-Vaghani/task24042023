const mysql = require('mysql');

var configuration = {
    host:'localhost',
    user:'root',
    password:'',
    database:'db_employee_data'
}

var con = mysql.createPool(configuration);
module.exports = con;