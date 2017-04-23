'use strict'

import express from 'express'
import Checkout from '../modules/Checkout'
import Products from '../../data/products.json'
import Rules from '../../data/rules.json'

let router = express.Router()

// Define routes
router.get('/products', (req, res) => {
  res.json(Products) // IRL, this would come async from a database or other API/service.
})

// Get a list of items in the cart at present
router.get('/checkout/items', (req, res) => {
  res.json(req.session.items || [])
})

// Add a new item to cart
router.post('/checkout/items', (req, res) => {
  var co = new Checkout(req.session.rules || false, req.session.items || [])
  co.add(req.body)
  req.session.items = co.items
  res.json({status: 200, message: 'Added to cart'})
})

// Remove an item from the cart
router.get('/checkout/delete', (req, res) => {
  res.json({status: 'failure', message: 'Not yet implemented.'})
})

// Get the total of the cart
router.get('/checkout/total', (req, res) => {
  var co = new Checkout(req.session.rules || false, req.session.items || [])
  res.json({total: co.total()})
})

// Switch customers
router.get('/checkout/switch/:customer', (req, res) => {
  let newRules = (Rules.hasOwnProperty(req.params.customer)) ? Rules[req.params.customer].rules : false

  if (newRules) {
    req.session.rules = newRules
    return res.json({status: 200, message: `switched to ${req.params.customer}`})
  }

  res.json({status: 'failure', message: `No rules for ${req.params.customer}`})
})

// Eviscerate the session to kick off again
router.get('/checkout/destroy', (req, res) => {
  req.session.destroy(() => {
    res.json({status: 'success', message: 'Eviscerated session'})
  })
})

export default router
