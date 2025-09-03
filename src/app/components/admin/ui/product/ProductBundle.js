import { Button } from "@heroui/react"
import { useState, useEffect } from "react"

const ProductBundle = ({ allProducts = [], product = {}, productsInBundle = [] }) => {
  const [bundleProducts, setBundleProducts] = useState(productsInBundle.map(bd => bd.product).filter(p => p.id !== product.id) || []);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const getBundleId = () => product.bundle_product[0]?.bundleId || null;

  console.log(getBundleId());
  console.log(bundleProducts)
  useEffect(() => {
    const bundleIds = bundleProducts.map(p => p.id);
    setFilteredProducts(
      allProducts
        .filter(p => !bundleIds.includes(p.id) && p.id !== product.id)
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [allProducts, bundleProducts, search]);

  const updateBundle = (newProducts) => {
    const bundleId = getBundleId();
    setLoading(true);
    fetch("/api/bundles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bundleId,
        productIds: [...(new Set([product.id, ...newProducts.map(p => p.id)]))],
      }),
    })
      .then(res => res.json())
      .finally(() => setLoading(false));
  };

  const removeProduct = (id) => {
    const prod = bundleProducts.find(p => p.id === id);
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${prod?.name}"?`)) {
      const newProducts = bundleProducts.filter(p => p.id !== id);
      setBundleProducts(newProducts);
      updateBundle(newProducts);
    }
  };
  const addProduct = (productId) => {
    const prod = allProducts.find(p => p.id === productId);
    if (prod && !bundleProducts.some(p => p.id === prod.id)) {
      const newProducts = [...bundleProducts, prod];
      setBundleProducts(newProducts);
      setSearch("");
      updateBundle(newProducts)
    }
  };

  return (
    <div className="p-5 min-h-screen">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow text-center">
            <span className="font-bold text-lg">Đang cập nhật...</span>
          </div>
        </div>
      )}
      <h3 className="mb-3 font-bold">Sản phẩm đi kèm</h3>
      <div className="flex gap-2 items-center mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm sản phẩm để thêm"
          className="w-64 px-2 py-1 border rounded"
        />
        <div className="relative">
          {search && (
            <ul className="absolute bg-white border rounded shadow z-50 w-64 max-h-48 overflow-auto">
              {filteredProducts.length === 0 && (
                <li className="px-2 py-1 text-gray-500">Không tìm thấy sản phẩm</li>
              )}
              {filteredProducts.map((p, i) => (
                <li
                  key={i}
                  className={`px-2 py-1 cursor-pointer hover:bg-gray-100}`}
                  onClick={() => addProduct(p.id)}
                >
                  <span>{p.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <ul className="mb-4">
        {bundleProducts.map((p, i) => (
          <li key={i} className="grid grid-cols-6 gap-2 items-center flex-1 mb-2 hover:bg-gray-200 hover:rounded">
            <div className="col-span-4 flex items-center gap-2">
              <img
                src={p.imageUrl || "/default-featured-image.webp"}
                alt={p.name}
                className="w-10 h-10 object-cover rounded"
              />
              <span>{p.name}</span>
            </div>
            <div className="col-span-2">
              <Button color="danger" size="sm" onPress={() => removeProduct(p.id)}>
                Xóa
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductBundle