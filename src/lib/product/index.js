const getPrice = (product) => {
  if (!product.saleDetails?.length) return null
  const saleDetails = product.saleDetails.filter(item => item.showPrice === true && item.price > 0).sort((a, b) => a.price - b.price)
  if (!saleDetails.length) return null

  if (product.saleDetails.length === 1) return product.saleDetails[0].price.toLocaleString()?.replaceAll(",", ".")

  if (!saleDetails[0]?.price) return saleDetails[saleDetails.length - 1]?.price.toLocaleString()?.replaceAll(",", ".")

  const promotions = saleDetails.filter(item => item.promotionalPrice).map(item => item.promotionalPrice)
  const prices = saleDetails.map(item => item.price)
  const display = [...promotions, ...prices].sort()
  return <>{display[0].toLocaleString().replaceAll(",", ".")}
    -
    {Math.min(prices[prices.length - 1], promotions[promotions.length - 1] || prices[prices.length - 1]).toLocaleString().replaceAll(",", ".")} </>
}

export { getPrice }