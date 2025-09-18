"use client"

import { Button, Select, SelectItem } from "@heroui/react";
import { useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { v4 } from "uuid";

const TechnicalDetailForSaleDetail = ({ saleDetailId, productId, allFilters, filterValueOnSaleDetail = [] }) => {

  const [saving, setSaving] = useState(false)

  const valueIdToFilterId = useMemo(() => {
    const map = {}
    ;(allFilters || []).forEach(f => {
      ;(f.filterValue || []).forEach(v => {
        map[v.id] = f.id
      })
    })
    return map
  }, [allFilters])

  const initialRows = useMemo(() => {
    const filterIdToValues = {}
    ;(filterValueOnSaleDetail || []).forEach(item => {
      const filterId = item.filterValue?.filterId
      const valueId = item.filterValueId
      if (!filterId || !valueId) return
      if (!filterIdToValues[filterId]) filterIdToValues[filterId] = new Set()
      filterIdToValues[filterId].add(valueId)
    })
    const rows = Object.entries(filterIdToValues).map(([filterId, set]) => {
      const first = Array.from(set)[0]
      return {
        id: v4(),
        filterId,
        valueId: first
      }
    })
    return rows
  }, [filterValueOnSaleDetail])

  const [rows, setRows] = useState(initialRows)

  const onSave = async () => {
    try {
      setSaving(true)
      const filterValueIds = Array.from(new Set(rows.map(r => r.valueId).filter(Boolean)))
      const res = await fetch(`/api/sale-details/${saleDetailId}/filter-values`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filterValueIds })
      })
      if (res.ok) {
        toast.success("Đã lưu giá trị filter cho biến thể")
      } else {
        toast.error("Không thể lưu giá trị filter cho biến thể")
      }
    } catch (e) {
      console.log(e)
      toast.error("Có lỗi xảy ra")
    } finally {
      setSaving(false)
    }
  }

  return (<>
    <ToastContainer />
    <div className="flex flex-col gap-4 max-w-5xl">
      <div className="flex flex-col gap-3">
        {rows.map((row) => {
          const selectedFilter = allFilters.find(f => f.id === row.filterId)
          return (
            <div key={row.id} className="flex items-start gap-3">
              <div className="flex-1">
                <Select
                  label="Filter"
                  selectedKeys={row.filterId ? new Set([row.filterId]) : new Set()}
                  onSelectionChange={(keys) => {
                    const key = keys?.values?.().next()?.value
                    setRows(prev => prev.map(r => {
                      if (r.id !== row.id) return r
                      const nextFilterId = key
                      const nextValueId = (r.valueId && valueIdToFilterId[r.valueId] === nextFilterId) ? r.valueId : undefined
                      return { ...r, filterId: nextFilterId, valueId: nextValueId }
                    }))
                  }}
                >
                  {allFilters.map(filter => (
                    <SelectItem key={filter.id} textValue={filter.name} className="py-4">
                      <div className="flex flex-col">
                        <span>{filter.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex-[2]">
                <Select
                  label="Giá trị filter"
                  placeholder={!row.filterId ? "Chọn filter trước" : ""}
                  isDisabled={!row.filterId}
                  selectedKeys={row.valueId ? new Set([row.valueId]) : new Set()}
                  onSelectionChange={(keys) => {
                    const key = keys?.values?.().next()?.value
                    if (!key || valueIdToFilterId[key] !== row.filterId) return
                    setRows(prev => prev.map(r => r.id === row.id ? { ...r, valueId: key } : r))
                  }}
                >
                  {(selectedFilter?.filterValue || []).map(fv => (
                    <SelectItem key={fv.id} textValue={fv.value}>
                      <div className="flex flex-col">
                        <span>{fv.value}</span>
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div>
                <Button size="sm" color="danger" variant="light" onPress={() => setRows(prev => prev.filter(r => r.id !== row.id))}>Xóa</Button>
              </div>
            </div>
          )
        })}
        <div>
          <Button variant="ghost" size="sm" onPress={() => setRows(prev => ([...prev, { id: v4(), filterId: undefined, valueId: undefined }]))}>Thêm dòng</Button>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          color="default"
          as="a"
          href={`/admin/product/edit/${productId}/`}
        >
          Quay về
        </Button>
        <Button color="primary" isLoading={saving} onPress={onSave}>Lưu</Button>
      </div>
    </div>
  </>)
};


export default TechnicalDetailForSaleDetail;
