import { Button, Input } from "@nextui-org/react"
import { Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { v4 } from "uuid"

const TechnicalDetails = ({ product }) => {
  const [technicalRows, setTechnicalRows] = useState([])
  const [technicalColumns, setTechnicalColumns] = useState([])

  useEffect(() => {
    fetch(`/api/products/${product.id}/technical-details`).then(res => res.json()).then(technical => {
      setTechnicalColumns(technical ? JSON.parse(technical.column) : [])
      setTechnicalRows(technical ? JSON.parse(technical.row) : [])
    })
  }, [product])

  const addColumn = () => {
    const column = {
      id: v4(),
      name: "Tên cột"
    }
    setTechnicalColumns([...technicalColumns, column])

    technicalRows.forEach(row => { row[`${column.id}`] = "" })
    setTechnicalRows(technicalRows)
  }

  const addRow = () => {
    if (!technicalColumns.length) return
    let row = {
      id: v4()
    }
    technicalColumns.forEach(column => {
      row[`${column.id}`] = ""
    })
    setTechnicalRows([...technicalRows, row])
  }

  const columnValueChange = (id, value) => {
    technicalColumns.forEach(column => {
      if (column.id === id) {
        column.name = value
      }
    })
    setTechnicalColumns(technicalColumns)
  }

  const rowValueChange = (id, columnId, value) => {
    technicalRows.forEach(row => {
      if (row.id === id) {
        row[`${columnId}`] = value
      }
    })
    setTechnicalRows(technicalRows)
  }

  const removeColumn = (id) => {
    setTechnicalColumns(technicalColumns.filter(column => column.id !== id))
    technicalRows.forEach(row => { delete row[`${id}`] })
    setTechnicalRows(technicalRows)
  }

  const removeRow = (id) => {
    setTechnicalRows(technicalRows.filter(row => row.id !== id))
  }

  const onSave = async () => {
    const res = await fetch(`/api/products/${product.id}/technical-details`, {
      method: "POST",
      body: JSON.stringify({
        row: JSON.stringify(technicalRows),
        column: JSON.stringify(technicalColumns),
        productId: product.id
      })
    })

    if (res.ok) {
      toast.success("Đã lưu thông số kĩ thuật")
    } else {
      toast.error("Không thể lưu thông số kĩ thuật")
    }
  }

  return (
    <>
      <ToastContainer />
      <div>
        <Button color="default" variant="ghost" size="sm" className="float-right" onPress={addColumn}> Thêm cột </Button>
        <Button color="default" variant="ghost" size="sm" className="float-right" onPress={addRow}> Thêm hàng </Button>
      </div>
      <div>
        <table className="table-auto w-full">
          <thead>
            <tr>
              {
                technicalColumns.map(column =>
                  <th key={column.id} className="p-1">
                    <Input
                      aria-label={column.name}
                      defaultValue={column.name}
                      onValueChange={(value) => columnValueChange(column.id, value)}
                      isClearable
                      endContent={
                        <div className="relative flex items-center gap-2">
                          <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
                            <Trash2 onClick={() => removeColumn(column.id)} />
                          </span>
                        </div>
                      }
                    />
                  </th>
                )
              }
            </tr>
          </thead>
          <tbody>
            {
              technicalRows.map(row =>
                <tr key={row.id} className="p-1 min-h-full">
                  {
                    Object.keys(row).filter(key => key !== "id").map(key =>
                      <td key={key} className="p-1">
                        <Input
                          aria-label={row[key]}
                          defaultValue={row[key]}
                          isClearable
                          onValueChange={(value) => rowValueChange(row.id, key, value)}
                        />
                      </td>
                    )
                  }
                  <td>
                    <div className="m-auto">
                      <div className="text-lg text-danger cursor-pointer active:opacity-50">
                        <Trash2 onClick={() => removeRow(row.id)} />
                      </div>
                    </div>
                  </td>
                </tr>

              )
            }
          </tbody>
        </table>
        <div className="pt-3">
          <Button color="primary" onClick={onSave} className="w-24 float-right">Lưu</Button>
        </div>
      </div>
    </>
  )
}

export default TechnicalDetails