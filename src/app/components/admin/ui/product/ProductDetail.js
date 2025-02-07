import { Button, DatePicker, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Switch, useDisclosure } from "@nextui-org/react"
import slugify from "slugify"
import ImageCms from "../ImageCms"
import { useCallback, useContext, useState } from "react"
import { parseDate } from "@internationalized/date";
import { ProductContext } from "../../../../(admin)/admin/product/edit/[id]/page"
import { toast } from "react-toastify";

const getDateString = (isoDate) =>
  parseDate(new Date(isoDate).toISOString().split("T")[0]);

const ProductDetail = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { categories, brands, subCategories, product, setProduct } = useContext(ProductContext)
  const [productImage, setProductImage] = useState(product.image || {})

  const selectImage = (value) => {
    const newProduct = { ...product, ...{ imageId: value.id, image: value } }
    setProduct({ ...newProduct })
    setProductImage(value)
    onOpenChange()
  }

  const getSubCate = useCallback(() => {
    return product.categoryId ? subCategories.filter(item => item.cateId === product.categoryId) : subCategories
  }, [product])

  const getProductPostLink = async (product) => {
    const existingPostResponse = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts?slug=${product.slug}&status=draft,publish`,
      {
        method: "GET",
        headers: {
          "Authorization": `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_WORDPRESS_USER}:${process.env.NEXT_PUBLIC_WORDPRESS_PASSWORD}`).toString("base64")}`
        }
      })
    if (!existingPostResponse.ok) {
      console.log(existingPostResponse.status)
      toast.error("Có lỗi xảy ra khi kiểm tra bài viết sản phẩm")
    } else {
      const existingPost = await existingPostResponse.json()
      if (existingPost.length > 0) {
        window.open(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-admin/post.php?post=${existingPost[0].id}&action=edit`, "_blank").focus()
      } else {
        const createdPostResponse = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_WORDPRESS_USER}:${process.env.NEXT_PUBLIC_WORDPRESS_PASSWORD}`).toString("base64")}`
          },
          body: JSON.stringify({
            title: product.name,
            slug: product.slug,
            status: "draft",
            categories: [process.env.NEXT_PUBLIC_WORDPRESS_PRODUCT_CATEGORY_ID],
          })
        })
        const createdPost = await createdPostResponse.json()
        window.open(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-admin/post.php?post=${createdPost.id}&action=edit`, '_blank').focus();
      }
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Input
            type="text"
            label="ID sản phẩm"
            aria-label="ID sản phẩm"
            value={product.id}
            isReadOnly
            onValueChange={(value) => {
              setProduct({ ...product, id: value })
            }}
          />
          <div className="w-full">
            <Input
              type="text"
              label="Tên sản phẩm"
              aria-label="Tên sản phẩm"
              value={product.name}
              isRequired
              onValueChange={(value) => {
                let newValue = { ...product, name: value }
                if (!product.createdAt) {
                  newValue = { ...newValue, slug: slugify(value, { locale: "vi" }).toLowerCase().replaceAll("(", "").replaceAll(")", "") }
                }
                setProduct({ ...newValue, name: value })
              }}
            />
            {!product.name && <p className="text-red-600 text-small">Bạn điền tên sản phẩm</p>}
          </div>
          <Input
            type="text"
            label="Slug"
            aria-label="Slug"
            value={product.slug}
            isRequired
            disabled
          />
        </div>
        <div className="flex gap-10">
          <Switch isSelected={product.active}
            onValueChange={(value) => setProduct({ ...product, active: value })}>{product.active ? "Active" : "Inactive"}</Switch>
          <Switch isSelected={product.highlight}
            onValueChange={(value) => setProduct({ ...product, highlight: value })}>{product.highlight ? "Nổi bật" : "Không nổi bật"}</Switch>
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            label="Khối lượng (g)"
            aria-label="Khối lượng"
            value={product.weight}
            min={0}
            max={999}
            onValueChange={(value) => setProduct(Object.assign({}, product, { weight: parseInt(value) }))}
          />
          <Input
            type="number"
            label="Chiều dài (cm)"
            aria-label="Chiều dài"
            value={product.length}
            min={0}
            max={999}
            onValueChange={(value) => setProduct(Object.assign({}, product, { length: parseInt(value) }))}
          />
          <Input
            type="number"
            label="Chiều rộng (cm)"
            aria-label="Chiều rộng"
            value={product.width}
            min={0}
            max={999}
            onValueChange={(value) => setProduct(Object.assign({}, product, { width: parseInt(value) }))}
          />
          <Input
            type="number"
            label="Chiều cao (cm)"
            aria-label="Chiều cao"
            value={product.height}
            min={0}
            max={999}
            onValueChange={(value) => setProduct(Object.assign({}, product, { height: parseInt(value) }))}
          />
        </div>
        <div className="flex gap-2">
          <div className="w-full">
            <Select
              label="Category"
              aria-label="Category"
              selectedKeys={new Set([product.categoryId || ""])}
              isRequired
              onSelectionChange={(value) =>
                setProduct(Object.assign({}, product, { categoryId: value.size ? value.values().next().value : null, subCateId: null }))}
            >
              {categories.map(category => <SelectItem key={category.id}>{category.name}</SelectItem>)}
            </Select>
            {!product.categoryId && <p className="text-red-600 text-small">Bạn cần chọn category</p>}
          </div>
          <div className="w-full">
            <Select
              label="Sub category"
              aria-label="Sub category"
              isDisabled={getSubCate().length === 0}
              selectedKeys={new Set([product.subCateId || ""])}
              isRequired
              onSelectionChange={(value) =>
                setProduct(Object.assign({}, product, { subCateId: value.size ? value.values().next().value : null }))
              }
            >
              {
                getSubCate().map((subCategory) => (
                  <SelectItem key={subCategory.id}>
                    {subCategory.name}
                  </SelectItem>
                ))
              }
            </Select>
            {!product.subCateId && <p className="text-red-600 text-small">Bạn cần chọn subcategory</p>}
          </div>
          <Select
            label="Thương hiệu"
            aria-label="Thương hiệu"
            selectedKeys={new Set([product.brandId || ""])}
            onSelectionChange={(value) =>
              setProduct(Object.assign({}, product, { brandId: value.size ? value.values().next().value : null }))}
          >
            {brands.map(brand => <SelectItem key={brand.id}>{brand.name}</SelectItem>)}
          </Select>

        </div>
        <div className="grid grid-cols-2 gap-3">

        </div>
        <div className='grid grid-cols-2 gap-3'>
          <div className="flex flex-col gap-3">
            <Input
              type="text"
              label="Meta title"
              aria-label="Meta title"
              value={product.metaTitle}
              onValueChange={(value) => setProduct(Object.assign({}, product, { metaTitle: value }))}
            />
            <Input
              type="text"
              label="Meta description"
              aria-label="Meta description"
              value={product.metaDescription}
              onValueChange={(value) => setProduct(Object.assign({}, product, { metaDescription: value }))}
            />
            {
              product.createdAt && product.updatedAt &&
              <div className="flex gap-2">
                <DatePicker
                  label="Ngày tạo"
                  defaultValue={getDateString(product.createdAt)}
                  isReadOnly
                  aria-label="Ngày tạo"
                />
                <DatePicker
                  label="Ngày sửa đổi gần nhất"
                  defaultValue={getDateString(product.updatedAt)}
                  isReadOnly
                  aria-label="Ngày sửa đổi gần nhất"
                />
              </div>
            }
            <Input type="text"
              aria-label="Hình ảnh thumbnail"
              label="Hình ảnh thumbnail"
              value={productImage?.name} isDisabled />
            <Input type="text"
              aria-label="Alt"
              label="Alt"
              onValueChange={(value) => setProduct(Object.assign({}, product, { imageAlt: value }))}
              value={product?.imageAlt} />
            <div>
              <Button color="primary" onClick={onOpen} className="w-24 float-right">Chọn ảnh</Button>
            </div>
          </div>

          <div>
            {
              productImage?.id ?
                <img
                  src={`${process.env.NEXT_PUBLIC_FILE_PATH + productImage?.path}`}
                  alt={`${product.imageAlt}`}
                  width="150"
                  height="100"
                  className="mx-auto"
                /> : null
            }
          </div>
        </div>
        <Button color="primary" className="w-40" onClick={() => getProductPostLink(product)}>Xem mô tả sản phẩm</Button>
      </div>

      <Modal
        size="full" scrollBehavior="inside"
        isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chọn hình ảnh</ModalHeader>
              <ModalBody>
                <ImageCms disableAdd={true} onImageClick={selectImage} highlights={[productImage]} showHighlight={false} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProductDetail