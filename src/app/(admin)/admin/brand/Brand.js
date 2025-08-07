"use client"
import PaginationWithTotal from "@/app/components/PaginationWithTotal";
import {
  Spinner,
  Table, TableBody,
  TableCell, TableColumn,
  TableHeader, TableRow,
} from "@heroui/react";
import { useEffect, useState } from "react";

const rowsPerPage = 10
const Brand = () => {

  const [brands, setBrands] = useState([])
  const [loadingState, setLoadingState] = useState('loading')

  const getBrands = () => {
    setLoadingState("loading")
    fetch(`/api/brands`)
      .then(async res => {
        const data = await res.json()
        setBrands(data)
        setLoadingState("idle")
      })
  }
  useEffect(() => {
    getBrands()
  }, [])
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <div className="border-default-200">
          <Table
            bottomContent={
              loadingState === "loading" ? null : (
                <div className="w-full flex">
                  <PaginationWithTotal
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={() => { }}
                    page={1}
                    setPage={() => { }}
                    pages={1}
                    total={brands.length}
                  />
                </div>
              )
            }
            aria-label="Tất cả thương hiệu">
            <TableHeader>
              <TableColumn key="id" textValue="id">ID</TableColumn>
              <TableColumn key="slug" textValue="slug">Slug</TableColumn>
              <TableColumn key="name" textValue="name">Tên thương hiệu</TableColumn>
            </TableHeader>
            <TableBody
              items={brands}
              isLoading={loadingState === 'loading'}
              emptyContent={"Không có thương hiệu nào"}
              loadingState={loadingState}
              loadingContent={<Spinner label="Loading..." />}
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Brand;
