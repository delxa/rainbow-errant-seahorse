require('babel-register')
var vows = require('vows')
var assert = require('assert')

// Because the rest of
var Checkout = require('../app/modules/Checkout').default // Default is used because Checkout is an ES6 class.
var products = require('../data/products.json')

vows.describe('01 Class Implements Correctly')
  .addBatch({

    // Test basics of class instantiation
    '01 GIVEN I instance Checkout with no params, ': {
      topic: new Checkout(),
      'WHEN I instance the class, ': {
        topic: (topic) => {
          return topic
        },
        'THEN I should have a new instance of Checkout': (topic) => {
          assert.instanceOf(topic, Checkout)
        },
        'THEN I should have Checkout with no Pricing rules': (topic) => {
          assert.isFalse(topic.rules)
        },
        'THEN I should have Checkout with no Items': (topic) => {
          assert.lengthOf(topic.items, 0)
        },
        'THEN I should have Checkout with a Zero Total': (topic) => {
          assert.equal(topic.total(), 0)
        },
        'AND WHEN I add two Standout Ads to the cart, ': {
          topic: (topic) => {
            return topic.add(products[1]).add(products[1])
          },
          'THEN I should now have two items in the cart': (topic) => {
            assert.lengthOf(topic.items, 2)
          },
          'THEN I should now have a total of $645.98': (topic) => {
            assert.equal(topic.total(), 645.98)
          }
        }
      }
    },

    // Test Class instantiation with Items
    '02 GIVEN I instance Checkout with only the Items param, ': {
      topic: new Checkout(false, [products[0], products[0], products[2], products[2]]),
      'WHEN I instance with 2 x Classic and 2 x Premium Ads, ': {
        topic: (topic) => {
          return topic
        },
        'THEN I should have Checkout with no Pricing rules': (topic) => {
          assert.isFalse(topic.rules)
        },
        'THEN I should have Checkout with 4 x Items': (topic) => {
          assert.lengthOf(topic.items, 4)
        },
        'THEN I should have Checkout with a total of $1,329.96': (topic) => {
          assert.equal(topic.total(), 1329.96)
        },
        'AND WHEN I then empty the cart, ': {
          topic: (topic) => {
            return topic.empty()
          },
          'THEN I should now have 0 items in the cart': (topic) => {
            assert.lengthOf(topic.items, 0)
          },
          'THEN I should now have a total of 0': (topic) => {
            assert.equal(topic.total(), 0)
          }
        }
      }
    },

    // Test Class instantiation with Items
    '03 GIVEN I instance Checkout with only the Rules param, ': {
      topic: new Checkout([{
        ruleType: 'unit',
        adType: 'classic',
        qty: 3,
        discountedUnits: 1
      },
      {
        ruleType: 'price',
        adType: 'standout',
        breaks: [
          {
            qty: 0,
            price: 299.99
          }
        ]
      }]),
      'WHEN I instance with 1 x Price Rule and 1 x Unit rule, ': {
        topic: (topic) => {
          return topic
        },
        'THEN I should have Checkout with 2 Pricing rules': (topic) => {
          assert.lengthOf(topic.rules, 2)
        }
      }
    }

  })
  .export(module)
