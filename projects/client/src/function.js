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

export function checkProductVoucher(voucher, carts){
  let arrVoucher = []
  for(let data of voucher){
    let product = false
    if(data.voucher_type != 'product') arrVoucher.push(data)
    else{
      for(let item of carts){
        if(item.id_inventory == data.id_inventory){
          product = true
          break
        }
      }
      if(product) arrVoucher.push(data)
    }
  }

  return arrVoucher
}

export function showVoucher(item){
    let text = ""
    if(item.voucher_type == 'total purchase') text += 'Voucher Discount '
    else if(item.voucher_type == 'referral code') text += 'Voucher Discount (Referral) '
    else if(item.voucher_type == 'shipping') text += 'Voucher Shipping Cost '
    else if(item.voucher_type == 'product') text += `Voucher Product ${item.product_name} `

    if(item.voucher_kind=='amount') text += `${rupiah(item.voucher_value)} `
    else if(item.voucher_kind=='percentage') text += `${item.voucher_value}% `

    if(item.max_discount!=null) text += `Max Disc ${rupiah(item.max_discount)}. `
    return text
}

export function calculateVoucher(shippingCost, voucher, voucherId, carts){
    if(voucherId==0) return 0
    let disc = 0
    let arr = voucher.find(x => x.id == voucherId)
    let reference = getTotalPrice(carts)
    if(arr.voucher_type == 'shipping') reference = shippingCost
    else if(arr.voucher_type == 'product') reference = arr.product_price

    if(arr.voucher_kind=='amount') disc = arr.voucher_value
    else if(arr.voucher_kind=='percentage') disc = arr.voucher_value/100 * reference

    if(arr.max_discount!=null && arr.max_discount < disc) disc = arr.max_discount
    if(reference < disc) return reference
    return disc
}

export function getDistance(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
  }
  else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
          dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
  }
}

export function sortAddress(lat, lng, addressData){
  for(let i=0; i<addressData.length; i++){
      let dist = getDistance(parseFloat(lat), parseFloat(lng), parseFloat(addressData[i].latitude), parseFloat(addressData[i].longitude), "K").toFixed(2);
      addressData[i].distance = dist;
  }
    
  let sortedArr = addressData.sort(function(a,b) {return a.distance - b.distance});
  localStorage.setItem("nearestAddressId", sortedArr[0].id);
}

export function sortBranch(lat, lng, branchsData){
  for(let i=0; i<branchsData.length; i++){
      let dist = getDistance(parseFloat(lat), parseFloat(lng), parseFloat(branchsData[i].latitude), parseFloat(branchsData[i].longitude), "K").toFixed(2);
      branchsData[i].distance = dist;
  }
    
  let sortedArr = branchsData.sort(function(a,b) {return a.distance - b.distance});

  if(sortedArr[0].distance > 30 || sortedArr[0].distance == 'NaN'){
      localStorage.setItem("branchId", 0);
  }else{
      localStorage.setItem("branchId", sortedArr[0].id);
  }
  
}