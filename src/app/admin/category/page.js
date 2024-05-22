"use client"

import { Button, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const Category = () => {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getCategories = () => {
      fetch('/api/categories/').then(async res => {
        setCategories(await res.json())
        setIsLoading(false)
      })
    }
    getCategories()
  }, [])

  const newCategory = () => { }

  const renderCell = useCallback((product, columnKey) => {
    const cellValue = product[columnKey]
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              {/* <EditIcon onClick={() => openModal(product)} /> */}
            </span>
            <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
              <Trash2 />
            </span>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  return (
    <div>
      <div className="flex flex-col gap-2 border-r min-h-full p-2">
        <div className="px-1 py-2 border-default-200">
          <Table
            aria-label="Tất cả sản phẩm">
            <TableHeader>
              <TableColumn key="id" textValue="Mã sản phẩm">ID category</TableColumn>
              <TableColumn key="name" textValue="name">Category</TableColumn>
              <TableColumn key="actions" textValue="actions" width="100"></TableColumn>
            </TableHeader>
            <TableBody
              items={categories}
              isLoading={isLoading}
              emptyContent={"Không có category nào"}
              loadingContent={<Spinner label="Loading..." />}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="p-3">
        <Button color="primary" onClick={newCategory}>Thêm category</Button>
      </div>
    </div>
  );
};

export default Category;
