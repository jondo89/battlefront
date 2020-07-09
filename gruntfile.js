//Run with
//grunt
const express = require('express');
var dotenv = require('dotenv');
dotenv.config()
var localhost = 'localhost:'+process.env.LOCALHOSTPORT

var myModule = require('../app.json');
var expected = myModule.website//Get the app.json details for the website.

module.exports = function(grunt) {
	grunt.initConfig({
		nodemon: {
			dev: {
				script: 'index.js'
			}
		},
		run: {
			startServ: {
				options: {
					wait: false
				},
        //cmd: "executable",  
        args: [
        '/index.js'
        ]
    },runTests: {
    	options: {
    		wait: false
    	},
       exec: 'npm run test:watch' // <-- use the exec key.
   },sitemap: {
    	options: {
    		wait: false
    	},
       exec: 'node ./public/admin_localhostcrawler.js' //This will generate a site map using the local host.
   }
},
open: {
	startServ: {
		path: localhost,
		app: 'Google Chrome'
	}
},
concurrent: {
	options: {
		logConcurrentOutput: true
	},
	//target1: ['nodemon'],
	//target2: ['run:runTests', 'wait:runTests']	
	target: [ 'nodemon','open:startServ',['run:runTests', 'wait:runTests'],['run:sitemap', 'wait:sitemap']]
}
});
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-run');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.registerTask('default',[
		'concurrent:target'
		]);
};