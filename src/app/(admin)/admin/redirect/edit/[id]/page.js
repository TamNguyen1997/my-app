"use client"

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Button,
  Input,
  Select,
  SelectItem
} from "@nextui-org/react"
import { useParams } from "next/navigation";

const RedirectEdit = () => {
  const [redirect, setRedirect] = useState({})

  const { id } = useParams()
  useEffect(() => {
    if (id && id !== 'new') {
      fetch(`/api/redirects/${id}`).then(res => res.json()).then(setRedirect)
    }
  }, [id])

  const onSave = async () => {
    const res = redirect.id ?
      await fetch(`/api/redirects/${redirect.id}`, { method: "PUT", body: JSON.stringify(redirect) }) :
      await fetch('/api/redirects', { method: "POST", body: JSON.stringify(redirect) })
    if (res.ok) {
      toast.success("Đã lưu redirect")
      if (id === "new") {
        window.location.replace(`/admin/redirect/edit/${(await res.json()).id}`)
      }
    } else {
      toast.error("Không thể lưu redirect")
    }
  }

  if (id !== "new" && !redirect.id) return <></>
  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-3">
        <Input
          type="text"
          label="ID"
          value={redirect.id}
          onValueChange={(value) => setRedirect(Object.assign({}, redirect, { id: value }))}
          labelPlacement="outside" />
        <Input
          type="text"
          label="From"
          value={redirect.from}
          onValueChange={(value) => setRedirect(Object.assign({}, redirect, { from: value }))}
          labelPlacement="outside" isRequired />
        <Input
          type="text"
          label="To"
          value={redirect.to}
          onValueChange={(value) => setRedirect(Object.assign({}, redirect, { to: value }))}
          labelPlacement="outside" isRequired />
        <Select
          label="Loại redirect"
          labelPlacement="outside"
          selectedKeys={new Set([redirect.redirectType || "EXACT"])}
          onSelectionChange={(value) =>
            setRedirect(Object.assign({}, redirect, { redirectType: value.values().next().value }))}
        >
          <SelectItem key="EXACT">
            EXACT
          </SelectItem>
          <SelectItem key="REGEX">
            REGEX
          </SelectItem>
        </Select>
        <div className="items-end flex min-h-full">
          <Button onClick={onSave} color="primary">Lưu</Button>
        </div>
      </div>
    </>
  )
}

export default RedirectEdit