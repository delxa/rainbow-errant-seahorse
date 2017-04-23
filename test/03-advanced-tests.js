require('babel-register')

var vows = require('vows')
var assert = require('assert')

var Checkout = require('../app/modules/Checkout').default // Default is used because Checkout is an ES6 class.
var products = require('../data/products.json')
var rules = require('../data/rules.json')

vows.describe('03 Advanced Pricing Rule Tests')

  .addBatch({

    // Test price breaks
    // Amazon has a stepped set of Price breaks for 0, 5 and 10 qty. This should trigger only the price for 10.
    '01 GIVEN the customer is AMAZON, ': {
      topic: new Checkout(rules.Amazon.rules),
      'WHEN I buy 12 x Standout Ads, ': {
        topic: (topic) => {
          addProductManyTimes(topic, products[1], 12)
          return topic
        },
        'THEN the total should be $3,491.88': (topic) => {
          assert.equal(topic.total(), 3491.88)
        }
      }
    },

    // Test a Buy 10 get two free scenario.
    '02 GIVEN the customer is AMAZON, ': {
      topic: new Checkout(rules.Amazon.rules),
      'WHEN I buy 24 x Classic Ads, ': {
        topic: (topic) => {
          addProductManyTimes(topic, products[0], 24)
          return topic
        },
        'THEN the total should be $5,399.80': (topic) => {
          assert.equal(topic.total(), 5399.8)
        }
      }
    },

     // Test how multiple rules are applied
    '03 GIVEN the customer is FORD, ': {
      topic: new Checkout(rules.Ford.rules),
      'WHEN I buy 5 x Classic Ads, 2 x Standout Ads, and 5 Premium Ads, ': {
        topic: (topic) => {
          addProductManyTimes(topic, products[0], 5)
          addProductManyTimes(topic, products[1], 2)
          addProductManyTimes(topic, products[2], 5)
          return topic
        },
        'THEN the total should be $3,649.89': (topic) => {
          assert.equal(topic.total(), 3649.89)
        }
      }
    },

    // Let's see what happens when Ford tries to abuse their 5 for 4 offer
    // At 25, they should be only be paying for 20
    '04 GIVEN the customer is FORD, ': {
      topic: new Checkout(rules.Ford.rules),
      'WHEN I buy 25 x Classic Ads, ': {
        topic: (topic) => {
          addProductManyTimes(topic, products[0], 25)
          return topic
        },
        'THEN the total should be $5,399.80': (topic) => {
          assert.equal(topic.total(), 5399.8)
        }
      }
    },

    // Lets try one where we nudge up to our freebee but don't quite qualify.
    '05 GIVEN the customer is FORD, ': {
      topic: new Checkout(rules.Ford.rules),
      'WHEN I buy 4 x Classic Ads, ': {
        topic: (topic) => {
          topic.empty()
          addProductManyTimes(topic, products[0], 4)
          return topic
        },
        'THEN the total should be $1,079.96': (topic) => {
          assert.equal(topic.total(), 1079.96)
        }
      }
    }

  })
  .export(module)

// OK, a bit cheap but I hate repeating myself
let addProductManyTimes = (topic, product, times) => {
  let d = 0
  do {
    topic.add(product)
    d++
  } while (d < times)
  return topic
}
