"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  EXPORT_MESSAGE,
  IMPORT_MESSAGE,
  UPLOAD_MESSAGE,
} from "@/constants/message";
import { Button, Select, SelectItem } from "@nextui-org/react";
import HistoryList from "./_components/HistoryList";

import { DownloadIcon, UploadIcon } from "lucide-react";

const History = () => {
  const inputRef = useRef(null);
  const [type, setType] = useState("product");
  const [refreshData, setRefreshData] = useState(false);
  const [total, setTotal] = useState([]);
  const [ranges, setRanges] = useState([]);
  const [selectedRange, setSelectedRange] = useState();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    e.target.value = null;
    if (!file) {
      toast.error(UPLOAD_MESSAGE.FILE_NOT_SELECTED, {
        containerId: "ImportExportContainer",
      });
      return;
    }

    if (
      type === null ||
      !["category", "product", "technical_detail", "sale_detail"].includes(type)
    ) {
      toast.error(UPLOAD_MESSAGE.UPLOAD_TYPE_ERROR, {
        containerId: "ImportExportContainer",
      });
      return;
    }

    if (file) {
      const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

      if (ext !== ".xlsx" && ext !== ".xls") {
        toast.error(UPLOAD_MESSAGE.INVALID_FILE_TYPE, {
          containerId: "ImportExportContainer",
        });
      } else {
        await handleUpload(file);
      }
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await fetch(`/api/upload`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        toast.error(uploadData.message || UPLOAD_MESSAGE.FILE_UPLOAD_FAILED, {
          containerId: "ImportExportContainer",
        });
        return;
      }

      toast.success(uploadData.message || UPLOAD_MESSAGE.FILE_UPLOAD_SUCCESS, {
        containerId: "ImportExportContainer",
      });

      toast.info(UPLOAD_MESSAGE.PROCESSING, {
        containerId: "ImportExportContainer",
      });
      //---------------------------------------
      if (type === "category") {
        const importRes = await fetch(`/api/import`, {
          method: "POST",
          body: formData,
        });
        const importData = await importRes.json();

        if (!importRes.ok) {
          toast.error(importData.message || IMPORT_MESSAGE.IMPORT_FAILED, {
            containerId: "ImportExportContainer",
          });
          return;
        }
        toast.success(importData.message || IMPORT_MESSAGE.IMPORT_SUCCESS, {
          containerId: "ImportExportContainer",
        });
      } else {
        const importRes = await fetch(`/api/import-excel?type=${type}`, {
          method: "POST",
          body: formData,
        });
        const importData = await importRes.json();

        if (!importRes.ok) {
          toast.error(importData.message || IMPORT_MESSAGE.IMPORT_FAILED, {
            containerId: "ImportExportContainer",
          });
          return;
        }

        toast.success(importData.message || IMPORT_MESSAGE.IMPORT_SUCCESS, {
          containerId: "ImportExportContainer",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(IMPORT_MESSAGE.IMPORT_FAILED, {
        containerId: "ImportExportContainer",
      });
    } finally {
      setRefreshData((prev) => !prev);
    }
  };

  const handleExport = async () => {
    if (!selectedRange) {
      toast.error(EXPORT_MESSAGE.SELECT_RANGE_ERROR, {
        containerId: "ImportExportContainer",
      });
      return;
    }

    const { start, end } = selectedRange;

    toast.info(EXPORT_MESSAGE.EXPORT_IN_PROGRESS, {
      containerId: "ImportExportContainer",
    });

    try {
      const res = await fetch(`/api/export-excel?start=${start}&end=${end}`);

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `data-${start}-${end}.xlsx`);

        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        toast.success(EXPORT_MESSAGE.EXPORT_SUCCESS, {
          containerId: "ImportExportContainer",
        });
      } else {
        const { message } = await res.json();
        toast.error(`Export failed: ${message}`, {
          containerId: "ImportExportContainer",
        });
      }
    } catch (error) {
      toast.error(EXPORT_MESSAGE.EXPORT_FAILED, {
        containerId: "ImportExportContainer",
      });
    }
  };

  const getTotal = useCallback((total) => {
    setTotal(total);
  }, []);

  useEffect(() => {
    const createRanges = () => {
      const newRanges = [];
      for (let i = 0; i < total; i += 1000) {
        const start = i;
        const end = Math.min(i + 1000, total);
        newRanges.push({ start, end });
      }
      setRanges(newRanges);
    };

    createRanges();
  }, [total]);

  return (
    <>
      <ToastContainer containerId="ImportExportContainer" />
      <div className="flex flex-col gap-2 border-r min-h-full p-2 pt-40">
        <HistoryList refreshData={refreshData} onGetTotal={getTotal} />

        <div className="flex gap-2 items-center justify-between mt-10 flex-wrap">
          <div className="flex items-center gap-2">
            <Select
              label="Loại"
              labelPlacement="outside"
              disallowEmptySelection
              defaultSelectedKeys={["product"]}
              onSelectionChange={(value) => {
                setType(value.values().next().value);
              }}
              className="!m-0 w-60"
            >
              <SelectItem key="product">Sản phẩm</SelectItem>
              <SelectItem key="technical_detail">Thông số kỹ thuật</SelectItem>
              <SelectItem key="sale_detail">Thông số bán hàng</SelectItem>
            </Select>

            <input
              type="file"
              className="hidden"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              ref={inputRef}
            />
            <Button
              type="button"
              color="success"
              onClick={() => inputRef.current.click()}
              endContent={<UploadIcon />}
            >
              Import
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Select
              label="Khoảng xuất dữ liệu"
              labelPlacement="outside"
              onSelectionChange={(value) => {
                const [start, end] = value
                  .values()
                  .next()
                  .value.split("-")
                  .map(Number);
                setSelectedRange({ start, end });
              }}
              className="!m-0 w-60"
            >
              {ranges.map((range) => (
                <SelectItem
                  key={`${range.start}-${range.end}`}
                  textValue={`${range.start}-${range.end}`}
                >
                  {range.start} - {range.end}
                </SelectItem>
              ))}
            </Select>

            <Button
              type="button"
              color="danger"
              onPress={handleExport}
              endContent={<DownloadIcon />}
            >
              Export
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default History;
