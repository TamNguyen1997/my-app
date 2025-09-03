"use client"

import {
  Button,
  Card, CardBody, Tab, Tabs,
} from "@heroui/react"
import { createContext, useState } from "react"
import SaleDetails from "@/app/components/admin/ui/product/SaleDetails";
import TechnicalDetails from "@/app/components/admin/ui/product/TechnicalDetails";
import ProductDetail from "@/app/components/admin/ui/product/ProductDetail";
import ProductImage from "@/app/components/admin/ui/product/ProductImage";
import { useParams } from "next/navigation";
import { product_type } from "@prisma/client";
import { toast, ToastContainer } from "react-toastify";
import { useSearchParams } from 'next/navigation';
import ProductBundle from "../../../../../components/admin/ui/product/ProductBundle";

export const ProductContext = createContext();

const Default = ({
  allProducts = [],
  initProduct = {},
  categories = [],
  subCategories = [],
  brands = [],
  productsInBundle = [],
  initFilters = [] }) => {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [product, setProduct] = useState(initProduct || {})
  const [selected] = useState(useSearchParams().get('tab') || 'default');
  const [filters, setFilters] = useState(initFilters)

  const deleteProduct = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?")) {
      setIsLoading(true)
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (res.ok) {
        window.location.replace('/admin/product')
      }
      setIsLoading(false)
    }
  }

  const onSave = async () => {
    setIsLoading(true)
    const newProductOnImage = product.product_on_image?.map((item, i) => ({ ...item, order: i })) || []
    const res = fetch(`/api/products/v2`,
      {
        method: "POST",
        body: JSON.stringify({
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug || slugify(body.product.name, { locale: 'vi' }).replaceAll("(", "").replaceAll(")", "").toLowerCase(),
            imageAlt: product.imageAlt,
            imageUrl: product.imageUrl,
            active: product.active,
            highlight: product.highlight,
            categoryId: product.categoryId,
            subCateId: product.subCateId,
            quantity: product.quantity,
            brandId: product.brandId,
            productType: product.productType || product_type.PRODUCT,
            width: product.width || 0,
            length: product.length || 0,
            height: product.height || 0,
            weight: product.weight || 0,
            productId: product.productId,
            metaTitle: product.metaTitle,
            metaDescription: product.metaDescription
          },
          saleDetails: product.saleDetails,
          productOnImages: newProductOnImage,
          technicalDetails: product.technical_detail
        })
      }).then(async res => {
        if (res.ok) {
          return res.json()
        } else {
          const body = await res.json()
          throw new Error(body.message || "Đã có lỗi xảy ra khi lưu sản phẩm")
        }
      })

    toast.promise(res, {
      pending: "Đang lưu sản phẩm",
      success: {
        render() {
          setIsLoading(false)
          return "Sản phẩm đã được lưu"
        }
      },
      error: {
        render({ data }) {
          setIsLoading(false)
          return data.message || "Đã có lỗi xảy ra khi lưu sản phẩm"
        }
      }
    }, {
      containerId: "ProductDetailPage",
    })
  }

  return (
    <>
      <ToastContainer containerId="ProductDetailPage" />
      <ProductContext.Provider value={{ product, setProduct, categories, brands, subCategories, filters, setFilters }}>
        <Tabs defaultSelectedKey={selected}>
          <Tab title="Thông tin chung" key="default">
            <Card>
              <CardBody>
                <ProductDetail />
              </CardBody>
            </Card>
          </Tab>
          <Tab title="Sản phẩm đi kèm" key="bundle">
            <Card>
              <CardBody>
                <ProductBundle allProducts={allProducts} product={product} productsInBundle={productsInBundle} />
              </CardBody>
            </Card>
          </Tab>
          <Tab title="Hình ảnh" key="image">
            <Card>
              <CardBody>
                <ProductImage />
              </CardBody>
            </Card>
          </Tab>
          <Tab title="Thông số kĩ thuật" key="technical">
            <Card>
              <CardBody>
                <TechnicalDetails />
              </CardBody>
            </Card>
          </Tab>
          <Tab title="Thông số bán hàng" key="sale">
            <Card>
              <CardBody>
                <SaleDetails />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </ProductContext.Provider>

      <div className="pt-4 float-right sticky bottom-0">
        <Button onPress={onSave} color="primary" isDisabled={isLoading}>Lưu</Button>
        <Button onPress={deleteProduct} color="danger" isDisabled={isLoading}>Xoá sản phẩm</Button>
      </div>
    </>
  )
}

export default Default
