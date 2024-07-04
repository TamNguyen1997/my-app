import { Table, TableBody, TableColumn, TableHeader, TableRow, TableCell } from "@nextui-org/react";

const TechnicalDetail = ({ data }) => {
  if (!data || !data.column || !data.row) return <></>
  const columns = JSON.parse(data.column)
  const rows = JSON.parse(data.row)

  if (!columns.length || !rows.length) return <></>

  return (<>
    <div className="pt-6">
      <Table aria-label="Example static collection table" isStriped>
        <TableHeader>
          {
            columns.map(item => <TableColumn key={item.id}>{item.name}</TableColumn>)
          }
        </TableHeader>
        <TableBody>
          {
            rows.map((value) => {
              return <TableRow key={value.id}>
                {
                  Object.keys(value).filter(item => item !== "id").map(item => <TableCell key={item.id}>{value[item]}</TableCell>)
                }
              </TableRow>
            })
          }
        </TableBody>
      </Table>
    </div>
  </>)
}

export default TechnicalDetail