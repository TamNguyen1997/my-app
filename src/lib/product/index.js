const getPrice = (product) => {
  if (!product?.saleDetails?.length) return null;

  // Build list of effective prices: promotionalPrice if > 0, else base price
  const effectivePrices = product.saleDetails
    .filter(detail => detail.showPrice === true && (((detail.promotionalPrice ?? 0) > 0) || ((detail.price ?? 0) > 0)))
    .map(detail => (detail.promotionalPrice && detail.promotionalPrice > 0) ? detail.promotionalPrice : (detail.price || 0));

  if (!effectivePrices.length) return null;

  const lowest = Math.min(...effectivePrices);
  const highest = Math.max(...effectivePrices);

  const format = (n) => n.toLocaleString()?.replaceAll(",", ".");

  if (lowest === highest) return `${format(lowest)}`;
  return `${format(lowest)} - ${format(highest)}`;
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

  let uniqueItems = [product, ...getRecentlyView().filter(item => item.id !== product.id)];

  if (uniqueItems.length > 4) {
    uniqueItems.pop()
  }

  localStorage.setItem('recentlyView', JSON.stringify(uniqueItems));
}

const getRecentlyView = () => {
  let items = localStorage.getItem('recentlyView') ? JSON.parse(localStorage.getItem('recentlyView')) : [];

  if (items.length > 4) {
    items.pop()
  }

  return items;
}

const getRangeForUrl = (range) => {
  if (!range || range.length === 0) return "";
  const [min, max] = [...range];
  if (isNaN(min) || isNaN(max)) return "";
  if (min === 0 && max ===  100000000) return "";
  return `range=${min}-${max}`;
};

const buildQueryParams = ({ filterIds = [], orderBy = "", range = [] }) => {
  const params = new URLSearchParams();

  const validFilters = (Array.isArray(filterIds) ? filterIds : [])
    .map(String)
    .map(s => s.trim())
    .filter(Boolean);
  if (validFilters.length) params.set('filterId', validFilters.join(','));

  const allowedOrderBy = new Set(['createdAt:asc', 'createdAt:desc', 'price:asc', 'price:desc']);
  if (orderBy && allowedOrderBy.has(orderBy)) params.set('orderBy', orderBy);

  const rangeParam = getRangeForUrl(range);
  if (rangeParam) {
    const [key, val] = rangeParam.split('=');
    params.set(key, val);
  }

  return params.toString();
}

export { getPrice, getOriginalPrice, addRecentlyView, getRecentlyView, getRangeForUrl, buildQueryParams }