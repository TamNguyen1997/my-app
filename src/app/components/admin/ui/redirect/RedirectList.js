"use client"

import {
  Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input,
  Pagination, Select, SelectItem,
  Switch,
} from "@heroui/react";
import { Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ToastContainer, toast } from 'react-toastify';

import { v4 } from "uuid";

const RedirectList = () => {
  const [redirects, setRedirects] = useState([])
  const [condition, setCondition] = useState({})
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  const formatRedirectList = (src) => {
    if (!src || !src.length) return [];

    return src.map(item => ({
      id: v4(),
      ...item
    }));
  }

  const formatRedirectObject = (src) => {
    if (!src?.length) return {};
    return src.reduce((acc, item) => {
      let { id, source, ...value } = item;
      acc[item.source] = { ...value, source: source };
      return acc;
    }, {});
  }

  const getRedirects = async () => {
    setIsLoading(true)
    let filteredCondition = { ...condition }
    Object.keys(filteredCondition).forEach(key => filteredCondition[key] === undefined && delete filteredCondition[key])
    const queryString = new URLSearchParams(filteredCondition).toString()
    await fetch(`/api/redirects/?size=${rowsPerPage}&page=${page}&${queryString}`).then(async res => {
      const data = await res.json()
      setRedirects(formatRedirectList(data.redirects));
      setTotal(data.total || 0)
    })
    setIsLoading(false)
  }

  useEffect(() => {
    getRedirects()
  }, [page, rowsPerPage]);

  const deleteRedirect = (id) => {
    setRedirects(redirects?.filter(redirect => redirect.id !== id));
  }

  const onCellValueChange = (redirectId, value) => {
    let redirectsToUpdate = redirects.map(redirect => redirect.id === redirectId ? { ...redirect, ...value } : redirect);
    setRedirects(redirectsToUpdate);
  }

  const addNewRedirect = () => {
    setRedirects([
      ...redirects,
      {
        id: v4(),
        source: "",
        destination: "",
        permanent: true,
        redirectType: "EXACT"
      }
    ])
  }

  const onSave = async () => {
    const dataToUpdate = formatRedirectObject(redirects);
    const res = await fetch(`/api/redirects`, { method: "PUT", body: JSON.stringify(dataToUpdate) });
    if (res.ok) {
      toast.success("Đã cập nhật");
      getRedirects();
    } else {
      toast.error("Không thể cập nhật");
    }
  }

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
          label="Redirect code"
          labelPlacement="outside"
          defaultSelectedKeys={[""]}
          onSelectionChange={(value) =>
            setCondition(Object.assign({}, condition, { permanent: value.values().next().value?.length ? Boolean(value.values().next().value) : "" }))}
        >
          <SelectItem key="">
            ALL
          </SelectItem>
          <SelectItem key="true">
            301
          </SelectItem>
          <SelectItem key="false">
            302
          </SelectItem>
        </Select>
        <Select
          label="Loại"
          labelPlacement="outside"
          defaultSelectedKeys={[""]}
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
          defaultSelectedKeys={[""]}
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
        <div className="items-end flex min-h-full gap-2">
          <Button onClick={getRedirects} color="primary">
            <Search />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="border rounded-lg p-3 border-default-200">
          {!isLoading && redirects.map(redirect => (
            <div className="flex gap-2 py-2" key={redirect.id}>
              <Input
                aria-label="From"
                label="From"
                defaultValue={redirect.source}
                onValueChange={(value) => onCellValueChange(redirect.id, { source: value })}
              />
              <Input
                aria-label="To"
                label="To"
                defaultValue={redirect.destination}
                onValueChange={(value) => onCellValueChange(redirect.id, { destination: value })}
              />
              <Select
                label="Loại"
                defaultSelectedKeys={[redirect.redirectType]}
                onSelectionChange={(value) =>
                  onCellValueChange(redirect.id, { redirectType: value.values().next().value })}
              >
                <SelectItem key="EXACT">
                  EXACT
                </SelectItem>
                <SelectItem key="REGEX">
                  REGEX
                </SelectItem>
              </Select>
              <Select
                label="Redirect code"
                defaultSelectedKeys={[redirect.permanent.toString()]}
                onSelectionChange={(value) =>
                  onCellValueChange(redirect.id, { permanent: Boolean(value.values().next().value) })}
              >
                <SelectItem key="true">
                  301
                </SelectItem>
                <SelectItem key="false">
                  302
                </SelectItem>
              </Select>
              <div className="relative flex items-center">
                <Switch
                  defaultSelected={redirect.active}
                  onValueChange={(value) => onCellValueChange(redirect.id, { active: value })}
                ></Switch>
              </div>
              <div className="relative flex items-center">
                <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
                  <Trash2 onClick={() => { deleteRedirect(redirect.id) }} />
                </span>
              </div>
            </div>
          ))}
          <div className="w-full flex">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                >
                  {rowsPerPage}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) => setRowsPerPage(key)}
              >
                <DropdownItem key="10">10</DropdownItem>
                <DropdownItem key="20">20</DropdownItem>
                <DropdownItem key="50">50</DropdownItem>
                <DropdownItem key="100">100</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Pagination className="flex w-full justify-center" isCompact
              showControls
              showShadow
              page={page}
              total={pages}
              onChange={(page) => setPage(page)} />
          </div>
        </div>
        <div className="flex items-center ml-auto my-4">
          <Button color="default" variant="ghost" className="min-w-[110px] mr-3" onClick={() => addNewRedirect()}>Thêm</Button>
          <Button color="primary" className="min-w-[110px]" onClick={() => onSave()}>Lưu</Button>
        </div>
      </div>

      <ToastContainer containerId="RedirectList" />
    </div>
  );
};

export default RedirectList;
