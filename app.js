var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
const{con} =require('./database.js');
 
var app = express();

app.set('view engine', 'ejs');
app.set('views', 'bookstore');

app.use(session({ 
  secret: '123456catr',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static('assets'))
app.use('/styles', express.static('vendor'))
app.use(flash());

app.get('/',function(req,res){
 return res.sendFile('C:/Users/krish/Downloads/OA/bookstore/Login.html');
});
app.get('/reg',function(req,res){
 return res.sendFile('C:/Users/krish/Downloads/OA/bookstore/regis.html');
});
app.get('/index',function(req,res){
 return res.sendFile('C:/Users/krish/Downloads/OA/bookstore/index.html');
});
  app.get('/products',function(req,res){
   console.log("ok");
   return res.sendFile('C:/Users/krish/Downloads/OA/bookstore/products.html');
  });
    app.get('/about',function(req,res){
   return   res.sendFile('C:/Users/krish/Downloads/OA/bookstore/about.html');
    });
    app.get('/contact',function(req,res){
     return res.sendFile('C:/Users/krish/Downloads/OA/bookstore/contact.html');
    });

app.post('/log', async function(req, res, next) {
  var e_mail= req.body.em;
  var pass= req.body.pw;
  
  var sql = `SELECT* FROM registration WHERE e_mail='${e_mail}' AND pass='${pass}'`;
  con.query(sql, function (err, result) {
    if (result.length>0)
       {
      console.log('Success');
      res.redirect('/index');
    }
    else
    {
     
  return    res.redirect('/');
    }
  });
});

app.post('/regi', function(req, res, next) {
  var e_mail= req.body.email;
  var pass= req.body.pwd;
  var c_pass= req.body.confirm;
  if(pass!==c_pass){
    throw new Error('Password must be same')
  }
  res.redirect('/reg');
   var sql = `INSERT INTO registration (e_mail, pass, c_pass) VALUES ("${e_mail}", "${pass}", "${c_pass}")`;
   con.query(sql, function(err, result) {
     if (err) throw err;
     console.log('record inserted');
     req.flash('success', 'Data added successfully!');
     return res.redirect('/');
   });
});
app.post('/contact-us', function(req, res, next) {
  var f_name = req.body.f_name;
  var l_name = req.body.l_name;
  var email = req.body.email;
  var message = req.body.message;
 
  var sql = `INSERT INTO contacts (f_name, l_name, email, message) VALUES ("${f_name}", "${l_name}", "${email}", "${message}")`;
   con.query(sql, function(err, result) {
     if (err) throw err;
     console.log('record inserted');
     req.flash('success', 'Data added successfully!');
    return res.redirect('/index');
   });

  return res.redirect('/index');
});
 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
next(createError(404));
});
 
// error handler
app.use(function(err, req, res, next) {
// set locals, only providing error in development
res.locals.message = err.message;
res.locals.error = req.app.get('env') === 'development' ? err : {};
 
  // render the error page
res.status(err.status || 500);
return res.redirect('/');
//next();
});
 
// port must be set to 3000 because incoming http requests are routed from port 80 to port 8080
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
 
module.exports = app;