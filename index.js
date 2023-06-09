const express = require('express');
var app = express();
var cors = require("cors")
var con = require('./database')

app.use(cors())
app.use(express.json());

app.post('/login', (req, res) => {
    console.log(req.body);
    var email = req.body.email;
    var passwd = req.body.password;

    con.query(`SELECT * FROM tbl_employee WHERE email = ? AND password = ?`, [email, passwd], function (error, result) {
            res.send({ code: '1', message: 'success!', data: { token: btoa(email) } }
            )
        })

// res.send({ code: 0, message: 'Invalid email or password' });

})


app.post('/search', function (req, res) {
    // console.log(req.body);
    con.query(`SELECT * FROM tbl_employee WHERE first_name or last_name or email LIKE '%${req.body.search}%'`, function(error,result){
        if(!error && result.length > 0){
            res.send(result)
        }else{
            res.send(error);
        }
    })
})

app.post('/signup', (req, res) => {
    var request = req.body;

    var empData = {
        role: request.role,
        first_name: request.first_name,
        last_name: request.last_name,
        email: request.email,
        gender: request.gender,
        password: request.password
    }

    con.query(`INSERT INTO tbl_employee SET ?`, [empData], function (error, result) {
        if (!error) {
            res.send({ code: '1', message: 'success!', data: { token: btoa(empData.email) } });
        }
    })
})

app.get('/listing',function(req,res){
    con.query('SELECT * FROM tbl_employee WHERE is_active = "1" AND is_delete = "0"', function(error,result
        ){
        if(!error && result.length > 0){
            res.send(result)
        }else{
            res.send(error)
        }
    })
})

app.post('/delete',function(req,res){
    console.log(req.body);
    // return false;
    con.query(`SELECT role FROM tbl_employee WHERE email = ?`,[req.body.email],function(error,result){
        console.log(result);
        if (!error && result.length > 0) {
            if(result[0].role == 'admin'){
                con.query('UPDATE tbl_employee SET is_delete ="1" WHERE ID = "'+req.body.id+'"',function(error,result){
                if(!error){
                    // res.render('home.html');
                    res.send('result');
                    console.log('deleted');
                }else{
                    res.send('error');
                };
            })
            }
        } else {
            console.log('You can not delete because you are not admin');
        };
    });
})

var server = app.listen(8203, function () {
    console.log('app listen on port : ' + server.address().port);
})
