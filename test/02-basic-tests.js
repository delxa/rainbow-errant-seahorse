require('babel-register')
var vows = require('vows')
var assert = require('assert')

// Because the rest of
var Checkout = require('../app/modules/Checkout').default // Default is used because Checkout is an ES6 class.
var products = require('../data/products.json')
var rules = require('../data/rules.json')

vows.describe('02 Basic Pricing Rule Tests')
  .addBatch({

    // Test Default Pricing Logic
    '01 GIVEN the customer has only the default pricing, ': {
      topic: new Checkout(),
      'WHEN I buy 1 of each Ad Type, ': {
        topic: (topic) => {
          return topic
            .add(products[0])
            .add(products[1])
            .add(products[2])
        },
        'THEN the total should be $987.97': (topic) => {
          assert.equal(topic.total(), 987.97)
        }
      }
    },

    // Test Unilever's Discount Logic
    '02 GIVEN that the customer is UNILEVER, ': {
      topic: new Checkout(rules.Unilever.rules),
      'WHEN I buy 3 x Classic Ads and 1 x Premium Ad, ': {
        topic: (topic) => {
          return topic
            .add(products[0])
            .add(products[0])
            .add(products[0])
            .add(products[2])
        },
        'THEN the total should be $934.97': (topic) => {
          assert.equal(topic.total(), 934.97)
        }
      }
    },

    // Test Apple's Discount Logic
    '03 GIVEN that the customer is APPLE, ': {
      topic: new Checkout(rules.Apple.rules),
      'WHEN I buy 3 x Standout Ads and 1 x Premium Ad, ': {
        topic: (topic) => {
          return topic
            .add(products[1])
            .add(products[1])
            .add(products[1])
            .add(products[2])
        },
        'THEN the total should be $1,294.96': (topic) => {
          assert.equal(topic.total(), 1294.96)
        }
      }
    },

    // Test Nike's Discount Logic
    '04 GIVEN that the customer is NIKE, ': {
      topic: new Checkout(rules.Nike.rules),
      'WHEN I buy 4 x Premium Ads, ': {
        topic: (topic) => {
          return topic
            .add(products[2])
            .add(products[2])
            .add(products[2])
            .add(products[2])
        },
        'THEN the total should be $1,519.96': (topic) => {
          assert.equal(topic.total(), 1519.96)
        }
      }
    }

  })
  .export(module)

