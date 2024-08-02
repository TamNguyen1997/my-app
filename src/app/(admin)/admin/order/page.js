"use client"

import { Button, Checkbox, Link, Pagination, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { EditIcon, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const rowsPerPage = 10;

const Order = () => {
  const [orders, setOrders] = useState([])
  const [loadingState, setLoadingState] = useState("loading")

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0)

  const [condition, setCondition] = useState({})

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  useEffect(() => {
    getOrder()
  }, [page])

  const getOrder = async () => {
    let filteredCondition = { ...condition }
    Object.keys(filteredCondition).forEach(key => filteredCondition[key] === undefined && delete filteredCondition[key])
    const queryString = new URLSearchParams(filteredCondition).toString()

    setLoadingState("loading")
    const res = await fetch(`/api/order/?size=${rowsPerPage}&page=${page}&${queryString}`)
    const json = await res.json()
    setTotal(json.total)
    setOrders(json.result)
    setLoadingState("idle")
  }

  const renderCell = useCallback((order, columnKey) => {
    const cellValue = order[columnKey]
    switch (columnKey) {
      case "total":
        return order.total + order.shippingFee
      case "shippingOrderCreated":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <Checkbox isSelected={order.shippingOrderCreated} disabled />
            </span>
          </div>
        )
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <Link href={`/admin/order/view/${order.id}`}>
                <EditIcon />
              </Link>
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
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <Select
            className="w-56"
            label="Phương thức thanh toán"
            labelPlacement="outside"
            onSelectionChange={(value) => onConditionChange({ paymentMethod: value.values().next().value })}>
            <SelectItem key="COD">
              COD
            </SelectItem>
            <SelectItem key="VIETQR">
              Chuyển khoản
            </SelectItem>
          </Select>
          <Select
            className="w-56"
            label="Đã tạo đơn vận chuyển"
            labelPlacement="outside"
            onSelectionChange={(value) => onConditionChange({ shippingOrderCreated: value.values().next().value })}>
            <SelectItem key="true">
              Đã tạo đơn vận chuyển
            </SelectItem>
            <SelectItem key="false">
              Chưa tạo đơn vận chuyển
            </SelectItem>
          </Select>
          <Select
            className="w-56"
            label="Trạng thái đơn hàng"
            labelPlacement="outside"
            onSelectionChange={(value) => onConditionChange({ shippingStatus: value.values().next().value })}>
            <SelectItem key="WAITING">
              Đang đợi giao hàng
            </SelectItem>
            <SelectItem key="SHIPPING">
              Đang giao hàng
            </SelectItem>
            <SelectItem key="SHIPPED">
              Đã giao hàng
            </SelectItem>
          </Select>
          <div className="items-end flex min-h-full">
            <Button onClick={getOrder} color="primary"><Search /></Button>
          </div>
        </div>
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
            <TableColumn key="shippingOrderCreated" textValue="shippingOrderCreated" aria-label="shippingOrderCreated">Đã tạo đơn vận chuyển</TableColumn>
            <TableColumn key="phone" textValue="phone" aria-label="phone">Điện thoại</TableColumn>
            <TableColumn key="total" textValue="total" aria-label="total">Tổng tiền</TableColumn>
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