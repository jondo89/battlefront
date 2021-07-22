var User = require('../models/User');
//set the plugin controller directory
var directory =  '../'
///////////////////////////////////////////////
////     SET YOUR APP.JSON DETAILS        //// 
/////////////////////////////////////////////
//Not working ? try double dots on the json url..
var myModule = require('../app.json');
var sitename = myModule.sitename
var tagline = myModule.tagline
var website = myModule.website
var repo = myModule.repo
///////////////////////////////////////
////       HOME CONTROLLER        //// 
/////////////////////////////////////
exports.index = function(req, res) {
//Perform Routing for Varios user type on the home page.
if (req.user) {
  if (req.user.firstsignup == '/signup-step2') {
    res.redirect('/signup-step2')
  } else {
    if (!req.user.image) {
      req.flash('success', { msg: 'Get started by customizing your user account. <a href="/users/'+req.user.username+'/settings/profile" class="btn btn-outline-secondary">Edit your profile</a>' });
      res.redirect('/users/'+req.user.username)
/*
            res.render('../node_modules/fraternate/views/splash', {
                organizations : req.organizations,
                organizationsParse:req.organizationsParse,
                pagetitle: req.user.username +' · '+sitename+'',
                siteName : sitename,
              });*/
            } else {
             res.redirect('/users/'+req.user.username)
            //this is a good feature , but late stage .
            /*
           res.render('../node_modules/fraternate/views/splash', {
            organizations : req.organizations,
            organizationsParse:req.organizationsParse,
            pagetitle: req.user.username +' · '+sitename+'',
            siteName : sitename ,
        });
        */
      }
    }
  } else {
    res.render('../public/homepage/index', {
      layout: false,
      siteName : sitename,
      pagetitle: sitename+' · '+tagline,
      sitekey:process.env.SITE_KEY,
      collections : res.locals.collections
    });
  }
};
//////////////////////////////////////////
////       CONTACT CONTROLLER        //// 
////////////////////////////////////////
exports.contact = function(req, res) {
  res.render('contact', {
    pagetitle: 'Contact Us · '+sitename+'',
    siteName : sitename,
    layout: false,
  });
};
////////////////////////////////////////////
////       WORKSPACE CONTROLLER        //// 
//////////////////////////////////////////
exports.workspace = function(req, res) {
  var organization_name = req.params['organization_name']
  var username = req.params['username']
  var slug = req.params['slug']
  if (!organization_name) {
    organization_name =''
    var title =  req.user.username +' · '+sitename+''
  } else {
    var title = organization_name +' · '+sitename+''
  }
  if (req.user) {
   res.render('../views/workspace', {
    layout:false,
    organizations : req.organizations,
    organizationsParse:req.organizationsParse,
    pagetitle: title,
    siteName : sitename ,
    username:username,
    organization_name : organization_name,
    slug : slug,
    workspace :true,
  });
 } else {
  res.redirect('/')
}
};
///////////////////////////////////////////////////
////       WORKSPACE/PROJECT CONTROLLER        //// 
///////////////////////////////////////////////////
exports.workspace_projects = function(req, res) {
  var organization_name = req.params['organization_name']
  var username = req.params['username']
  var slug = req.params['slug']
  if (!organization_name) {
    organization_name =''
    var title =  req.user.username +' · '+sitename+''
  } else {
    var title = organization_name +' · '+sitename+''
  }
  if (req.user) {
   res.render('../views/workspace_project', {
    layout:false,
    organizations : req.organizations,
    organizationsParse:req.organizationsParse,
    pagetitle: title,
    siteName : sitename ,
    username:username,
    organization_name : organization_name,
    slug : slug,
    workspace :true,
  });
 } else {
  res.redirect('/')
}
};
////////////////////////////////////////////////////////////
////       WORKSPACE/PROJECT CONTROLLER/TEMPALTE       //// 
///////////////////////////////////////////////////////////
exports.workspace_projects_template = function(req, res) {
  var organization_name = req.params['organization_name']
  var template = req.params['template']
  var username = req.params['username']
  var slug = req.params['slug']
  if (!organization_name) {
    organization_name =''
    var title =  req.user.username +' · '+sitename+''
  } else {
    var title = organization_name +' · '+sitename+''
  }
  if (req.user) {
   res.render('../views/partials_workspace/'+template, {
    layout:false,
    organizations : req.organizations,
    organizationsParse:req.organizationsParse,
    pagetitle: title,
    siteName : sitename ,
    username:username,
    organization_name : organization_name,
    slug : slug,
    workspace :true,
  });
 } else {
  res.redirect('/')
}
};


