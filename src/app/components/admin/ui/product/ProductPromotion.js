import RichTextEditor from "../RichTextArea"
import { editorConfig } from "@/lib/editor"
import { Button } from "@nextui-org/react";
import { useEditor } from "@tiptap/react";
import { toast, ToastContainer } from "react-toastify";

const ProductDescription = ({ product }) => {

  const editor = useEditor(editorConfig(product.promotion))

  return (
    <>
      <RichTextEditor editor={editor} />
      <div className="pt-3">
        <Button color="primary" onClick={onSave} className="w-24 float-right">Lưu</Button>
      </div>
    </>
  )
}

export default ProductDescription