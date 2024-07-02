import { Table, TableBody, TableColumn, TableHeader, TableRow, TableCell, Accordion, AccordionItem } from "@nextui-org/react";

const TechnicalDetail = ({ data }) => {
  if (!data || !data.column || !data.row) return <></>

  console.log(data)
  return (<>
    <div className="pt-6">
      <Accordion variant="shadow" isCompact>
        <AccordionItem key="1" aria-label="Thông số kĩ thuật" title="Thông số kĩ thuật">
          <Table removeWrapper aria-label="Example static collection table">
            <TableHeader>
              {
                JSON.parse(data.column).map(item => <TableColumn key={item.id}>{item.name}</TableColumn>)
              }
            </TableHeader>
            <TableBody>
              {
                JSON.parse(data.row).map((value) => {
                  return <TableRow key={value.id}>
                    {
                      Object.keys(value).filter(item => item !== "id").map(item => <TableCell>{value[item]}</TableCell>)
                    }
                  </TableRow>
                })
              }
            </TableBody>
          </Table>
        </AccordionItem>
      </Accordion>
    </div>
  </>)
}

export default TechnicalDetail