Code Test
===================
Matt Bell | matt@mattbell.name

Introduction
--------------

Hi there and thanks for your consideration. This README describes a backend-ish implementation of the Checkout logic described in `seek-store.md`

Getting it Running
-------------------

This is a JS solution so you'll need Node.js (4.3.0 >) and NPM setup on your machine.

1. `git clone https://github.com/delxa/rainbow-errant-seahorse` to grab the source
2. `npm install` to grab dependencies
3. `npm test` to run Unit Tests against the `Checkout` Class
4. `npm start` will spin up the API on `localhost:9000`

Note: Using a bit of Babel behind the scenes to handle the new import/export syntax. This runs in Node 4.3.0 and up.

Solution
---------------

Majority of effort put into this was around the Checkout Class, Pricing Rule Schema and associated Unit Tests.  I've done a very basic Express-based API to demonstrate how the Checkout Class could be used in a backend context.

### Checkout Class
`Checkout` is an ES6 Class handling the cart manipulation, totaling and implementation of the per-client pricing rules. It is instantiated with the pricing rules for a particular client and can optionally accept an array of existing items. The latter is useful when the items are being pulled from session stores (cookie, redis, etc)

#### Implementing the Class

Been able to get pretty close to what was detailed in the `seek-store.md` in terms of syntax.  add() returns `this` so that the method can be chained if needed.

    var co = new Checkout(nikePricingRules)
    co
      .add(item)
      .add(item)
      .add(item)
    let total = co.total()


### Pricing Rule Schema
You can check this out in `data/rules.json`  Given the requirements, I was able to synthesize discount rules down to two main types:

- 'price': Where special pricing kicks in at a number of specified products has been added, starting from 0. This type of rule can specify any number of price breaks and the most appropriate one will be applied in the cart.
- 'unit': Where a x units will be free for every y units added to cart, with an additional maximum of z. Much like in real life, the Checkout attempts to discount the cheapest of the matching items for the rule present in the cart.


#### Price Schema Examples
Here are some examples of price rules:

The customer is offered a discount on a particular Ad type, irrespective of quantity:
    
    {
      "ruleType": "price",
      "adType": "standout",
      "breaks": [
        {
          "qty": 0,
          "price": 299.99
        }
      ]
    }

The customer is offered a discount on a particular Ad type, after 5 units:
    
    {
      "ruleType": "price",
      "adType": "standout",
      "breaks": [
        {
          "qty": 5,
          "price": 299.99
        }
      ]
    }

The customer is offered multiple price breaks on a particular Ad type:
    
    {
      "ruleType": "price",
      "adType": "standout",
      "breaks": [
        {
          "qty": 0,
          "price": 320.99
        },
        {
          "qty": 5,
          "price": 310.99
        },
        {
          "qty": 10,
          "price": 299.99
        }
      ]
    }


#### Unit Schema Examples
Here are some examples of unit rules:

The customer is offered a 3 for the price of 2 deal on Classic Ads:
    
    {
      "ruleType": "unit",
      "adType": "classic",
      "qty": 3,
      "discountedUnits": 1
    }

The customer is offered a 3 for the price of 2 deal on Classic Ads but to a maximum of 5 free Ads:
    
    {
      "ruleType": "unit",
      "adType": "classic",
      "qty": 3,
      "discountedUnits": 1,
      "limit": 5
    }


### Unit Testing

This solution has Unit Tests written using Vows.js.  This is similar in many ways to Mocha, however, allows tests to be executed in parallel. This is the first time I've used Vows so i was interested to evaluate it's strengths and weaknesses.

- Tests are available in the `/test` folder
- 01-class-tests make sure the class can be instantiated correctly and passed in properties are correctly applied
- 02-basic-tests cover the scenarios specfically mentioned in `seek-store.md` in testing the pricing rules for customers
- 03-advanced-tests are designed to try and break the rules a little and cover some more edge cases
- Run `npm test` to execute the suite.


### Server-side Implementation

For the purpose of this, I've written a quick Express App that implements the Checkout library on a bunch of endpoints designed to power a front-end app.  I've dropped in express-session to maintain the items and active customer rules and use these when each of the routes re-instantiate the Checkout library.


#### Endpoints

- GET `/api/products` Get a list of available products
- GET `/api/checkout/items` Get a list of items in cart
- POST `/api/checkout/items` Add a to product to cart. Payload: JSON representation of the product to add
- GET `/api/checkout/switch/{customerName}` Changes the active rule set to that of the named customer
- GET `/api/checkout/total` Gets the total of the current items in cart, less any discounts
- GET `/api/checkout/destroy` Wipes the session, removing items and rules, so that you can start afresh.


### Front-end Implementation

Given that I'm interviewing for a front-end position, might have been prudent to demonstrate this option instead.  Here's a couple of points:

- The above class will work on the front-end and is possibly most useful for use with Angular, wrapped as a service.
- In a React environment, the checkout logic would have been implemented using a Reducer in Redux. The brief was rather prescriptive in terms of implementation so I decided not to depart from that convention. The inner logic of the pricing though would still be the same.
- Happy to demonstrate other projects i've worked on that have more of the front end side.
