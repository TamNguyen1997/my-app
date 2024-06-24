import { Button, Input } from "@nextui-org/react"
import { Trash2 } from "lucide-react"
import { useContext } from "react";
import { v4 } from "uuid";
import { ProductContext } from "../ProductCms";

const TechnicalDetailForm = () => {
  const [product, selectedProduct, rows, setRows, columns, setColumns] = useContext(ProductContext)

  const addColumn = () => {
    const column = {
      id: v4(),
      name: "Tên cột"
    }
    setColumns([...columns, column])

    rows.forEach(row => { row[`${column.id}`] = "" })
    setRows(rows)
  }

  const addRow = () => {
    if (!columns.length) return
    let row = {
      id: v4()
    }
    columns.forEach(column => {
      row[`${column.id}`] = ""
    })
    setRows([...rows, row])
  }

  const columnValueChange = (id, value) => {
    columns.forEach(column => {
      if (column.id === id) {
        column.name = value
      }
    })
    setColumns(columns)
  }

  const rowValueChange = (id, columnId, value) => {
    rows.forEach(row => {
      if (row.id === id) {
        row[`${columnId}`] = value
      }
    })
    setRows(rows)
  }

  const removeColumn = (id) => {
    setColumns(columns.filter(column => column.id !== id))
    rows.forEach(row => { delete row[`${id}`] })
    setRows(rows)
  }

  return (
    <>
      <div>
        <Button color="default" variant="ghost" size="sm" className="float-right" onPress={addColumn}> Thêm cột </Button>
        <Button color="default" variant="ghost" size="sm" className="float-right" onPress={addRow}> Thêm hàng </Button>
      </div>
      <div>
        <table className="table-auto w-full">
          <thead>
            <tr>
              {
                columns.map(column =>
                  <th key={column.id} className="p-1">
                    <Input
                      aria-label={column.name}
                      defaultValue={column.name}
                      onValueChange={(value) => columnValueChange(column.id, value)}
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
              rows.map(row =>
                <tr key={row.id} className="p-1">
                  {
                    Object.keys(row).filter(key => key !== "id").map(key =>
                      <td key={key} className="p-1">
                        <Input
                          aria-label={row[key]}
                          defaultValue={row[key]}
                          isClearable
                          onValueChange={(value) => rowValueChange(row.id, row[key], value)}
                        />
                      </td>
                    )
                  }
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default TechnicalDetailForm
