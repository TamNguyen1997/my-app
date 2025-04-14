const getPrice = (product) => {
  if (!product.saleDetails?.length) return null
  const saleDetails = product.saleDetails.filter(item => item.showPrice === true && item.price > 0).sort((a, b) => a.price - b.price)
  if (!saleDetails.length) return null
  if (product.saleDetails.length === 1) return (product.saleDetails[0].promotionalPrice || product.saleDetails[0].price).toLocaleString()?.replaceAll(",", ".")

  const filteredSaleDetails = saleDetails.filter(item => item.filterId && item.filterValueId)
  if (!filteredSaleDetails[0]?.price) return filteredSaleDetails[filteredSaleDetails.length - 1]?.price.toLocaleString()?.replaceAll(",", ".")
  const promotions = filteredSaleDetails.filter(item => item.promotionalPrice).map(item => item.promotionalPrice)
  const prices = filteredSaleDetails.map(item => item.price)
  const display = [...promotions, ...prices].sort()

  if (display[0] === display[display.length - 1]) return display[0].toLocaleString().replaceAll(",", ".")
  return <>{`${Math.min(...promotions, ...prices).toLocaleString().replaceAll(",", ".")} - ${Math.max(...promotions, ...prices).toLocaleString().replaceAll(",", ".")}`} </>
}

const getOriginalPrice = (product) => {
  if (!product.saleDetails?.length) return null
  const saleDetails = product.saleDetails.filter(item => item.showPrice === true && item.price > 0).sort((a, b) => a.price - b.price)
  if (!saleDetails.length) return null
  if (product.saleDetails.length === 1 && product.saleDetails[0].price && product.saleDetails[0].promotionalPrice) {
    return product.saleDetails[0].price.toLocaleString()?.replaceAll(",", ".")
  }

  const filteredSaleDetails = saleDetails.filter(item => item.filterId && item.filterValueId)
  if (!filteredSaleDetails.find(item => item.promotionalPrice)) return null
  return <>{`${filteredSaleDetails[0]?.price.toLocaleString().replaceAll(",", ".")} - ${filteredSaleDetails[filteredSaleDetails.length - 1]?.price.toLocaleString().replaceAll(",", ".")}`} </>
}

const addRecentlyView = (product) => {
  const items = [...getRecentlyView(), product];
  let uniqueItems = []
  for (let i = items.length - 1; uniqueItems.length <= 3 && i >= 0; i--) {
    if (!uniqueItems.find(uniqueItem => {
      return uniqueItem.id === items[i].id
    })) {
      uniqueItems.push(items[i])
    }
  }

  localStorage.setItem('recentlyView', JSON.stringify(uniqueItems));
}

const getRecentlyView = () => {
  return localStorage.getItem('recentlyView') ? JSON.parse(localStorage.getItem('recentlyView')) : [];
}

export { getPrice, getOriginalPrice, addRecentlyView, getRecentlyView }