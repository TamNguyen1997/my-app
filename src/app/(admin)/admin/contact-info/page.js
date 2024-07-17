"use client"

import {
  Spinner, Table,
  TableCell, TableColumn,
  TableHeader, TableRow,
  TableBody,
  Button,
  Pagination,
  Input
} from "@nextui-org/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { EditIcon, Search } from "lucide-react"

const rowsPerPage = 10;

const ContactInfoCms = () => {
  const [loadingState, setLoadingState] = useState("loading")

  const [condition, setCondition] = useState({})

  const [total, setTotal] = useState(0)

  const [page, setPage] = useState(1);
  const [contactInfo, setContactInfo] = useState([])


  useEffect(() => {
    getContactInfo()
  }, [page, condition])

  const getContactInfo = useCallback(async () => {
    setLoadingState("loading")
    let filteredCondition = { ...condition }
    Object.keys(filteredCondition).forEach(key => filteredCondition[key] === undefined && delete filteredCondition[key])
    const queryString = new URLSearchParams(filteredCondition).toString()

    await fetch(`/api/contact-info/?size=${10}&page=${page}&${queryString}`).then(async (res) => {
      const data = await res.json()
      setContactInfo(data.result)
      setTotal(data.total)
      setLoadingState("idle")
    })
  }, [condition])

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);


  const renderCell = useCallback((contactInfo, columnKey) => {
    const cellValue = contactInfo[columnKey]
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon onClick={() => { }} />
            </span>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  const onConditionChange = (value) => {
    setCondition(Object.assign({}, condition, value))
  }

  return (
    <>
      <div className="flex flex-col gap-2 border-r min-h-full p-2">
        <div className="flex gap-3 w-1/2">
          <Input label="Tên" aria-label="Tên" labelPlacement="outside" defaultValue={condition.name}
            isClearable
            onValueChange={(value) => {
              if (value.length > 2 || value.length === 0) onConditionChange({ name: value })
            }}
          />
          <Input label="Số điện thoại" aria-label="phone" labelPlacement="outside" defaultValue={condition.slug}
            isClearable
            onValueChange={(value) => {
              if (value.length > 2 || value.length === 0) onConditionChange({ phone: value })
            }}
          />
          <Input label="Email" aria-label="email" labelPlacement="outside" defaultValue={condition.slug}
            isClearable
            onValueChange={(value) => {
              if (value.length > 2 || value.length === 0) onConditionChange({ email: value })
            }}
          />

          <div className="items-end flex min-h-full">
            <Button onClick={getContactInfo} color="primary"><Search /></Button>
          </div>
        </div>
        <div className="px-1 py-2 border-default-200">
          <Table
            aria-label="Tất cả thông tin liên hệ"
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
              <TableColumn key="name" textValue="name" aria-label="name">Tên</TableColumn>
              <TableColumn key="phone" textValue="phone" aria-label="phone">Số điện thoại</TableColumn>
              <TableColumn key="email" textValue="email" aria-label="email">Email</TableColumn>
              <TableColumn key="actions" textValue="actions" aria-label="actions"></TableColumn>
            </TableHeader>
            <TableBody
              items={contactInfo}
              emptyContent={"Không có thông tin nào"}
              isLoading={loadingState === "loading"}
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
    </>
  )
}

export default ContactInfoCms
