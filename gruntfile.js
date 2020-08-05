//Run with
//grunt
//View the registered helpers below to understand the scopes available.


const express = require('express');
var dotenv = require('dotenv');
dotenv.config()
var localhost = 'localhost:'+process.env.LOCALHOSTPORT



var myModule = require('./app.json');
var expected = myModule.website//Get the app.json details for the website.
var timestamp = new Date().getTime();




module.exports = function(grunt) {
	grunt.log.writeln('Starting the grunt');
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
		},mongodump: {
			options: {
				wait: false
			},
			path: 'c:/Program Files/MongoDB/Server/4.0/bin/',
			exec: 'mongodump -h localhost:27017 -d '+process.env.MONGODBNAME+' -o ../../../../../'+process.env.MONGODBNAME+'/localhostDB' //This will generate a site map using the local host.
		}
	},shell: {
		mongodumpdb: {
			command: [
			'cd/Program Files/MongoDB/Server/4.0/bin/',
			'mongodump -h localhost:27017 -d '+process.env.MONGODBNAME+' -o ../../../../../'+process.env.MONGODBNAME+'/localhostDB',
			].join('&&')
		},mongodbsitepull: {
			command: [
			'cd/Program Files/MongoDB/Server/4.0/bin/',
			'mongo '+process.env.MONGODBNAME+' --eval "db.dropDatabase()"',
			'mongodump  -h '+process.env.MONGODBURI+' -d '+process.env.MONGODBNAME+' -u '+process.env.MONGODBU+' -p '+process.env.MONGODBP+' -o backup/',
			'mongorestore -h localhost:27017 -d '+process.env.MONGODBNAME+' backup/'+process.env.MONGODBNAME+'/'
			].join('&&')
		},bumpcleanerwrasse: {
			command: [
			'cd node_modules',
			'cd cleaner-wrasse',
			'npm version patch',
			'cd..',
			'npm publish cleaner-wrasse',
			'npm install cleaner-wrasse@latest --save',
			].join('&&')
		},bumpsemini: {
			command: [
			'cd node_modules',
			'cd semini',
			'npm version patch',
			'cd..',
			'npm publish semini',
			'npm install semini@latest --save',
			].join('&&')
		},bumpheavylifting: {
			command: [
			'cd node_modules',
			'cd heavylifting',
			'npm version patch',
			'cd..',
			'npm publish heavylifting',
			'npm install heavylifting@latest --save',
			].join('&&')
		},bumpfraternate: {
			command: [
			'cd node_modules',
			'cd fraternate',
			'npm version patch',
			'cd..',
			'npm publish fraternate',
			'npm install fraternate@latest --save',
			].join('&&')
		}
	},
	zip_directories: {
		irep: {
			files: [{
				filter: 'isDirectory',
				expand: true,
				cwd: '../'+process.env.MONGODBNAME+'/localhostDB',
				src: ['*'],
				dest: '../'+process.env.MONGODBNAME+'/localhostDBbackup/'+timestamp+"_localcopy"
			}]
		}
	},
	concurrent: {
		options: {
			logConcurrentOutput: true
		},
		mongodbdumpandzip: [ ['shell:mongodumpdb','zip_directories'] ], //dump and zip the mongo database.
		mongodbpullfromserver: [ ['shell:mongodumpdb','zip_directories','shell:mongodbsitepull'] ], //dump and zip the mongo database.
		starttests: [ 'nodemon' ,['run:runTests', 'wait:runTests']],//Open a new nodemon and run the server.
		bumpcleanerwrasse: [['shell:bumpsemini'], ['shell:bumpcleanerwrasse'] ,['shell:bumpfraternate'], ['shell:bumpheavylifting']]//Open a new nodemon and run the server.
	},  
	bump: {
	    options: {
	      files: ['./semini/package.json','./fraternate/package.json','./heavylifting/package.json','./cleaner-wrasse/package.json']
	    }
	  },
});

	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-zip-directories');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-run');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-bump');
//////////////////////////////////////
////    TASK REGISTRATION AREA   /////
//////////////////////////////////////

//Notes : these are used to backup from the server. the first is stepped , the second included the first. The first is for precautions.

//grunt mongodbdump //Used for dumping the current local database to /localhostdb , and saving as a zip in the dbbackup.
grunt.registerTask('mongodbdump',[
	'concurrent:mongodbdumpandzip'
	]);
//grunt mongodbpullfromserver //Used for dumping the current local database to /localhostdb , and saving as a zip in the dbbackup.
//// DANGER WILL ROBINSON DANGER /////
grunt.registerTask('mongodbpullfromserver',[
	'concurrent:mongodbpullfromserver'
	]);

//grunt runserveranddotests //start the nodemon server and perform tests.
grunt.registerTask('runserveranddotests',[
	'concurrent:starttests'
	]);

//grunt jono // bump the version numbers for the packages.
grunt.registerTask('bumpjono',[
	'concurrent:bumpcleanerwrasse'
	]);


};
 
 

//Notes :  The registered helpers to follow are used to update the current webplatform to the latest working copy.

//1. Prompt which file to update : Fraternate ; Shiftbulk ; Battlefront.
//2. Notify the user the the current directory files will be migrated to the that selected folder.
	//Note : do not copy .env or heavylifting.json.
//3. Prompt to install NPM update.
//4. run npx depcheck to check for unused dependancies.
//5. Install the NPM update .
//6. Copy accross
	//6a. Site map
	//6b. Tests
	//6c. Grunt
//7. Nodemon the server.
//8. Run the tests.

//9. Need to set up the readme for NPM and github , using semini.
//10. Issue with the sitemap and robots.txt not being picked up.
//11. Remove unused JavaScript
//12. Reduce server response times (TTFB)
//13. warning Minify CSS




/*
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
};*/