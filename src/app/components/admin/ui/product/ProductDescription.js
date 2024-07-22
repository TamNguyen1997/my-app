import RichTextEditor from "../RichTextArea"
import { editorConfig } from "@/lib/editor"
import { Button } from "@nextui-org/react";
import { useEditor } from "@tiptap/react";
import { toast, ToastContainer } from "react-toastify";

const ProductDescription = ({ product }) => {

  const editor = useEditor(editorConfig(product.description))

  const onSave = async () => {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT", body: JSON.stringify({
        description: editor.getHTML()
      })
    })

    if (res.ok) {
      toast.success("Đã lưu")
    } else {
      toast.error("Không thể lưu")
    }
  }

  return (
    <>
      <ToastContainer />
      <RichTextEditor editor={editor} />
      <div>
        <Button color="primary" onClick={onSave} className="w-24 float-right">Lưu</Button>
      </div>
    </>
  )
}

export default ProductDescription