const getPrice = (product) => {
  if (!product.saleDetails?.length) return null

  if (product.saleDetails.length === 1) return product.saleDetails[0].price.toLocaleString()

  if (!product.saleDetails[0].price) return product.saleDetails[product.saleDetails.length - 1].price.toLocaleString()

  return <>{product.saleDetails[0].price?.toLocaleString()} - {product.saleDetails[product.saleDetails.length - 1].price?.toLocaleString()} </>
}

export { getPrice }