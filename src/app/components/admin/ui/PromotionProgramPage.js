"use client";

import { Button, Checkbox, Input, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { EditIcon, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import PaginationWithTotal from "@/components/PaginationWithTotal";
import { toast, ToastContainer } from "react-toastify";
import { navigate } from "@/lib/utils";

const onDelete = async (id) => {
  if (!confirm("Bạn có muốn xóa chương trình khuyến mãi này?")) return

  toast.promise(
    fetch(`/api/promotion-program/${id}`, { method: "DELETE" }).then(async (res) => {
      if (!res.ok) {
        throw new Error((await res.json()).message)
      }
    }),
    {
      pending: 'Đang xóa chương trình khuyến mãi',
      success: {
        render() {
          navigate("/admin/promotion")
          return 'Đã xóa chương trình khuyến mãi'
        }
      },
      error: {
        render({ data }) {
          return `Không thể xóa: ${data.message}`
        }
      }
    },
    {
      containerId: "PromotionProgramPage"
    }
  )
}

const quickUpdatePromotionProgram = async (promotionProgram, value) => {
  return await fetch(`/api/promotion-program/${promotionProgram.id}`, {
    method: "PUT",
    body: JSON.stringify(value),
  })
}

const PromotionProgramPage = ({ promotionPrograms = [], queryParams = {}, total = 0 }) => {
  const [condition, setCondition] = useState(queryParams);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const pages = useMemo(() => {
    const total = promotionPrograms.length;
    return Math.ceil(total / rowsPerPage);
  }, [promotionPrograms.length, rowsPerPage]);

  const renderCell = useCallback((program, columnKey) => {
    const cellValue = program[columnKey]

    switch (columnKey) {
      case "active":
        return (
          <Checkbox defaultSelected={program[columnKey]} onChange={event => quickUpdatePromotionProgram(program, { [columnKey]: event.target.checked })} />
        )
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <Link href={`/admin/promotion/edit/${program.id}`}>
                <EditIcon />
              </Link>
            </span>
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <Trash2 onClick={() => onDelete(program.id)} />
              </span>
            </span>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  return (
    <>
      <ToastContainer containerId="PromotionProgramPage" />
      <div className="md:flex gap-3 w-1/2 pb-3">
        <Input label="Tìm" className="pt-2"
          aria-label="Tìm" labelPlacement="outside"
          defaultValue={condition.searchTerm}
          onValueChange={(value) => {
            if (value.length > 2 || !value.length) setCondition(Object.assign({}, condition, { searchTerm: value }))
          }}
        />
        <Select
          label="Trạng thái"
          labelPlacement="outside"
          defaultSelectedKeys={condition.active ? [condition.active.toString()] : []}
          onSelectionChange={(value) =>
            setCondition(Object.assign({}, condition, { active: value.values().next().value }))}
        >
          <SelectItem key="true">
            Active
          </SelectItem>
          <SelectItem key="false">
            Inactive
          </SelectItem>
        </Select>
        <div className="items-end flex min-h-full">
          <Link href={`/admin/promotion?${new URLSearchParams(condition)}`} className="flex items-center">
            <Button color="primary"><Search /></Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="border-default-200">
          <Table
            aria-label="Tất cả chương trình khuyến mãi"
            bottomContent={
              <div className="w-full flex">
                <PaginationWithTotal
                  rowsPerPage={rowsPerPage}
                  setRowsPerPage={setRowsPerPage}
                  page={page}
                  setPage={setPage}
                  pages={pages}
                  total={total}
                />
              </div>
            }>
            <TableHeader>
              <TableColumn key="name" textValue="name">Tên</TableColumn>
              <TableColumn key="active" textValue="active">Active</TableColumn>
              <TableColumn key="actions" textValue="actions"></TableColumn>
            </TableHeader>
            <TableBody
              items={promotionPrograms}
              emptyContent={"Không có chương trình khuyến mãi nào"}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Link href="/admin/promotion/new">
          <Button color="primary">Thêm chương trình khuyến mãi</Button>
        </Link>
      </div>
    </>
  );
}

export default PromotionProgramPage;