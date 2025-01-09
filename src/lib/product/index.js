const getPrice = (product) => {
  if (!product.saleDetails?.length) return null

  if (product.saleDetails.length === 1) return product.saleDetails[0].price.toLocaleString()?.replace(",", ".")

  const saleDetails = product.saleDetails.filter(item => item.showPrice)
  if (!saleDetails.length) return null
  if (!saleDetails[0]?.price) return saleDetails[saleDetails.length - 1]?.price.toLocaleString()?.replace(",", ".")

  return <>{saleDetails[0].price?.toLocaleString()?.replace(",", ".")}
    -
    {saleDetails[saleDetails.length - 1].price?.toLocaleString()?.replace(",", ".")} </>
}

export { getPrice }