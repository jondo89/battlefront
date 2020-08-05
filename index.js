var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var recaptcha = require('express-recaptcha');
var braintree = require("braintree");
var helpers = require('handlebars-helpers')(['string']);
var Handlebars = require("handlebars");
var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);
 
dotenv.config()
//Primary app variable.
var app = express();
///////////////////////////////////////
///////   FAVICON LOCATION    ////////
/////////////////////////////////////
var favicon = require('serve-favicon');
try {
  app.use(favicon(__dirname + '/public/img/favicon/favicon-16x16.png'));   
} catch (err){
  console.log('Favicon not found in the required directory.')
}
//You can also configure useCreateIndex by passing it through the connection options.
mongoose.set('useCreateIndex', true);
//To opt in to using the new topology engine, use the below line:
mongoose.set('useUnifiedTopology', true);
////////////////////////////////////////////////////
///////   HEROKU VS LOCALHOST .ENV SWAP    ////////
//////////////////////////////////////////////////
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});
} else {
  mongoose.connect(process.env.MONGODB, {useNewUrlParser: true,ignoreUndefined: true});
}
//Mongo error trap.
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});
//Define the mongo enviroment
var db = mongoose.connection;
db.once('open', function() {
  // we're connected!
    console.log('\x1b[36m%s\x1b[0m',process.env.MONGODBNAME ,' : mongoose connection ok')
  //compile the schema for mongoose
});
 
////////////////////////////////////////////
///////   BRAINTREE INTEGRATION    ////////
//////////////////////////////////////////
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANTID,
  publicKey: process.env.PUBLICKEY,
  privateKey: process.env.PRIVATEKEY
});
/////////////////////////////////////////////
///////   HTTPS TRAFFIC REDIRECT    ////////
///////////////////////////////////////////
// Redirect all HTTP traffic to HTTPS
 function ensureSecure(req, res, next){
  if(req.headers["x-forwarded-proto"] === "https"){
  // OK, continue
  return next();
};
res.redirect('https://'+req.hostname+req.url);
};
// Handle environments
if (app.get('env') == 'production') {
  app.all('*', ensureSecure);
}
/////////////////////////////////////////////
///////   LOCALHOST PORT SETTING    ////////
///////////////////////////////////////////
app.set('port', process.env.PORT || parseFloat(process.env.LOCALHOSTPORT));
app.use(compression());
app.use(logger('dev'));
//This pumps up the payload to accomidate larger data sets
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//extend
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
//app.use(expressValidator());//this worked then did not , no idea why.
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  if(req.user){
    res.locals.user = JSON.parse(JSON.stringify(req.user));
  }
    res.locals.TRACKINGCODEGA = process.env.TRACKINGCODEGA;//expose the google analytics tracking code for use.
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
//DELETE
//app.use(express.static(path.join(__dirname, 'node_modules/jquery/')));//spicific directory for jquery
///////////////////////////////////////////////s
////     SET YOUR APP.JSON DETAILS        //// 
/////////////////////////////////////////////
var myModule = require('./app.json');
var sitename = myModule.sitename
var website = myModule.website
var sitedescription = myModule.sitedescription
var repo = myModule.repo
app.locals.sitename = sitename
app.locals.website = website
app.locals.sitedescription = sitedescription
app.locals.repo = repo
var partialsDir = ['views/partials']
app.use(function(req, res, next) {
  res.locals.sitedescription = sitedescription;
  next();
});
///////////////////////////////
////       ROUTING        //// 
/////////////////////////////



//////////////////////////////////////////////////////////////
////       GET THE HEAVYLIFTING DATABASE STRUCTURE        //// 
//////////////////////////////////////////////////////////////
const fs = require('fs');//use the file system plugin 
var rawdata = fs.readFileSync('./heavylifting.json'); // get the heavylifting json and parse into an object for use.
var collections = JSON.parse(rawdata); 
collections = collections.collections
/////////////////////////////////////////////////////////
////       USED FOR THE COLLECTION INJECTION        //// 
///////////////////////////////////////////////////////
app.use(function (req, res, next) {
  res.locals.collections = collections
  next();
})
///////////////////////////////////////////////
////       FRATERNATE NPM MODULE          //// 
/////////////////////////////////////////////
var fraternate = require("fraternate");
//Append the partial directory inside the NPM module.
partialsDir.push('./node_modules/fraternate/views/partials')
app.use('/', fraternate);
/////////////////////////////////////////////////
////       HEAVYLIFTING NPM MODULE          //// 
///////////////////////////////////////////////
var heavylifting = require("heavylifting");
//Append the partial directory inside the NPM module.
partialsDir.push('./node_modules/heavylifting/views/partials')
app.use('/', heavylifting);
///////////////////////////////////////////////////
////       CLEANER-WRASSE NPM MODULE          //// 
/////////////////////////////////////////////////
var cleaner_wrasse = require("cleaner-wrasse");
//Append the partial directory inside the NPM module.
partialsDir.push('./node_modules/cleaner-wrasse/views/partials')
app.use('/', cleaner_wrasse);
///////////////////////////////////////////////////
////       SEMINI NPM MODULE          //// 
/////////////////////////////////////////////////
var semini = require("semini");
//Append the partial directory inside the NPM module.
partialsDir.push('./node_modules/semini/views/partials')
app.use('/', semini);
/////////////////////////////////
////       HOME             //// 
///////////////////////////////
var HomeController = require('./controllers/home');
app.get('/',
  HomeController.index
);
app.get('/contact',
  HomeController.contact
); 
//////////////////////////////////////////
////        CREATE UNIQUE ID         //// 
////////////////////////////////////////
function create_uid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
  s4() + '-' + s4() + s4() + s4();
}
 
/////////////////////////////////////////
///////   HANDLEBARS HELPERS    ////////
///////////////////////////////////////
var hbs = exphbs.create({
  defaultLayout: __dirname+'/views/layouts/main',
  partialsDir:partialsDir,
  helpers: {
    ifEquals: function(arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },
    getNullsasblank :function(val) {
      if(val === undefined ||val =='undefined') {
        return "null";
      }
      return val;
    },
    debug: function(optionalValue) {
      console.log("Current Context");
      console.log("====================");
      console.log(this);
      if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
      }
    },
    toJSON : function(object) {
      return JSON.stringify(object, null, 2);
    },
    partial: function (name) {
      return name;
    },
    uniqueid: function (uniqueid) {
      return create_uid();
    },
    capitalizeFirst: function (str) {
      return str[0].toUpperCase() + str.slice(1, str.length);
    },
    'dots' : function(arg1,str) {
      if (str) {
        if (str.length > arg1)
          return str.substring(0,arg1) + '...';
        return str;}
      },
      'profile' : function(str) {
        if (str) {
          if (str.length > 550)
            return str.substring(0,550) + '...';
          return str;
        }
      }
    }
  });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
/////////////////////////////
////       500          //// 
/////////////////////////// 
app.use(function(err, req, res, next) {
  // log the error, treat it like a 500 internal server error
  // maybe also log the request so you have more debug information
  //log.error(err, req);
  // during development you may want to print the errors to your console
  console.log(err.stack,"trigger 500 errors");
  req.flash('error', { msg: JSON.stringify(err)});
  // send back a 500 with a generic message
  res.status(500);
  res.redirect('/500');
});



/////////////////////////////
////       500          //// 
///////////////////////////
app.get('/500', function(req, res){
  console.log('Calling the 500 error')
  res.render('500',{
    siteName : sitename,
    pagetitle : 'Error 500' + ' | '+sitename,
    layout:false
  });
}); 
/////////////////////////////
////       404          //// 
///////////////////////////
app.get('*', function(req, res){
  res.status(404).render('404',{
    siteName : sitename,
    pagetitle : 'Error 404' + ' | '+sitename,
    layout:false
  });
});

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});


module.exports = app;
