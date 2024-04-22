import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import { redirect } from 'next/navigation'
import Image from "next/image";
import { Autocomplete, AutocompleteItem, Button, Input } from "@nextui-org/react";

const ProductDetailForm = ({ product }) => {
  const {
    register,
    handleSubmit
  } = useForm()

  const [categories, setCategories] = useState([])
  const [image, setImage] = useState(product.imageUrl)

  const [refresh, setRefresh] = useState(false)
  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(json => setCategories(json))
  }, [])

  const onSelectionChange = (id) => {
    product.categoryId = id
  }

  const onSubmit = async (data) => {
    const productToUpdate = Object.assign({}, product, data)

    fetch(`/api/products/${product.id}`, {
      method: "PUT",
      body: JSON.stringify(productToUpdate)
    }).then(() => setRefresh(true))
  }

  if (refresh) redirect('/admin')

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          label="Mã sản phẩm"
          labelPlacement="outside"
          defaultValue={product.id}
          isRequired
          className="p-3"
          {...register("id")}
        />
        <Input
          type="text"
          label="Tên sản phẩm"
          labelPlacement="outside"
          defaultValue={product.description}
          isRequired
          className="p-3"
          {...register("description")}
        />
        <Autocomplete
          label="Category"
          variant="bordered"
          defaultItems={categories}
          className="max-w-xs p-3"
          allowsCustomValue={true}
          selectedKey={product.categoryId}
          onSelectionChange={onSelectionChange}
          isRequired
        >
          {(category) => <AutocompleteItem key={category.id}>{category.name}</AutocompleteItem>}
        </Autocomplete>
        <Input
          type="url"
          label="URL hình ảnh"
          labelPlacement="outside"
          defaultValue={product.imageUrl}
          isRequired
          onValueChange={setImage}
          className="p-3"
          {...register("imageUrl")} />
        <Input
          type="text"
          label="Alt hình ảnh"
          labelPlacement="outside"
          defaultValue={product.imageAlt}
          isRequired
          className="p-3"
          {...register("imageAlt")} />
        <div className="p-3">
          <Image src={image} width={200} height={100} alt={product.imageAlt}></Image>
        </div>
        <div className="p-3">
          <Button type="submit" color="primary">Lưu</Button>
        </div>
      </form>
    </>
  )
}

export default ProductDetailForm