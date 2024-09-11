import { Button, Select, SelectItem } from "@nextui-org/react"
import { Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { v4 } from "uuid"

const TechnicalDetails = ({ product }) => {
  const [technicalDetails, setTechnicalDetails] = useState([])

  const [filters, setFilters] = useState([])

  useEffect(() => {
    fetch(`/api/products/${product.id}/technical-details`).then(res => res.json()).then(setTechnicalDetails)
    fetch(`/api/filters/`).then(res => res.json()).then(json => setFilters(json.result))
  }, [product])

  const addDetail = () => {
    const detail = {
      id: v4(),
      productId: product.id
    }
    setTechnicalDetails([...technicalDetails, detail])
  }

  console.log(technicalDetails)

  const onSave = async () => {
    const res = await fetch(`/api/products/${product.id}/technical-details`, {
      method: "POST",
      body: JSON.stringify({
        details: technicalDetails
      })
    })

    if (res.ok) {
      toast.success("Đã lưu thông số kĩ thuật")
    } else {
      toast.error("Không thể lưu thông số kĩ thuật")
    }
  }

  const onSelectionChange = (value, technicalId) => {
    let updateDetails = [...technicalDetails]
    updateDetails.forEach(detail => {
      if (detail.id === technicalId) {
        detail = Object.assign(detail, value)
      }
    })
    setTechnicalDetails([...updateDetails])
  }

  const deleteDetail = (id) => {
    setTechnicalDetails(technicalDetails.filter(item => item.id !== id))
  }

  return (
    <>
      <ToastContainer />
      <div>
        <Button color="default" variant="ghost" size="sm" className="float-right" onPress={addDetail}> Thêm thông số </Button>
      </div>
      <div>
        {
          technicalDetails.map((item, i) => <div className="flex gap-2" key={i}>
            <Select labelPlacement="outside" label="Filter"
              defaultSelectedKeys={[item.filterId]}
              onSelectionChange={(value) => onSelectionChange({ filterId: value.values().next().value }, item.id)}>
              {
                filters.map(item => <SelectItem key={item.id}>{item.name}</SelectItem>)
              }
            </Select>
            <FilterValueSelect
              technicalDetail={item} getFilter={() =>
                filters.find(filter => filter.id === technicalDetails.find(detail => detail.id === item.id).filterId)
              }
              onSelectionChange={onSelectionChange} />
            <div className="relative flex items-center pt-5">
              <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
                <Trash2 onClick={() => deleteDetail(item.id)} />
              </span>
            </div>
          </div>
          )
        }
        <div className="pt-3">
          <Button color="primary" onClick={onSave} className="w-24 float-right">Lưu</Button>
        </div>
      </div>
    </>
  )
}

const FilterValueSelect = ({ technicalDetail, getFilter, onSelectionChange }) => {

  const filterValues = getFilter()?.filterValue || []

  return (
    <Select labelPlacement="outside" label="Giá trị filter" isDisabled={!filterValues.length}
      defaultSelectedKeys={[technicalDetail.filterValueId]}
      onSelectionChange={value => onSelectionChange({ filterValueId: value.values().next().value }, technicalDetail.id)}>
      {
        filterValues.map(item => <SelectItem key={item.id}>{item.value}</SelectItem>)
      }
    </Select>
  )
}

export default TechnicalDetails