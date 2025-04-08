"use client"

import {
  Button,
  Card, CardBody, Spinner, Tab, Tabs,
} from "@nextui-org/react"
import { createContext, useEffect, useState, useCallback } from "react"
import SaleDetails from "@/app/components/admin/ui/product/SaleDetails";
import TechnicalDetails from "@/app/components/admin/ui/product/TechnicalDetails";
import ProductDetail from "@/app/components/admin/ui/product/ProductDetail";
import ProductImage from "@/app/components/admin/ui/product/ProductImage";
import { useParams } from "next/navigation";
import { product_type } from "@prisma/client";
import { toast, ToastContainer } from "react-toastify";

export const ProductContext = createContext();

const ProductCms = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState([]);

  // Fetch product details and related data
  const getProduct = useCallback(async () => {
    setIsLoading(true);

    const [categoryRes, brandRes, subCategoryRes] = await Promise.all([
      fetch('/api/categories?type=CATE&size=10000&page=1').then(res => res.json()),
      fetch('/api/brands').then(res => res.json()),
      fetch('/api/categories?type=SUB_CATE&size=10000&page=1').then(res => res.json()),
    ]);

    setCategories(categoryRes.result);
    setBrands(brandRes);
    setSubCategories(subCategoryRes.result);

    if (id && id !== 'new') {
      const productRes = await fetch(`/api/products/${id}?includeSale=true`).then(res => res.json());
      setProduct(productRes);
    }
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  // Fetch filters when subCategoryId or categoryId changes
  useEffect(() => {
    const getFilters = async () => {
      if (product.subCateId) {
        const res = await fetch(`/api/filters/?size=100000&page=1&categoryIds=${product.subCateId}&categoryIds=${product.categoryId}`);
        if (res.ok) {
          setFilters((await res.json()).result);
        }
      }
    };

    getFilters();
  }, [product.subCateId, product.categoryId]);

  // Delete product
  const deleteProduct = async () => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      window.location.replace('/admin/product');
    }
  };

  // Save product details
  const onSave = async () => {
    const newProductOnImage = product.product_on_image?.map((item, i) => ({ ...item, order: i })) || [];
    const res = await fetch(`/api/products/v2`, {
      method: "POST",
      body: JSON.stringify({
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug || slugify(product.name, { locale: 'vi' }).replaceAll("(", "").replaceAll(")", "").toLowerCase(),
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
          metaDescription: product.metaDescription,
        },
        saleDetails: product.saleDetails,
        productOnImages: newProductOnImage,
        technicalDetails: product.technical_detail
      })
    });
    if (res.ok) {
      const body = await res.json();
      window.location.replace(`/admin/product/edit/${body.id}`);
    } else {
      toast.error("Không thể cập nhật sản phẩm", { containerId: "ProductDetailPage" });
    }
  };

  if (isLoading || !product) return <Spinner className="w-full h-full m-auto p-12" />;

  return (
    <>
      <ToastContainer containerId="ProductDetailPage" />
      <ProductContext.Provider value={{ product, setProduct, categories, brands, subCategories, filters, setFilters }}>
        <Tabs>
          <Tab title="Thông tin chung">
            <Card>
              <CardBody>
                <ProductDetail />
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
        <Button onPress={onSave} color="primary">Lưu</Button>
        <Button onPress={deleteProduct} color="danger">Xoá sản phẩm</Button>
      </div>
    </>
  );
};

export default ProductCms;
