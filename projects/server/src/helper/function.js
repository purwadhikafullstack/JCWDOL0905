const checkDiscount = (item) => {
    let today = new Date()
    let start = new Date(item.start_date)
    let end = new Date(item.end_date)
    end.setDate(end.getDate() + 1);

    if(start <= today && end >= today){
      if(item.discount_type == 'percentage' || item.discount_type == 'amount'){
          if(item.min_purchase_qty == null || item.product_qty >= item.min_purchase_qty) return 'price'
          else return false
        }
      else if(item.discount_type == 'buy one get one') return 'bonus_qty'
    }
    return false
}

const countDiscount = (item) => {
    if(item.discount_type == 'amount'){
      return item.product_price - item.discount_value
    } else if(item.discount_type == 'percentage'){
      return item.product_price - (item.discount_value/100 * item.product_price)
    }
}

module.exports = {checkDiscount, countDiscount}