const currencySymbols = {
  DOLLAR: "USD",
  EURO: "EUR",
  POUND: "GBP",
}

const formatCurrency = (price, currency, req) => {
  const locale = req.language

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencySymbols[currency] || currencySymbols.DOLLAR,
  }).format(price)
}

export default formatCurrency
