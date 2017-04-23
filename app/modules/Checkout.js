'use strict'

/* Class representing a Checkout with customisable Pricing Rules */
class Checkout {

  /**
     * Instance the Checkout.
     * @constructor
     * @param {Object[]} [rules] - The Customer-specific pricing rules.
     * @param {Object[]} [items] - Prepopulate the items in the checkout. Useful for restoring from session/state
  */
  constructor (rules, items) {
    this.rules = rules || false
    this.items = items || []
    this.subtotal = 0
    this.grandtotal = 0
    this.discounts = 0
  }

  /**
     * Add an Item to the Cart
     * @param {Object} item - The ProductItem to be added.
     * @todo Add a qty parameter to make bulk adding easier.
     * @returns {Object} this is returned to make the add method chainable.
  */
  add (item) {
    this.items.push(item)
    return this
  }

  /**
     * Empty the cart of items
  */
  empty () {
    this.items = []
    this.subtotal = 0
    this.grandtotal = 0
    this.discounts = 0
    return this
  }

  /**
     * Get a Checkout Total based on the cart contents and Pricing Rules
     * @returns {number} Returns the grand total, less any discounts/deductions.
  */
  total () {
    // Determine Standard Cost
    let subtotal = this.items.reduce((p, c) => { return p + c.price }, 0)
    let total = subtotal

    // Apply customer-specfic discounts
    if (this.rules) {
      let discountsTotal = 0
      this.rules.forEach(rule => {
        discountsTotal += this._calculateDiscountForRule(rule)
      })
      total -= discountsTotal
      this.discounts = discountsTotal
    }

    // Return Result
    this.subtotal = subtotal
    this.grandtotal = total.toFixed(2)
    return total.toFixed(2)
  }

  // Determines if a rule applies and then returns the amount of the discount
  _calculateDiscountForRule (rule) {
    // We want to get a list of cart items matching the rule.adType
    let matchingItems = this.items.filter(item => {
      return item.id === rule.adType
    })

    // Bail if no items on which to discount
    if (matchingItems.length < 1) return 0

    // MB: I like the idea of including discount rule handlers as a sort of middleware that can be assigned rather than this unwieldly switch.
    //     Particularly if they were pluggable to the Checkout class without needing to modify the class itself. Switch will have to suffice for now.
    switch (rule.ruleType) {

      // Discount items according to quantity.
      case 'price':
        // Select most appropriate price-break given number of matching cart items
        let activeBreak = rule.breaks
          .filter(priceBreak => { return priceBreak.qty <= matchingItems.length })
          .reduce((p, c) => { return (p.qty < c.qty) ? c : p })

        // Then apply it across the matching items to get the cummulative discount figure for this rule.
        return matchingItems
          .reduce((p, item) => {
            // Accumalate the difference between item price and rule price but only if it is actually a discount
            return (item.price > activeBreak.price) ? p + item.price - activeBreak.price : 0
          }, 0)

      // Discount whole items based on quantity
      case 'unit':
        let discountable = Math.floor(matchingItems.length / rule.qty) * rule.discountedUnits
        if (rule.limit) {
          discountable = (discountable > rule.limit) ? rule.limit : discountable
        }

        // Here, we're NOT going to assume that all items have the same price so we are going to sort them by price and discount the cheapest ones.
        // This will work fine, even when the items are all the same price.
        return matchingItems
          .sort((a, b) => { return a.price > b.price })
          .splice(0, discountable)
          .reduce((p, item) => { return p + item.price }, 0)

      // Didn't match any known rule types. No discount for you. :(
      default:
        return 0
    }
  }
}

export default Checkout
