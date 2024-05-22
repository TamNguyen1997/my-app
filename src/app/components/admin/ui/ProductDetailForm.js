import { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { ProductContext } from "../ProductCms";

const ProductDetailForm = () => {
  const [selectedProduct, setSelectedProduct] = useContext(ProductContext)

  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(json => setCategories(json))
  }, [])

  return (
    <>
      <Input
        type="text"
        label="Mã sản phẩm"
        labelPlacement="outside"
        aria-label="Mã sản phẩm"
        defaultValue={selectedProduct.id}
        isRequired
        className="p-3"
        onValueChange={(value) => setSelectedProduct(Object.assign({}, selectedProduct, { id: value }))}
      />
      <Input
        type="text"
        label="Tên sản phẩm"
        labelPlacement="outside"
        aria-label="Tên sản phẩm"
        defaultValue={selectedProduct.name}
        isRequired
        onValueChange={(value) => setSelectedProduct(Object.assign({}, selectedProduct, { name: value }))}
        className="p-3"
      />
      <Autocomplete
        label="Category"
        variant="bordered"
        aria-label="Category"
        defaultItems={categories}
        className="max-w-xs p-3"
        allowsCustomValue={true}
        selectedKey={selectedProduct.categoryId}
        onSelectionChange={value => setSelectedProduct(Object.assign({}, selectedProduct, { categoryId: value }))}
        isRequired
      >
        {(category) => <AutocompleteItem key={category.id}>{category.name}</AutocompleteItem>}
      </Autocomplete>
      <Input
        type="url"
        label="URL hình ảnh"
        aria-label="URL hình ảnh"
        labelPlacement="outside"
        defaultValue={selectedProduct.imageUrl}
        isRequired
        onValueChange={(value) => setSelectedProduct(Object.assign({}, selectedProduct, { imageUrl: value }))}
        className="p-3"
      />
      <Input
        type="text"
        label="Alt hình ảnh"
        aria-label="Alt hình ảnh"
        labelPlacement="outside"
        defaultValue={selectedProduct.imageAlt}
        isRequired
        className="p-3"
        onValueChange={(value) => setSelectedProduct(Object.assign({}, selectedProduct, { imageAlt: value }))}
      />
      {
        selectedProduct.imageUrl ?
          <div className="p-3">
            <Image src={selectedProduct.imageUrl} width={200} height={100} alt={selectedProduct.imageAlt}></Image>
          </div> : <></>
      }
    </>
  )
}

export default ProductDetailForm
