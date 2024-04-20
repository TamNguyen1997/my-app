import { Table, TableBody, TableColumn, TableHeader, TableRow, TableCell } from "@nextui-org/react";

const TechnicalDetail = ({ data }) => {
  if (!data || data.length === 0) return <></>

  return (<>
    <div className="font-semibold pb-3">Thông số kĩ thuật</div>
    <Table hideHeader isStriped aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>Key</TableColumn>
        <TableColumn>Value</TableColumn>
      </TableHeader>
      <TableBody>
        {
          data.map((value) => {
            return <TableRow key={value.key}>
              <TableCell>{value.key}</TableCell>
              <TableCell>{value.value}</TableCell>
            </TableRow>
          })
        }
      </TableBody>
    </Table>
  </>)
}

export default TechnicalDetail