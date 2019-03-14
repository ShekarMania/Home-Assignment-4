// Config file

const config = {}

config.default = {
  envName : 'localhost',
  httpPort : 3000,
  httpsPort : 3001,
  hashingSecret : 'thereAreNoSecrets',
  stripeApiKey: 'sk_test_9xxxxxxxxxxxxxxxxxxxxxxH',
  mailgun: {
    domainName: 'sandbox2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxd.mailgun.org',
    host: 'api.mailgun.net',
    authUsername: 'api',
    privateKey: '9xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxc-7xxxxxx5-cxxxxxx5',
    from: 'chandrasekhar@sandbox2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxd.mailgun.org',
    to: 'chandrasekhar.kohli@gmail.com'
  },
  menuItems: {
    "1": {
      name: 'Menu Item 1',
      price: 10,
    },
    "2": {
      name: 'Menu Item 2',
      price: 20
    },
    "3": {
      name: 'Menu Item 3',
      price: 25
    },
    "4": {
      name: 'Menu Item 4',
      price: 35
    },
    "5": {
      name: 'Menu Item 5',
      price: 17
    },
    "6": {
      name: 'Menu Item 6',
      price: 25
    }
  }
}

config.production = {
  envName : 'production',
  httpPort : 5000,
  httpsPort : 5001,
  hashingSecret : 'thereAreNoSecrets',
  stripeApiKey: 'sk_test_9xxxxxxxxxxxxxxxxxxxxxxH',
  mailgun: {
    domainName: 'sandbox2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxd.mailgun.org',
    host: 'api.mailgun.net',
    authUsername: 'api',
    privateKey: '9xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxc-7xxxxxx5-cxxxxxx5',
    from: 'chandrasekhar@sandbox2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxd.mailgun.org',
    to: 'chandrasekhar.kohli@gmail.com'
  },
  menuItems: {
    "1": {
      name: 'Menu Item 1',
      price: 10,
    },
    "2": {
      name: 'Menu Item 2',
      price: 20
    },
    "3": {
      name: 'Menu Item 3',
      price: 25
    },
    "4": {
      name: 'Menu Item 4',
      price: 35
    },
    "5": {
      name: 'Menu Item 5',
      price: 17
    },
    "6": {
      name: 'Menu Item 6',
      price: 25
    }
  }
}

const chosenConfig = process.env.NODE_ENV == 'production' ? config.production : config.default

module.exports = chosenConfig
