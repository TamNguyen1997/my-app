"use client"

import { Link, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { EditIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const rowsPerPage = 10;

const Order = () => {
  const [orders, setOrders] = useState([])
  const [loadingState, setLoadingState] = useState("loading")

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0)

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  useEffect(() => {
    getOrder()
  }, [page])

  const getOrder = async () => {
    setLoadingState("loading")
    const res = await fetch(`/api/order/?size=${rowsPerPage}&page=${page}`)
    const json = await res.json()
    setTotal(json.total)
    setOrders(json.result)
    setLoadingState("idle")
  }

  const renderCell = useCallback((filter, columnKey) => {
    const cellValue = filter[columnKey]
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <Link href={`/admin/order/view/${filter.id}`}>
                <EditIcon />
              </Link>
            </span>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  return (
    <>
      <div>
        <Table
          aria-label="Tất cả order"
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
            <TableColumn key="orderId" textValue="Mã đơn hàng" aria-label="Mã đơn hàng">Mã đơn hàng</TableColumn>
            <TableColumn key="name" textValue="Tên filter" aria-label="Tên filter">Tên khách hàng</TableColumn>
            <TableColumn key="status" textValue="status" aria-label="status">Trạng thái thanh toán</TableColumn>
            <TableColumn key="paymentMethod" textValue="paymentMethod" aria-label="paymentMethod">Phương thức thanh toán</TableColumn>
            <TableColumn key="email" textValue="email" aria-label="email">Email khách hàng</TableColumn>
            <TableColumn key="phone" textValue="phone" aria-label="phone">Điện thoại</TableColumn>
            <TableColumn key="total" textValue="total" aria-label="total">Số tiền</TableColumn>
            <TableColumn key="actions" textValue="actions" width="100"></TableColumn>
          </TableHeader>
          <TableBody
            items={orders}
            emptyContent={"Không có đơn hàng nào"}
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
    </>
  )
}

export default Order