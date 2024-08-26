"use client"

import {
  Button, Input,
  Link,
  Pagination, Select, SelectItem, Spinner,
  Switch,
  Table, TableBody,
  TableCell, TableColumn,
  TableHeader, TableRow,
} from "@nextui-org/react";
import { EditIcon, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ToastContainer, toast } from 'react-toastify';

const rowsPerPage = 20;

const RedirectList = () => {
  const [redirects, setRedirects] = useState([])
  const [condition, setCondition] = useState({})

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0)
  const [loadingState, setLoadingState] = useState("loading")


  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  const getRedirects = () => {
    setLoadingState("loading")
    let filteredCondition = { ...condition }
    Object.keys(filteredCondition).forEach(key => filteredCondition[key] === undefined && delete filteredCondition[key])
    const queryString = new URLSearchParams(filteredCondition).toString()
    fetch(`/api/redirects/?size=${rowsPerPage}&page=${page}&${queryString}&includeImage=true`).then(async res => {
      const data = await res.json()
      setRedirects(data.result)
      setTotal(data.total)
      setLoadingState("idle")
    })
  }

  useEffect(() => {
    getRedirects()
  }, [page, condition])


  const deleteRedirect = (id) => {
    toast.promise(
      fetch(`/api/redirects/${id}`, { method: "DELETE" }).then(async (res) => {
        getRedirects()
        if (!res.ok) {
          throw new Error((await res.json()).message)
        }
      }),
      {
        pending: 'Đang xóa redirect',
        success: 'Đã xóa redirect',
        error: {
          render({ data }) {
            return data.message
          }
        }
      }
    )
  }

  const quickUpdate = async (redirect, value) => {
    const res = await fetch(`/api/redirects/${redirect.id}`, { method: "PUT", body: JSON.stringify(value) })
    if (res.ok) {
      toast.success("Đã cập nhật")
    } else {
      toast.error("Không thể cập nhật")
    }
  }

  const renderCell = useCallback((redirect, columnKey) => {
    const cellValue = redirect[columnKey]

    switch (columnKey) {
      case "active":
        return <div className="relative flex items-center">
          <Switch defaultSelected={redirect.active} onValueChange={(value) => quickUpdate(redirect, { active: value })}></Switch>
        </div>
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <Link href={`/admin/redirect/edit/${redirect.id}`}>
                <EditIcon />
              </Link>
            </span>
            <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
              <Trash2 onClick={() => { deleteRedirect(redirect.id) }} />
            </span>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-3 w-1/2">
        <Input label="From" aria-label="From" labelPlacement="outside" defaultValue={condition.from}
          onValueChange={(value) => {
            if (value.length > 2 || !value.length) setCondition(Object.assign({}, condition, { from: value }))
          }}
        />
        <Input label="To" aria-label="To" labelPlacement="outside" value={condition.to}
          onValueChange={(value) => {
            if (value.length > 2 || !value.length) setCondition(Object.assign({}, condition, { to: value }))
          }}
        />
        <Select
          label="Loại"
          labelPlacement="outside"
          onSelectionChange={(value) =>
            setCondition(Object.assign({}, condition, { redirectType: value.values().next().value }))}
        >
          <SelectItem key="EXACT">
            EXACT
          </SelectItem>
          <SelectItem key="REGEX">
            REGEX
          </SelectItem>
        </Select>
        <div className="items-end flex min-h-full">
          <Button onClick={getRedirects} color="primary"><Search /></Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="border-default-200">
          <Table
            aria-label="Tất cả redirect"
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
              <TableColumn key="from" textValue="from">From</TableColumn>
              <TableColumn key="to" textValue="to">To</TableColumn>
              <TableColumn key="redirectType" textValue="redirectType">Loại</TableColumn>
              <TableColumn key="active" textValue="active">Active</TableColumn>
              <TableColumn key="actions" textValue="actions"></TableColumn>
            </TableHeader>
            <TableBody
              items={redirects}
              isLoading={loadingState === 'loading'}
              emptyContent={"Không có redirect nào"}
              loadingState={loadingState}
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
          <Link href="/admin/redirect/edit/new">Thêm redirect</Link>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default RedirectList;
