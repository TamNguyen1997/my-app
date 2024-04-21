import { Table, TableBody, TableColumn, TableHeader, TableRow, TableCell, Accordion, AccordionItem } from "@nextui-org/react";

const TechnicalDetail = ({ data }) => {
  if (!data || data.length === 0) return <></>

  return (<>
    <div className="pt-6">
      <Accordion variant="shadow" isCompact>
        <AccordionItem key="1" aria-label="Thông số kĩ thuật" title="Thông số kĩ thuật">
          <Table hideHeader removeWrapper aria-label="Example static collection table">
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
        </AccordionItem>
      </Accordion>
    </div>
  </>)
}

export default TechnicalDetail