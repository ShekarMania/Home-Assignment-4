/*
*
* Server
*
*/
const http =  require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const helpers = require('./helpers')
const handlers = require('./handlers')
const fs = require('fs')
const path = require('path')
const config = require('./config')

const server = {}

server.http = http.createServer((req, res) => {
  server.unifiedServer(req, res)
})


server.init = () => {
  server.http.listen(process.env.PORT ? process.env.PORT : config.httpPort, () => {
    console.log('\x1b[32m%s\x1b[0m', `Server is listening up at port ${config.httpPort} and running ${config.envName}`)
  })
}

server.unifiedServer = (req, res) => {
  const payload = {}
  const parsedUrl = url.parse(req.url, true)
  const queryStringObject = parsedUrl.query
  let path = parsedUrl.pathname
  path = path.replace(/^\/+|\/$/g, '')
  const method = req.method.toLowerCase()
  const headers = req.headers

  // Get Payload if any
  let buffer = ''
  const decoder = new StringDecoder('utf-8')
  req.on('data', (data) => {
    buffer += decoder.write(data)
  })
  req.on('end', ()=>{
    buffer += decoder.end()

    // Construct Data
    const data = {
      'path': path,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': helpers.parseJsonToObject(buffer)
    }

    const chosenHandler = typeof (server.router[path]) !== 'undefined' ? server.router[path] : handlers.notFound

    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200
      payload = typeof(payload) == 'object' ? payload : {}

      const payloadString = JSON.stringify(payload)
      res.writeHead(statusCode, {
        'Content-Type': 'application/json'
      })
      res.end(payloadString)
      console.log('Response ', statusCode, payload, method, queryStringObject)
    })
  })
}

server.router = {
  'users' : handlers.users,
  'tokens': handlers.tokens,
  'login' : handlers.login,
  'logout': handlers.logout,
  'cart' : handlers.cart,
  'menu': handlers.menu,
  'order': handlers.order
}

module.exports = server
