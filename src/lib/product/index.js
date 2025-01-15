const getPrice = (product) => {
  if (!product.saleDetails?.length) return null
  const saleDetails = product.saleDetails.filter(item => item.showPrice === true && item.price > 0).sort((a, b) => a.price - b.price)
  if (!saleDetails.length) return null

  if (product.saleDetails.length === 1) return product.saleDetails[0].price.toLocaleString()?.replace(",", ".")

  if (!saleDetails[0]?.price) return saleDetails[saleDetails.length - 1]?.price.toLocaleString()?.replace(",", ".")
  return <>{saleDetails[0].price?.toLocaleString()?.replace(",", ".")}
    -
    {saleDetails[saleDetails.length - 1].price?.toLocaleString()?.replace(",", ".")} </>
}

export { getPrice }