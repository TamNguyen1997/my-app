"use client"

import {
  Spinner, Table,
  TableCell, TableColumn,
  TableHeader, TableRow,
  TableBody, useDisclosure,
  Modal, ModalHeader,
  ModalBody, ModalFooter,
  Button, ModalContent,
  Switch,
  Pagination,
  Card, CardBody, Tab, Tabs,
  Input,
  Select,
  SelectItem
} from "@nextui-org/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { EditIcon, Search, Trash2 } from "lucide-react"
import { redirect } from "next/navigation";
import ImagePicker from "@/components/admin/ui/ImagePicker";
import slugify from "slugify"
import { useEditor } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit';
import TipTapImage from '@tiptap/extension-image'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
import Placeholder from '@tiptap/extension-placeholder'
import TipTapBold from '@tiptap/extension-bold';
import TipTapItalic from '@tiptap/extension-italic';
import HardBreak from '@tiptap/extension-hard-break'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Link from '@tiptap/extension-link'
import RichTextEditor from "@/app/components/admin/ui/RichTextArea";
import TiptapTableRow from '@tiptap/extension-table-row'
import TiptapTableHeader from '@tiptap/extension-table-header'
import TiptapTableCell from '@tiptap/extension-table-cell'
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TiptapTable from '@tiptap/extension-table'
import ListKeymap from "@tiptap/extension-list-keymap";
import Gapcursor from '@tiptap/extension-gapcursor'
import { EmojiReplacer } from "@/app/components/admin/ui/extensions/EmojiReplacer";
import SaleDetails from "@/app/components/admin/ui/SaleDetails";
import TechnicalDetails from "@/app/components/admin/ui/TechnicalDetails";

const rowsPerPage = 10;

const updateProductActive = async (product, active) => {
  product.active = active
  await fetch(`/api/products/${product.id}`, { method: "PUT", body: JSON.stringify(product) })
}

const updateProductHighlight = async (product, active) => {
  product.highlight = active
  await fetch(`/api/products/${product.id}`, { method: "PUT", body: JSON.stringify(product) })
}

const ProductCms = () => {
  const [loadingState, setLoadingState] = useState("loading")
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedProduct, setSelectedProduct] = useState({})

  const [condition, setCondition] = useState({})

  const [reload, setReload] = useState(false)
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [brands, setBrands] = useState([])

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);

  const [technicalRows, setTechnicalRows] = useState([])
  const [technicalColumns, setTechnicalColumns] = useState([])

  const [saleDetails, setSaleDetails] = useState([])


  const editor = useEditor({
    extensions: [
      StarterKit, TipTapImage, TipTapBold, TipTapItalic, Underline, HardBreak, Subscript, Superscript, TextStyle, Color,
      TiptapTable.configure({
        resizable: true,
      }),
      ListKeymap,
      TiptapTableRow, Gapcursor,
      EmojiReplacer,
      TiptapTableHeader,
      TiptapTableCell,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal'
        }
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc'
        }
      }),
      Link.configure({
        protocols: ["http", "https"]
      }),
      Placeholder.configure({
        placeholder: "Nhập văn bản"
      })
    ],
    content: "<br><br><br><br><br><br><br>"
  })

  useEffect(() => {
    getProduct()
  }, [page])

  const getProduct = async () => {
    setLoadingState("loading")
    let filteredCondition = { ...condition }
    Object.keys(filteredCondition).forEach(key => filteredCondition[key] === undefined && delete filteredCondition[key])
    const queryString = new URLSearchParams(filteredCondition).toString()

    await fetch(`/api/products/?size=${10}&page=${page}&${queryString}`).then(async (res) => {
      const data = await res.json()
      setProducts(data.result)
      setTotal(data.total)
      setLoadingState("idle")
    })
  }

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(json => setCategories(json.result))
    fetch('/api/brands').then(res => res.json()).then(setBrands)
    fetch('/api/sub-categories').then(res => res.json()).then(json => setSubCategories(json.result))
  }, [])

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  const deleteProduct = (id) => {
    fetch(`/api/products/${id}`, { method: "DELETE" }).then(() => setReload(true))
  }

  const openModal = async (product, editor) => {
    Promise.all([
      fetch(`/api/products/${product.id}`).then(res => res.json()).then((json) => {
        setSelectedProduct(json)
        editor.commands.setContent(json.description)
      }),
      fetch(`/api/products/${product.id}/technical-details`).then(res => res.json()).then(technical => {
        setTechnicalColumns(technical ? JSON.parse(technical.column) : [])
        setTechnicalRows(technical ? JSON.parse(technical.row) : [])
      }),
      fetch(`/api/products/${product.id}/sale-details`).then(res => res.json()).then(setSaleDetails),
    ]).then(() => onOpen())
  }

  const newProduct = () => {
    setSelectedProduct({})
    editor.commands.setContent()
    onOpen()
  }

  const renderCell = useCallback((product, columnKey, editor) => {
    const cellValue = product[columnKey]
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon onClick={() => openModal(product, editor)} />
            </span>
            <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
              <Trash2 onClick={() => deleteProduct(product.id)} />
            </span>
          </div>
        )
      case "active":
        return (
          <div className="relative flex items-center gap-2">
            <Switch defaultSelected={product.active} onValueChange={(value) => updateProductActive(product, value)}></Switch>
          </div>
        )
      case "highlight":
        return (
          <div className="relative flex items-center gap-2">
            <Switch defaultSelected={product.highlight} onValueChange={(value) => updateProductHighlight(product, value)}></Switch>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  if (reload) {
    redirect("/admin/product")
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    let productToUpdate = selectedProduct

    delete productToUpdate.image
    delete productToUpdate.subCategory
    delete productToUpdate.brand
    delete productToUpdate.category

    productToUpdate.description = editor.getHTML()
    if (productToUpdate.id) {
      await fetch(`/api/products/${productToUpdate.id}`, {
        method: "PUT",
        body: JSON.stringify(productToUpdate)
      })
    } else {
      productToUpdate = await fetch(`/api/products/`, {
        method: "POST",
        body: JSON.stringify(productToUpdate)
      }).then(res => res.json())
    }
    if (saleDetails.length) {
      let saleDetailToUpdate = [...saleDetails]
      let secondarySaleDetails = []
      saleDetailToUpdate.forEach(detail => {
        if (secondarySaleDetails) {
          secondarySaleDetails.push(...detail.secondarySaleDetails)
        }
        delete detail.secondarySaleDetails
      })

      await fetch(`/api/products/${productToUpdate.id}/sale-details`, {
        method: "POST",
        body: JSON.stringify({ saleDetails: saleDetailToUpdate, secondarySaleDetails: secondarySaleDetails })
      })
    }

    await fetch(`/api/products/${productToUpdate.id}/technical-details`, {
      method: "POST",
      body: JSON.stringify({
        row: JSON.stringify(technicalRows),
        column: JSON.stringify(technicalColumns),
        productId: productToUpdate.id
      })
    })
    setReload(true)
  }

  const onConditionChange = (value) => {
    setCondition(Object.assign({}, condition, value))
  }

  return (
    <>
      <div className="flex flex-col gap-2 border-r min-h-full p-2">
        <div className="flex gap-3 w-1/2">
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

          <Select
            label="Nổi bật"
            labelPlacement="outside"
            onSelectionChange={(value) => onConditionChange({ highlight: value.values().next().value })}>
            <SelectItem key="true">
              Nổi bật
            </SelectItem>
            <SelectItem key="false">
              Không nổi bật
            </SelectItem>
          </Select>
          <Select
            label="Active"
            labelPlacement="outside"
            onSelectionChange={(value) => onConditionChange({ active: value.values().next().value })}>
            <SelectItem key="true">
              Active
            </SelectItem>
            <SelectItem key="false">
              Inactive
            </SelectItem>
          </Select>
          <div className="items-end flex min-h-full">
            <Button onClick={getProduct} color="primary"><Search /></Button>
          </div>
        </div>
        <div className="px-1 py-2 border-default-200">
          <Table
            aria-label="Tất cả sản phẩm"
            loadingState={loadingState}
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
              <TableColumn key="name" textValue="Tên sản phẩm" aria-label="Tên sản phẩm">Tên sản phẩm</TableColumn>
              <TableColumn key="slug" textValue="slug" aria-label="slug">Slug</TableColumn>
              <TableColumn key="highlight" textValue="highlight" aria-label="active">Nổi bật</TableColumn>
              <TableColumn key="active" textValue="active" aria-label="active">Active</TableColumn>
              <TableColumn key="actions" textValue="actions" width="100"></TableColumn>
            </TableHeader>
            <TableBody
              items={products}
              emptyContent={"Không có sản phẩm nào"}
              isLoading={loadingState === "loading"}
              loadingContent={<Spinner label="Loading..." />}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey, editor)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="p-3">
        <Button color="primary" onClick={newProduct}>Thêm sản phẩm</Button>
      </div>

      <Modal
        size="5xl" scrollBehavior="inside"
        isOpen={isOpen} onOpenChange={onOpenChange}>
        <form onSubmit={onSubmit}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Chi tiết sản phẩm</ModalHeader>
                <ModalBody>
                  <Tabs>
                    <Tab title="Thông tin chung">
                      <Card>
                        <CardBody>
                          <ProductDetailForm
                            categories={categories}
                            product={selectedProduct}
                            setProduct={setSelectedProduct}
                            brands={brands}
                            editor={editor}
                            subCategories={subCategories}
                          />
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab title="Thông số kĩ thuật">
                      <Card>
                        <CardBody>
                          <TechnicalDetails rows={technicalRows} setRows={setTechnicalRows} columns={technicalColumns} setColumns={setTechnicalColumns} />
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab title="Thông số bán hàng">
                      <Card>
                        <CardBody>
                          <SaleDetails saleDetails={saleDetails} setSaleDetails={setSaleDetails} productId={selectedProduct.id} />
                        </CardBody>
                      </Card>
                    </Tab>
                  </Tabs>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" type="submit">
                    Lưu
                  </Button>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}

const ProductDetailForm = ({
  categories, product, setProduct,
  brands, editor, subCategories }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const selectImage = (value) => {
    setProduct(Object.assign({}, product, { imageId: value.id, image: value }))
    onOpenChange()
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Input
            type="text"
            label="Tên sản phẩm"
            labelPlacement="outside"
            aria-label="Tên sản phẩm"
            defaultValue={product.name}
            isRequired
            onValueChange={(value) => setProduct(Object.assign({}, product, { name: value, slug: slugify(value, { locale: "vi" }).toLowerCase() }))}
          />
          <Input
            type="text"
            label="Slug"
            labelPlacement="outside"
            aria-label="Slug"
            value={product.slug}
            isRequired
            disabled
          />
          <Input
            type="number"
            label="Số lượng"
            labelPlacement="outside"
            aria-label="Số lượng"
            value={product.quantity}
            min={0}
            max={999}
            isRequired
            onValueChange={(value) => setProduct(Object.assign({}, product, { quantity: parseInt(value) }))}
          />
        </div>
        <div className="flex gap-2">
          <Select
            label="Category"
            aria-label="Category"
            selectedKeys={new Set([product.categoryId || ""])}
            onSelectionChange={(value) =>
              setProduct(Object.assign({}, product, { categoryId: value.values().next().value }))}
          >
            {categories.map(category => <SelectItem key={category.id}>{category.name}</SelectItem>)}
          </Select>
          <Select
            label="Thương hiệu"
            aria-label="Thương hiệu"
            selectedKeys={new Set([product.brandId || ""])}
            onSelectionChange={(value) =>
              setProduct(Object.assign({}, product, { brandId: value.values().next().value }))}
          >
            {brands.map(brand => <SelectItem key={brand.id}>{brand.name}</SelectItem>)}
          </Select>
          <Select
            label="Sub category"
            aria-label="Sub category"
            defaultSelectedKeys={new Set([product.subCategoryId || ""])}
            onSelectionChange={(value) =>
              setProduct(Object.assign({}, product, { subCategoryId: value.values().next().value }))}
          >
            {
              subCategories.map((subCategory) => (
                <SelectItem key={subCategory.id}>
                  {subCategory.name}
                </SelectItem>
              ))

            }
          </Select>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <div className="flex flex-col gap-3">
            <Input
              type="text"
              label="SKU"
              labelPlacement="outside"
              aria-label="SKU"
              defaultValue={product.sku}
              onValueChange={(value) => setProduct(Object.assign({}, product, { sku: value }))}
            />
            <Input type="text"
              aria-label="Hình ảnh"
              label="Hình ảnh"
              value={product.image?.name} isDisabled />
            <Input type="text"
              aria-label="Alt"
              label="Alt"
              onValueChange={(value) => setProduct(Object.assign({}, product, { imageAlt: value }))}
              defaultValue={product?.imageAlt} />
            <div>
              <Button color="primary" onClick={onOpen} className="w-24 float-right">Chọn ảnh</Button>
            </div>
          </div>

          <div>
            {
              product.image ?
                <img
                  src={`${process.env.NEXT_PUBLIC_FILE_PATH + product.image?.path}`}
                  alt={`${product.imageAlt}`}
                  width="300"
                  height="200"
                  className="float-right"
                /> : null
            }
          </div>

        </div>
        <RichTextEditor editor={editor} />
      </div>

      <Modal
        size="5xl" scrollBehavior="inside"
        isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chọn hình ảnh</ModalHeader>
              <ModalBody>
                <ImagePicker disableAdd={true} onImageClick={selectImage} disableDelete={true}></ImagePicker>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProductCms
