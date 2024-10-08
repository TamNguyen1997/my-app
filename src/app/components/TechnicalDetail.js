import { getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { v4 } from "uuid";

const TechnicalDetail = ({ data }) => {
  if (!data || !data.length) return <></>

  const result = data.map(item => {
    return {
      id: v4(),
      filter: item.filter.name,
      filterValue: item.filterValue.value
    }
  })

  return (<>
    <div className="pt-6">
      <Table aria-label="Example static collection table" isStriped hideHeader>
        <TableHeader>
          <TableColumn key="filter" textValue="filter" aria-label="filter">filter</TableColumn>
          <TableColumn key="filterValue" textValue="filterValue" aria-label="filterValue">filterValue</TableColumn>
        </TableHeader>
        <TableBody items={result}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  </>)
}

export default TechnicalDetail