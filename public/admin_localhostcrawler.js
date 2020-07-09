//Run with
//node ./public/admin_localhostcrawler.js
const request = require('supertest');
const express = require('express');
var dotenv = require('dotenv');
dotenv.config()
const SitemapGenerator = require('sitemap-generator');
var localhost = 'localhost:'+process.env.LOCALHOSTPORT

var myModule = require('../app.json');
var expected = myModule.website//Get the app.json details for the website.

// create generator
const generator = SitemapGenerator(localhost, {
  stripQuerystring: false,
  maxDepth: 0,
  baseUrl : expected,
  filepath: './public/sitemap.xml',
  ignore: url => {
    // Prevent URLs from being added that contain `<pattern>`.
    return /semini/g.test(url)
  }
});
const sitemap = generator.getSitemap()
// register event listeners
generator.on('start', () => {
  // sitemaps created
  sitemap.addURL('/issues/view/')
});
generator.on('error', (error) => {
  console.log(error);
  // => { code: 404, message: 'Not found.', url: 'http://example.com/foo' }
});
generator.on('ignore', (url) => {
  // log ignored url
  //console.log('Ignore the following : ',url);
});
generator.on('done', () => {
  // sitemaps created
  console.log("Rewrite the sitmap from localhost to url.")
});
// start the crawler
generator.start();




