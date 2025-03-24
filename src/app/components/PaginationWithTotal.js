import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination } from "@nextui-org/react";

const PaginationWithTotal = ({ rowsPerPage, setRowsPerPage, page, pages, setPage, total = 0 }) => {
  return (
    <>
      <div className="flex gap-2">
        <p className="pt-2 opacity-70 text-small">Hiển thị</p>
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="light"
            >
              {rowsPerPage}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(key) => setRowsPerPage && setRowsPerPage(key)}
          >
            <DropdownItem key="10">10</DropdownItem>
            <DropdownItem key="20">20</DropdownItem>
            <DropdownItem key="50">50</DropdownItem>
            <DropdownItem key="100">100</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <p className="pt-2 opacity-70 text-small">trên tổng số {total}.</p>
      </div>
      <div className="flex justify-center mx-auto">
        <Pagination
          isCompact
          showControls
          showShadow
          page={page > pages ? 1 : page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
      </div>
    </>
  )
}

export default PaginationWithTotal;