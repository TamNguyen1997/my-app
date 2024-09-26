const getPrice = (product) => {
  if (!product.saleDetails?.length) return null

  if (product.saleDetails.length === 1) return product.saleDetails[0].price.toLocaleString()?.replace(",", ".")

  if (!product.saleDetails[0].price) return product.saleDetails[product.saleDetails.length - 1].price.toLocaleString()?.replace(",", ".")

  return <>{product.saleDetails[0].price?.toLocaleString()?.replace(",", ".")}
    -
    {product.saleDetails[product.saleDetails.length - 1].price?.toLocaleString()?.replace(",", ".")} </>
}

export { getPrice }