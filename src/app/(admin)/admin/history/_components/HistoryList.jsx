"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { history_status } from "@prisma/client";

const HistoryList = ({ refreshData }) => {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [limit] = useState(searchParams.get("limit") || 10);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingState, setLoadingState] = useState("loading");
  const [histories, setHistories] = useState([]);
  const [search, setSearch] = useState();
  const [condition, setCondition] = useState();

  const fetchImportHistory = async () => {
    try {
      const res = await fetch(
        `/api/history?page=${page}&limit=${limit}&search=${search}&status=${condition}`,
        {
          method: "GET",
        }
      );

      const result = await res.json();
      setLoadingState("idle");
      setTotalPages(result.totalPages);
      setHistories(result.data);
      result.currentPage !== page && setPage(result.currentPage);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchImportHistory();

    return () => {};
  }, [page, refreshData]);

  function convertIsoToLocalTime(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const renderCell = useCallback((key, item) => {
    const value = item[key];

    switch (key) {
      case "createdAt": {
        return convertIsoToLocalTime(value);
      }
      case "updatedAt": {
        return item["status"] === "PROCESSING"
          ? ""
          : convertIsoToLocalTime(value);
      }
      case "status": {
        return item["status"] === "PROCESSED" ? (
          <span className="text-green-500">{value}</span>
        ) : item["status"] === "ERROR" ? (
          <span className="text-red-500">{value}</span>
        ) : (
          <span>{value}</span>
        );
      }
      default:
        return value;
    }
  }, []);

  const handleSearch = async () => {
    setPage(1);
    await fetchImportHistory();
  };

  return (
    <div className="px-1 py-2 border-default-200">
      <div className="flex gap-3 md:w-1/2 mb-3">
        <Input
          label="Tên file"
          aria-label="file-name"
          labelPlacement="outside"
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            if (value.length > 2) handleSearch();
          }}
        />

        <Select
          label="Trạng thái"
          labelPlacement="outside"
          onSelectionChange={(value) =>
            setCondition(value.values().next().value)
          }
        >
          <SelectItem key={history_status.PROCESSING}>Đang xử lý</SelectItem>
          <SelectItem key={history_status.PROCESSED}>Thành công</SelectItem>
          <SelectItem key={history_status.ERROR}>Lỗi</SelectItem>
        </Select>

        <div className="items-end flex min-h-full">
          <Button
            color="primary"
            onPress={() => handleSearch()}
            endContent={<Search />}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      <Table
        aria-label="Lịch sử import file excel"
        loadingState={loadingState}
        bottomContent={
          loadingState === "loading" ? null : (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                page={page}
                total={totalPages}
                onChange={(page) => setPage(page)}
              />
            </div>
          )
        }
      >
        <TableHeader>
          {[
            { key: "fileName", title: "Tên file" },
            { key: "createdAt", title: "Ngày import" },
            { key: "updatedAt", title: "Ngày hoàn thành" },
            { key: "status", title: "Trạng thái" },
          ].map((el) => (
            <TableColumn
              key={el.key}
              textValue={el.title}
              aria-label={el.title}
            >
              {el.title}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          items={histories}
          emptyContent={"Không có lịch sử nào"}
          isLoading={loadingState === "loading"}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(key) => <TableCell>{renderCell(key, item)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default HistoryList;
