import { useAsyncList } from "@react-stately/data";
import {
  Spinner, Table,
  TableCell, TableColumn,
  TableHeader, TableRow,
  TableBody, useDisclosure,
  Modal, ModalHeader,
  ModalBody, ModalFooter,
  Button, ModalContent
} from "@nextui-org/react";
import { useCallback, useState } from "react";
import { EditIcon, Trash2 } from "lucide-react";
import DetailProductCms from "../admin/DetailProductCms"

const ProductCms = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState({});

  let list = useAsyncList({
    async load() {
      let res = await fetch('/api/products/');
      let json = await res.json();
      setIsLoading(false);

      return {
        items: json,
      };
    }
  });

  const openModal = (product) => {
    setSelectedProduct(product)
    onOpen()
  }

  const renderCell = useCallback((product, columnKey) => {
    const cellValue = product[columnKey];
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon onClick={() => openModal(product)} />
            </span>
            <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
              <Trash2 />
            </span>
          </div>
        );
      default:
        return cellValue;
    }
  }, [])

  return (
    <>
      <div className="flex flex-col gap-2 border-r min-h-full p-2">
        <div className="px-1 py-2 border-default-200">
          <Table
            aria-label="Tất cả sản phẩm">
            <TableHeader>
              <TableColumn key="id" textValue="Mã sản phẩm">Mã sản phẩm</TableColumn>
              <TableColumn key="description" textValue="Tên sản phẩm">Tên sản phẩm</TableColumn>
              <TableColumn key="actions" textValue="actions"></TableColumn>
            </TableHeader>
            <TableBody
              items={list.items}
              isLoading={isLoading}
              loadingContent={<Spinner label="Loading..." />}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Modal
        size="5xl" scrollBehavior="inside"
        isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chi tiết sản phẩm</ModalHeader>
              <ModalBody>
                <DetailProductCms product={selectedProduct}></DetailProductCms>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductCms;
