"use client"

import {
  Button, Input,
  Link,
  Pagination, Select, SelectItem, Spinner,
  Switch,
  Table, TableBody,
  TableCell, TableColumn,
  TableHeader, TableRow,
} from "@nextui-org/react";
import { EditIcon, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ToastContainer, toast } from 'react-toastify';

import { v4 } from "uuid";

const rowsPerPage = 20;

const RedirectList = () => {
  const [redirects, setRedirects] = useState([])
  const [filteredRedirects, setFilteredRedirects] = useState([])
  const [condition, setCondition] = useState({})

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0)
  const [loadingState, setLoadingState] = useState("loading")


  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  // GET Object => Array
  const formatRedirectList = (src) => {
    if(!src || !Object.keys(src)?.length) return [];
    
    return Object.entries(src)?.map(([key, value]) => ({
      id: v4(),
      ...value,
      source: key
    }));
  }

  // Array => PUT Object
  const formatRedirectObject = (src) => {
    if(!src?.length) return {};

    return src.reduce((acc, item) => {
      let { id, source, ...value } = item;
      acc[item.source] = value;
      return acc;
    }, {});
  }

  const getRedirects = () => {
    setLoadingState("loading")
    let filteredCondition = { ...condition }
    Object.keys(filteredCondition).forEach(key => filteredCondition[key] === undefined && delete filteredCondition[key])
    const queryString = new URLSearchParams(filteredCondition).toString()
    fetch(`/api/redirects/?size=${rowsPerPage}&page=${page}&${queryString}&includeImage=true`).then(async res => {
      const data = await res.json()
      // setRedirects([])
      setRedirects(formatRedirectList(data));
      setTotal(0)
      setLoadingState("idle")
    })
  }

  useEffect(() => {
    getRedirects()
  }, []);
  
  useEffect(() => {
    const isEmptyCondition = Object.keys(condition)?.every(key => !condition[key] && condition[key] !== false);
    setFilteredRedirects(redirects?.filter(redirect => isEmptyCondition || Object.keys(condition)?.some(key => condition[key] && (redirect[key] === condition[key] || redirect[key]?.toLowerCase().includes(condition[key]?.toLowerCase())))))
  }, [page, condition, redirects]);

  const deleteRedirect = (id) => {
    setRedirects(redirects?.filter(redirect => redirect.id !== id));
    // toast.promise(
    //   fetch(`/api/redirects/${id}`, { method: "DELETE" }).then(async (res) => {
    //     getRedirects()
    //     if (!res.ok) {
    //       throw new Error((await res.json()).message)
    //     }
    //   }),
    //   {
    //     pending: 'Đang xóa redirect',
    //     success: 'Đã xóa redirect',
    //     error: {
    //       render({ data }) {
    //         return data.message
    //       }
    //     }
    //   }
    // )
  }

  const quickUpdate = async (redirect, value) => {
    const res = await fetch(`/api/redirects/${redirect.id}`, { method: "PUT", body: JSON.stringify(value) })
    if (res.ok) {
      toast.success("Đã cập nhật")
    } else {
      toast.error("Không thể cập nhật")
    }
  }

  const onCellValueChange = (redirectId, value) => {
    let redirectsToUpdate = [ ...redirects ]?.map(redirect => redirect.id === redirectId ? Object.assign({...redirect}, value) : redirect);
    setRedirects(redirectsToUpdate);
  }

  const addNewRedirect = () => {
    setRedirects([
      ...redirects,
      {
        id: v4(),
        source: "",
        destination: "",
        permanent: true
      }
    ])
  }

  const onSave = async () => {
    const dataToUpdate = formatRedirectObject(redirects);
    const res = await fetch(`/api/redirects`, { method: "PUT", body: JSON.stringify(dataToUpdate) });
    if (res.ok) {
      toast.success("Đã cập nhật");
    } else {
      toast.error("Không thể cập nhật");
    }
  }

  const renderCell = ((redirect, columnKey) => {
    const cellValue = redirect[columnKey]

    switch (columnKey) {
      case "active":
        return <div className="relative flex items-center">
          <Switch
            defaultSelected={cellValue}
            // onValueChange={(value) => quickUpdate(redirect, { active: value })}
            onValueChange={(value) => onCellValueChange(redirect?.id, { [columnKey]: value })}
          ></Switch>
        </div>
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            {/* <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <Link href={`/admin/redirect/edit/${redirect.id}`}>
                <EditIcon />
              </Link>
            </span> */}
            <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
              <Trash2 onClick={() => { deleteRedirect(redirect.id) }} />
            </span>
          </div>
        )
      case "redirectType":
        return (
          <Select
            aria-label={columnKey}
            labelPlacement="outside"
            value={cellValue}
            onSelectionChange={(value) => onCellValueChange(redirect?.id, { [columnKey]: value.values().next().value })}
            className="min-w-[100px]"
          >
            <SelectItem key="EXACT">
              EXACT
            </SelectItem>
            <SelectItem key="REGEX">
              REGEX
            </SelectItem>
          </Select>
        )
      default:
        // return cellValue
        return (
          <Input
            aria-label={columnKey}
            defaultValue={cellValue}
            onValueChange={(value) => onCellValueChange(redirect?.id, { [columnKey]: value })}
          />
        )
    }
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <Input label="From" aria-label="From" labelPlacement="outside" defaultValue={condition.source}
          onValueChange={(value) => {
            if (value.length > 2 || !value.length) setCondition(Object.assign({}, condition, { source: value }))
          }}
        />
        <Input label="To" aria-label="To" labelPlacement="outside" defaultValue={condition.destination}
          onValueChange={(value) => {
            if (value.length > 2 || !value.length) setCondition(Object.assign({}, condition, { destination: value }))
          }}
        />
        <Select
          label="Loại"
          labelPlacement="outside"
          onSelectionChange={(value) =>
            setCondition(Object.assign({}, condition, { redirectType: value.values().next().value }))}
        >
          <SelectItem key="">
            ALL
          </SelectItem>
          <SelectItem key="EXACT">
            EXACT
          </SelectItem>
          <SelectItem key="REGEX">
            REGEX
          </SelectItem>
        </Select>
        <Select
          label="Active"
          labelPlacement="outside"
          onSelectionChange={(value) =>
            setCondition(Object.assign({}, condition, { active: value.values().next().value?.length ? Boolean(value.values().next().value) : "" }))}
          className="min-w-[120px]"
        >
          <SelectItem key="">
            ALL
          </SelectItem>
          <SelectItem key={true}>
            ACTIVE
          </SelectItem>
          <SelectItem key={false}>
            INACTIVE
          </SelectItem>
        </Select>
        {/* <div className="items-end flex min-h-full">
          <Button onClick={getRedirects} color="primary"><Search /></Button>
        </div> */}
      </div>
      <div className="flex flex-col gap-2">
        <div className="border-default-200">
          <Table
            aria-label="Tất cả redirect"
            bottomContent={
              loadingState === "loading" ? null :
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
            }>
            <TableHeader>
              <TableColumn key="source" textValue="from">From</TableColumn>
              <TableColumn key="destination" textValue="to">To</TableColumn>
              <TableColumn key="redirectType" textValue="redirectType">Loại</TableColumn>
              <TableColumn key="active" textValue="active">Active</TableColumn>
              <TableColumn key="actions" textValue="actions"></TableColumn>
            </TableHeader>
            <TableBody
              items={filteredRedirects}
              isLoading={loadingState === 'loading'}
              emptyContent={"Không có redirect nào"}
              loadingState={loadingState}
              loadingContent={<Spinner label="Loading..." />}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center ml-auto my-4">
          {/* <Link href="/admin/redirect/edit/new">Thêm redirect</Link> */}
          <Button color="default" variant="ghost" className="min-w-[110px] mr-3" onClick={() => addNewRedirect()}>Thêm</Button>
          <Button color="primary" className="min-w-[110px]" onClick={() => onSave()}>Lưu</Button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default RedirectList;
