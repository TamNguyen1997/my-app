"use client"

import {
  Button,
  Card, CardBody, Spinner, Tab, Tabs,
} from "@nextui-org/react"
import { useEffect, useState } from "react"
import SaleDetails from "@/app/components/admin/ui/product/SaleDetails";
import TechnicalDetails from "@/app/components/admin/ui/product/TechnicalDetails";
import ProductDetail from "@/app/components/admin/ui/product/ProductDetail";
import ComponentPartDetails from "@/app/components/admin/ui/product/ComponentPartDetails";
import ProductImage from "@/app/components/admin/ui/product/ProductImage";
import { useParams } from "next/navigation";


const ProductCms = () => {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState({})

  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [brands, setBrands] = useState([])

  useEffect(() => {
    getProduct()

  }, [id])

  const getProduct = async () => {
    setIsLoading(true)
    await Promise.all([
      fetch('/api/categories?type=CATE').then(res => res.json()).then(json => setCategories(json.result)),
      fetch('/api/brands').then(res => res.json()).then(setBrands),
      fetch('/api/categories?type=SUB_CATE').then(res => res.json()).then(json => setSubCategories(json.result))
    ])

    if (id && id !== 'new') {
      await fetch(`/api/products/${id}`).then(res => res.json()).then(setProduct)
    }
    setIsLoading(false)
  }

  const deleteProduct = async () => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
    if (res.ok) {
      window.location.replace('/admin/product')
    }
  }

  if (isLoading) return <Spinner className="w-full h-full m-auto p-12" />
  return (
    <>
      <Tabs disabledKeys={product.id ? [] : ["description", "image", "technical", "component", "sale"]}>
        <Tab title="Thông tin chung">
          <Card>
            <CardBody>
              <ProductDetail
                categories={categories}
                product={product}
                setProduct={setProduct}
                brands={brands}
                subCategories={subCategories}
              />
            </CardBody>
          </Card>
        </Tab>
        <Tab title="Hình ảnh" key="image">
          <Card>
            <CardBody>
              <ProductImage product={product} />
            </CardBody>
          </Card>
        </Tab>
        <Tab title="Phụ kiện" key="component">
          <Card>
            <CardBody>
              <ComponentPartDetails productId={product.id} categories={categories} subCategories={subCategories} />
            </CardBody>
          </Card>
        </Tab>
        <Tab title="Thông số kĩ thuật" key="technical">
          <Card>
            <CardBody>
              <TechnicalDetails product={product} />
            </CardBody>
          </Card>
        </Tab>
        <Tab title="Thông số bán hàng" key="sale">
          <Card>
            <CardBody>
              <SaleDetails product={product} />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      <div className="flex float-right">
        <Button onClick={() => deleteProduct()} color="danger">Xoá sản phẩm</Button>
      </div>
    </>
  )
}

export default ProductCms
