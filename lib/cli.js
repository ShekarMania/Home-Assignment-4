/*
 * CLI-related tasks
 *
 */

 // Dependencies
var readline = require('readline');
var util = require('util');
var debug = util.debuglog('cli');
var events = require('events');
class _events extends events{};
var e = new _events();
var _data = require('./data');
const helpers = require('./helpers')
const config = require('./config')
// Instantiate the cli module object
var cli = {};

// Input handlers
e.on('man',function(str){
  cli.responders.help();
});

e.on('help',function(str){
  cli.responders.help();
});

e.on('exit',function(str){
  cli.responders.exit();
});

e.on('menu',function(str){
  cli.responders.menu();
});

e.on('list users',function(str){
  cli.responders.listUsers();
});

e.on('more user info',function(str){
  cli.responders.moreUserInfo(str);
});

e.on('list orders',function(){
  cli.responders.listOrders();
});

e.on('more order info',function(str){
  cli.responders.moreOrderInfo(str);
});


// Responders object
cli.responders = {};

// Help / Man
cli.responders.help = function(){

  // Codify the commands and their explanations
  var commands = {
    'exit' : 'Kill the CLI (and the rest of the application)',
    'man' : 'Show this help page',
    'help' : 'Alias of the "man" command',
    'menu' : 'Get Menu items available in the inventory',
    'List users' : 'Show a list of all the registered (past 24 hours) users in the system',
    'More user info --{userId}' : 'Show details of a specified user',
    'List orders' : 'Show a list of all the orders available to be read (past 24 hours)',
    'More order info --{orderId}' : 'Show details of a specified order',
  };

  // Show a header for the help page that is as wide as the screen
  cli.horizontalLine();
  cli.centered('CLI MANUAL');
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Show each command, followed by its explanation, in white and yellow respectively
  for(var key in commands){
     if(commands.hasOwnProperty(key)){
        var value = commands[key];
        var line = '      \x1b[33m '+key+'      \x1b[0m';
        var padding = 60 - line.length;
        for (i = 0; i < padding; i++) {
            line+=' ';
        }
        line+=value;
        console.log(line);
        cli.verticalSpace();
     }
  }
  cli.verticalSpace(1);

  // End with another horizontal line
  cli.horizontalLine();

};

// Create a vertical space
cli.verticalSpace = function(lines){
  lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
  for (i = 0; i < lines; i++) {
      console.log('');
  }
};

// Create a horizontal line across the screen
cli.horizontalLine = function(){

  // Get the available screen size
  var width = process.stdout.columns;

  // Put in enough dashes to go across the screen
  var line = '';
  for (i = 0; i < width; i++) {
      line+='-';
  }
  console.log(line);


};

// Create centered text on the screen
cli.centered = function(str){
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';

  // Get the available screen size
  var width = process.stdout.columns;

  // Calculate the left padding there should be
  var leftPadding = Math.floor((width - str.length) / 2);

  // Put in left padded spaces before the string itself
  var line = '';
  for (i = 0; i < leftPadding; i++) {
      line+=' ';
  }
  line+= str;
  console.log(line);
};

// Exit
cli.responders.exit = function(){
  process.exit(0);
};

// Stats
cli.responders.menu = function(){
  cli.centered("Menu");
  cli.verticalSpace();
  cli.verticalSpace();
  for(let i = 0; i < Object.keys(config.menuItems).length; i++ ){
    let line = "Item Name: "+ config.menuItems[Object.keys(config.menuItems)[i]]["name"] + " - Price: "+ config.menuItems[Object.keys(config.menuItems)[i]]["price"];
    cli.centered(line);
    cli.verticalSpace();
  }
};

// List Users
cli.responders.listUsers = function(){
  _data.list('users',function(err,userIds){
    if(!err && userIds && userIds.length > 0){
      cli.verticalSpace();
      userIds.forEach(function(userId){
        _data.read('users',userId,function(err,userData){
          if(!err && userData){
            var line = 'Name: '+userData.name+' Email: '+userData.email+' Orders: ';
            var numberOfChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
            line+=numberOfChecks;
            if(helpers.past24Hours(userData.createdAt)){
              console.log(line);
              cli.verticalSpace();
            }
          }
        });
      });
    }
  });
};

// More user info
cli.responders.moreUserInfo = function(str){
  // Get ID from string
  var arr = str.split('--');
  var userId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if(userId){
    // Lookup the user
    _data.read('users',userId,function(err,userData){
      if(!err && userData){
        // Remove the hashed password
        delete userData.password;

        // Print their JSON object with text highlighting
        cli.verticalSpace();
        console.dir(userData,{'colors' : true});
        cli.verticalSpace();
      }
    });
  }
};

// List Logs
cli.responders.listOrders = function(){
  _data.list('orders',function(err,orders){
    if(!err && orders && orders.length > 0){
      cli.verticalSpace();
      orders.forEach(function(order){
        _data.read('orders',order,function(err,orderData){
          if(!err && orderData){
            var line = 'Receipient Email: '+orderData.userEmail+' Order Id: '+order;
            if(helpers.past24Hours(orderData.createdAt)){
              console.log(line);
              cli.verticalSpace();
            }
          }
        });
      });
    }
  });
};

// More logs info
cli.responders.moreOrderInfo = function(str){
  // Get ID from string
  var arr = str.split('--');
  var orderId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if(orderId){
    // Lookup the user
    _data.read('orders',orderId,function(err,orderData){
      if(!err && orderData){
        // Print their JSON object with text highlighting
        cli.verticalSpace();
        console.dir(orderData,{'colors' : true});
        cli.verticalSpace();
      }
    });
  }
};

// Input processor
cli.processInput = function(str){
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
  // Only process the input if the user actually wrote something, otherwise ignore it
  if(str){
    // Codify the unique strings that identify the different unique questions allowed be the asked
    var uniqueInputs = [
      'man',
      'help',
      'exit',
      'menu',
      'list users',
      'more user info',
      'list orders',
      'more order info'
    ];

    // Go through the possible inputs, emit event when a match is found
    var matchFound = false;
    var counter = 0;
    uniqueInputs.some(function(input){
      if(str.toLowerCase().indexOf(input) > -1){
        matchFound = true;
        // Emit event matching the unique input, and include the full string given
        e.emit(input,str);
        return true;
      }
    });

    // If no match is found, tell the user to try again
    if(!matchFound){
      console.log("Sorry, try again");
    }

  }
};

// Init script
cli.init = function(){

  // Send to console, in dark blue
  console.log('\x1b[34m%s\x1b[0m','The CLI is running');

  // Start the interface
  var _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ''
  });

  // Create an initial prompt
  _interface.prompt();

  // Handle each line of input separately
  _interface.on('line', function(str){

    // Send to the input processor
    cli.processInput(str);

    // Re-initialize the prompt afterwards
    _interface.prompt();
  });

  // If the user stops the CLI, kill the associated process
  _interface.on('close', function(){
    process.exit(0);
  });

};

 // Export the module
 module.exports = cli;
