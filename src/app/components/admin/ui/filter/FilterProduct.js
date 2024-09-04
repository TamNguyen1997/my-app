"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Spinner, Table,
  TableCell, TableColumn,
  TableHeader, TableRow,
  TableBody, useDisclosure,
  Modal, ModalHeader,
  ModalBody,
  Button, ModalContent,
  Pagination,
  Card, CardBody, Tab, Tabs,
  Input,
  ModalFooter,
  Link,
  Switch,
  Select, SelectItem
} from "@nextui-org/react"
import { EditIcon, Search, Trash2 } from "lucide-react"
import SaleDetails from "@/app/components/admin/ui/product/SaleDetails";
import TechnicalDetails from "@/app/components/admin/ui/product/TechnicalDetails";
import ProductDetail from "@/app/components/admin/ui/product/ProductDetail";
import ComponentPartDetails from "@/app/components/admin/ui/product/ComponentPartDetails";
import ProductImage from "@/app/components/admin/ui/product/ProductImage";
import ProductDescription from "@/app/components/admin/ui/product/ProductDescription";
import AvailableProduct from "@/app/components/admin/ui/filter/AvailableProduct";
import { toast, ToastContainer } from "react-toastify";

const rowsPerPage = 10;

const FilterProduct = ({ filterId, categories, brands, subCategories }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const addProduct = useDisclosure()
  const [selectedProduct, setSelectedProduct] = useState({})
  const [condition, setCondition] = useState({})
  const [loadingState, setLoadingState] = useState("loading")

  const [total, setTotal] = useState(100)

  const [page, setPage] = useState(1)

  const [selectedKeys, setSelectedKeys] = useState(new Set([]));

  const [products, setProduct] = useState([...Array(5)].map((_, i) => ({
    id: i,
    attrId: "M0102",
    attrViName: "Đen",
    slug: "den",
    attrEnName: "Black",
    brand: "2f32fed6-2130-4b5c-8c84-4a13e70a0ee8",
    category: "99b1f86c-f6cc-42f1-9907-1979abb52557",
    subcate: "e51b6744-5c19-4c7c-88ed-36b5f835265c",
    active: i % 2 == 0
  })))

  console.log(products)

  const tableHeaders = [
    {
      key: "attrId",
      title: "ID giá trị thuộc tính"
    },
    {
      key: "attrViName",
      title: "Tên giá trị thuộc tính tiếng Việt",
      required: true
    },
    {
      key: "slug",
      title: "Slug"
    },
    {
      key: "attrEnName",
      title: "Tên giá trị thuộc tính tiếng Anh"
    },
    {
      key: "brand",
      title: "ID thương hiệu",
      required: true
    },
    {
      key: "category",
      title: "ID cate",
      required: true
    },
    {
      key: "subcate",
      title: "ID sub-cate",
      required: true
    },
    {
      key: "active",
      title: "Trạng thái active"
    }
  ];

  useEffect(() => {
    getProduct()
  }, [page])

  const getProduct = useCallback(() => {
    // setLoadingState("loading")
    // fetch(`/api/filters/${filterId}/products?page=${page}&size=${rowsPerPage}`).then(res => res.json()).then(json => {
    //   setProduct(json.result)
    //   setTotal(json.total)
      setLoadingState("idle")
    // })
  }, [page])

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  const openModal = async (product) => {
    setSelectedProduct(product)
    onOpen()
  }

  const deleteFilterOnProduct = async (id) => {
    const res = await fetch(`/api/filters/${filterId}/products/${id}`, { method: "DELETE" })

    if (res.ok) {
      getProduct()
      toast.success("Đã xóa sản phẩm ra khỏi filter")
    } else {
      toast.error("Không thể xóa sản phẩm ra khỏi filter")
    }
  }

  const onSave = async () => {
    const ids = new Set([...products.map(product => product.id), ...selectedKeys])
    const res = await fetch(`/api/filters/${filterId}/products`, { method: "POST", body: JSON.stringify({ productIds: [...ids] }) })

    if (res.ok) {
      addProduct.onClose()
      toast.success("Đã thêm sản phẩm vào filter")
      getProduct()
    } else {
      toast.error("Không thể thêm sản phẩm vào filter")
    }
  }

  const renderCell = useCallback((product, columnKey) => {
    const cellValue = product[columnKey]
    switch (columnKey) {
      case "active":
        return (
          <div className="flex justify-center">
            <Switch isSelected={cellValue} className="[&>span:last-of-type]:m-0" />
          </div>
        )
      // case "category":
      //   return product.category?.name
      // case "subcate":
      //   return product.subCate?.name
      // case "brand":
      //   return product.brand?.name
      case "category":
      case "subcate":
      case "brand":
        return (
          <Select
            label=""
            labelPlacement="outside"
            className="min-w-[120px]"
          >
            <SelectItem key="item_1">
              Item 1
            </SelectItem>
            <SelectItem key="item_2">
              Item 2
            </SelectItem>
          </Select>
        )
      default:
        // return cellValue
        return <Input value={cellValue} className="min-w-[100px]" />;
    }
  }, [])

  const onConditionChange = (value) => {
    setCondition(Object.assign({}, condition, value))
  }

  return (
    <>
      <ToastContainer containerId={"FilterProduct"} />
      <div className="flex flex-col gap-2 min-h-full">
        {/* <div className="flex gap-3 w-1/2">
          <Input label="Tên sản phẩm" aria-label="Tên sản phẩm" labelPlacement="outside" value={condition.name}
            onValueChange={(value) => {
              onConditionChange({ name: value })
              if (value.length > 2) getProduct()
            }}
          />
          <Input label="Slug" aria-label="slug" labelPlacement="outside" value={condition.slug}
            onValueChange={(value) => {
              onConditionChange({ slug: value })
              if (value.length > 2) getProduct()
            }}
          />
          <div className="items-end flex min-h-full">
            <Button onClick={getProduct} color="primary"><Search /></Button>
          </div>
        </div> */}
        <div className="px-1 py-2 border-default-200">
          <Table
            loadingState={loadingState}
            aria-label="Tất cả sản phẩm"
            bottomContent={
              loadingState === "loading" ? null :
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
            }>
            <TableHeader>
              {/* <TableColumn key="name" textValue="Tên sản phẩm" aria-label="Tên sản phẩm">Tên sản phẩm</TableColumn>
              <TableColumn key="slug" textValue="slug" aria-label="slug">Slug</TableColumn>
              <TableColumn key="category" textValue="category" aria-label="slug">Category</TableColumn>
              <TableColumn key="subcate" textValue="subcate" aria-label="slug">Sub category</TableColumn>
              <TableColumn key="brand" textValue="brand" aria-label="slug">Nhãn hiệu</TableColumn>
              <TableColumn key="actions" textValue="actions" width="100"></TableColumn> */}
              {
                tableHeaders.map(col => 
                  <TableColumn
                    key={col.key}
                    text-value={col.title}
                    aria-label={col.title}
                    className={`
                      max-w-[150px] whitespace-normal text-center last:w-[100px]
                      ${col.required && "after:content-['*'] after:text-[#f31260]"}
                    `}
                  >
                    {col.title}
                  </TableColumn>
                )
              }
            </TableHeader>
            <TableBody
              items={products}
              isLoading={loadingState === "loading"}
              emptyContent={"Không có sản phẩm nào"}
              loadingContent={<Spinner label="Loading..." />}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div>
          {/* <Button color="primary" onClick={addProduct.onOpen} className="float-right">Thêm sản phẩm vào filter</Button> */}
          <div className="flex gap-5">
            <Link href="/admin/filter">Quay về</Link>
            <Link href="/admin/filter/edit/new">Thêm filter</Link>
            <Button color="primary" className="ml-auto">Lưu</Button>
            <Button color="default" variant="ghost" className="">Xoá</Button>
          </div>
        </div>
      </div>
      <Modal
        size="5xl" scrollBehavior="inside"
        isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chi tiết sản phẩm</ModalHeader>
              <ModalBody>
                <Tabs disabledKeys={selectedProduct.id ? [] : ["description", "image", "technical", "component", "sale"]}>
                  <Tab title="Thông tin chung">
                    <Card>
                      <CardBody>
                        <ProductDetail
                          categories={categories}
                          product={selectedProduct}
                          setProduct={setSelectedProduct}
                          brands={brands}
                          subCategories={subCategories}
                        />
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab title="Mô tả" key="description">
                    <Card>
                      <CardBody>
                        <ProductDescription product={selectedProduct} />
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab title="Hình ảnh" key="image">
                    <Card>
                      <CardBody>
                        <ProductImage product={selectedProduct} />
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab title="Phụ kiện" key="component">
                    <Card>
                      <CardBody>
                        <ComponentPartDetails productId={selectedProduct.id} categories={categories} subCategories={subCategories} />
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab title="Thông số kĩ thuật" key="technical">
                    <Card>
                      <CardBody>
                        <TechnicalDetails product={selectedProduct} />
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab title="Thông số bán hàng" key="sale">
                    <Card>
                      <CardBody>
                        <SaleDetails product={selectedProduct} />
                      </CardBody>
                    </Card>
                  </Tab>
                </Tabs>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        size="5xl" scrollBehavior="inside"
        isOpen={addProduct.isOpen} onOpenChange={addProduct.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Thêm sản phẩm</ModalHeader>
              <ModalBody>
                <AvailableProduct filterId={filterId}
                  categories={categories}
                  subCategories={subCategories}
                  brands={brands}
                  selectedKeys={selectedKeys}
                  setSelectedKeys={setSelectedKeys}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit" onPress={() => onSave()}>
                  Lưu
                </Button>
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

export default FilterProduct