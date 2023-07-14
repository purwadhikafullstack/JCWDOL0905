export const checkDiscount = (item) => {
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

export const countDiscount = (item) => {
    if(item.discount_type == 'amount'){
      return item.product_price - item.discount_value
    } else if(item.discount_type == 'percentage'){
      return item.product_price - (item.discount_value/100 * item.product_price)
    }
}

export const rupiah = (number)=>{
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(number);
}

export function getTotalPrice(carts){
    let sum = 0;
    for(let item of carts){
      if(checkDiscount(item)=='price'){
        sum += (countDiscount(item) * item.product_qty)
      } else {
        sum += (item.product_price * item.product_qty)
      }
    }
    return sum
}

export function getTotalWeight(carts){
    let sum = 0;
    for(let item of carts){
        if(checkDiscount(item)=='bonus_qty'){
            sum += (item.weight * (item.product_qty * 2))
        } else {
            sum += (item.weight * item.product_qty)
        }
    }
    return sum
}

export function showVoucher(item){
    let text = ""
    if(item.voucher_type=="total purchase"){
      if(item.voucher_kind=='amount'){
        text += `Voucher Discount ${rupiah(item.voucher_value)}. `
      }else if(item.voucher_kind=='percentage'){
        text += `Voucher Discount ${item.voucher_value}%. `
      }

      if(item.max_discount!=null){
        text += `Max Disc ${rupiah(item.max_discount)}. `
      }
      if(item.min_purchase_amount!=null){
        text += `Min Purchase ${rupiah(item.min_purchase_amount)}. `
      }
      return text
    }else if(item.voucher_type=="shipping"){
      if(item.voucher_kind=='amount'){
        text += `Voucher Shipping Cost ${rupiah(item.voucher_value)}. `
      }else if(item.voucher_kind=='percentage'){
        text += `Voucher Shipping Cost ${item.voucher_value}%. `
      }

      if(item.max_discount!=null){
        text += `Max Disc ${rupiah(item.max_discount)}. `
      }
      if(item.min_purchase_amount!=null){
        text += `Min Purchase ${rupiah(item.min_purchase_amount)}. `
      }
      return text
    }
}

export function calculateVoucher(shippingCost, voucher, voucherId, carts){
    if(voucherId==0){
      return 0
    }else{
      let disc = 0
      let arr = voucher.find(x => x.id == voucherId)
      if(arr.voucher_type == 'total purchase'){
        if(arr.voucher_kind=='amount'){
          disc = arr.voucher_value
          if(arr.max_discount!=null){
            if(arr.max_discount < disc) return arr.max_discount
          }
          return disc
        }else if(arr.voucher_kind=='percentage'){
          disc = arr.voucher_value/100 * getTotalPrice(carts)
          if(arr.max_discount!=null){
            if(arr.max_discount < disc) return arr.max_discount
          }
          return disc
        }
      }
      else if(arr.voucher_type == 'shipping'){
        if(shippingCost==null) return 0
        if(arr.voucher_kind=='amount'){
          disc = arr.voucher_value
        }else if(arr.voucher_kind=='percentage'){
          disc = arr.voucher_value/100 * shippingCost
        }
        if(arr.max_discount!=null){
          if(arr.max_discount < disc && arr.max_discount <= shippingCost) return arr.max_discount
          else if(shippingCost < disc) return shippingCost
        }
        return disc
      }
    }
}