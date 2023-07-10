import formatCurrency from "./formatCurrency.js"

const formatWish = (wish, req) => {
  return {
    ...wish,
    priceFormatted: formatCurrency(wish.price, wish.currency, req),
  }
}

export default formatWish
