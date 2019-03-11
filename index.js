// ENTRY FILE

const server = require('./lib/server');
const cli = require('./lib/cli');

// Define App
const app = {};

// app init
app.init = () => {
  // server init
  server.init();

  // cli init
  setTimeout(()=>{
    cli.init();
  },50)
};

app.init();
