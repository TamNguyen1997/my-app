import { EditorContent } from '@tiptap/react';
import ImagePicker from "@/components/admin/ui/ImagePicker";
import './Tiptap.css'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useState } from 'react';

import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiCodeSSlashLine,
  RiH1,
  RiH2,
  RiListOrdered,
  RiListUnordered,
  RiLink,
  RiImage2Fill,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiAlignJustify,
  RiUnderline,
  RiH3,
  RiH4,
  RiTextWrap,
  RiSubscript2,
  RiSuperscript2,
  RiTable3
} from 'react-icons/ri'
import { LucideHighlighter, Pipette, TableCellsMerge, TableCellsSplit } from 'lucide-react';

import { TbColumnRemove, TbColumnInsertLeft, TbRowRemove, TbRowInsertBottom } from "react-icons/tb";

const RichTextEditor = ({ editor }) => {

  return (
    <div >
      <BlogToolBar editor={editor} />
      <div className="h-full w-full shadow-md min-h-44 p-3 border">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

const TEXT_COLOR = {
  "#000000": "bg-[#000000]",
  "#FFFFFF": "bg-[#FFFFFF]",
  "#CCCCCC": "bg-[#CCCCCC]",
  "#33FF33": "bg-[#33FF33]",
  "#009900": "bg-[#009900]",
  "#DC143C": "bg-[#DC143C]",
  "#F88379": "bg-[#F88379]",
  "#66B2FF": "bg-[#66B2FF]",
  "#0066CC": "bg-[#0066CC]",
  "#FFBF00": "bg-[#FFBF00]",
}

const BlogToolBar = ({ editor }) => {
  const iconClassName = "border w-6 h-6 justify-items-center items-center"
  const imageModal = useDisclosure();
  const colorModal = useDisclosure();
  const linkModal = useDisclosure();
  const tableModal = useDisclosure();
  const [hyperlink, setHyperlink] = useState('')

  const [selectedTextColor, setSelectedTextColor] = useState('#000000')
  const [color, setColor] = useColor('#000000');

  const [showColorPick, setShowColorPick] = useState(false)

  if (!editor) {
    return <></>
  }

  const setTextColor = (value) => {
    setSelectedTextColor(value)
    editor.chain().focus().setColor(value).run()
  }

  const insertLink = () => {
    if (!hyperlink) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: hyperlink }).run()
  }

  return (
    <div className="p-3 flex flex-col gap-1">
      <div className="flex w-1/2 flex-wrap">
        <div className={`${iconClassName} ${editor.isActive('bold') ? "opacity-25" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}>
          <RiBold className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('italic') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}>
          <RiItalic className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('strike') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}>
          <RiStrikethrough className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('underline') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().setUnderline().run()}>
          <RiUnderline className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('code') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleCode().run()}>
          <RiCodeSSlashLine className="w-full h-full" />
        </div>
        <div className="pr-5"></div>
        <div className={`${iconClassName} ${editor.isActive('heading', { level: 1 }) ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <RiH1 className="w-full h-full" />
        </div>

        <div className={`${iconClassName} ${editor.isActive('heading', { level: 2 }) ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <RiH2 className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('heading', { level: 3 }) ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <RiH3 className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('heading', { level: 4 }) ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
          <RiH4 className="w-full h-full" />
        </div>
        <div className="pr-5"></div>
        <div className={`${iconClassName} ${editor.isActive('orderedList') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <RiListOrdered className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('bulletList') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <RiListUnordered className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive({ textAlign: 'left' }) ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <RiAlignLeft className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive({ textAlign: 'center' }) ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <RiAlignCenter className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive({ textAlign: 'right' }) ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <RiAlignRight className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive({ textAlign: 'justify' }) ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
          <RiAlignJustify className="w-full h-full" />
        </div>
        <div className="pr-5"></div>
        <div className={iconClassName}
          onClick={imageModal.onOpen}>
          <RiImage2Fill className="w-full h-full" />
        </div>
        <div className={iconClassName} onClick={linkModal.onOpen}>
          <RiLink className="w-full h-full" />
        </div>

        <div className="pr-5"></div>
        <div className={iconClassName}
          onClick={() => editor.chain().focus().setHardBreak().run()}>
          <RiTextWrap className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('highlight') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleHighlight().run()}>
          <LucideHighlighter className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('subscript') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleSubscript().run()}>
          <RiSubscript2 className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('superscript') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}>
          <RiSuperscript2 className="w-full h-full" />
        </div>
      </div>
      <div className='flex'>
        <div className={`border w-10 rounded-large h-6`} style={{
          background: selectedTextColor
        }}></div>
        <div className={`${iconClassName} ${editor.isActive('italic') ? "opacity-25" : ""}`}
          onClick={() => setShowColorPick(!showColorPick)} data-dropdown-toggle="dropdown">
          <Pipette />
          {
            showColorPick ? <div className="w-28 divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 absolute z-10" id="dropdown">
              <ul className="py-2 text-sm flex flex-col gap-4 text-center items-center m-auto" aria-labelledby="dropdownDefaultButton">
                <div className='items-center text-center m-auto'>
                  <div className='flex flex-wrap pl-[6px]'>

                    {
                      Object.keys(TEXT_COLOR).map(key => {
                        return (
                          <div
                            className={`w-5 h-5 border-2 hover:opacity-25`}
                            style={{
                              background: key
                            }}
                            key={key}
                            onClick={() => {
                              setTextColor(key)
                            }}
                          >
                          </div>
                        )
                      })
                    }

                  </div>
                </div>
                <div className='text-center items-center'>
                  <button onClick={() => colorModal.onOpen()} className='border-3 rounded-md '>Chọn màu</button>
                </div>
              </ul>
            </div> : ""
          }

        </div>

        <div className="pr-5"></div>
        <div className={`${iconClassName} ${editor.isActive('italic') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
          <RiTable3 className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('italic') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().deleteTable().run()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grid-2x2-x"><path d="M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3" /><path d="m16 16 5 5" /><path d="m16 21 5-5" /></svg>
        </div>
        <div className={`${iconClassName} ${editor.isActive('italic') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().deleteColumn().run()}>
          <TbColumnRemove className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('italic') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().addColumnAfter().run()}>
          <TbColumnInsertLeft className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('italic') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().addRowBefore().run()}>
          <TbRowInsertBottom className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('italic') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().deleteRow().run()}>
          <TbRowRemove className="w-full h-full" />
        </div>

        <div className={`${iconClassName} ${editor.isActive('italic') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().mergeCells().run()}>
          <TableCellsMerge className="w-full h-full" />
        </div>
        <div className={`${iconClassName} ${editor.isActive('italic') ? "opacity-25" : ""}`}
          onClick={() => editor.chain().focus().splitCell().run()}>
          <TableCellsSplit className="w-full h-full" />
        </div>
      </div>
      <div className="w-1/4"></div>
      <Modal isOpen={imageModal.isOpen} onOpenChange={imageModal.onOpenChange} size="5xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chèn hình</ModalHeader>
              <ModalBody>
                <ImagePicker disableAdd onImageClick={(image) => {
                  editor.chain().focus().setImage({ src: image.path }).run()
                  onClose()
                }} disableDelete></ImagePicker>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={linkModal.isOpen} onOpenChange={linkModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chèn hình ảnh</ModalHeader>
              <ModalBody>
                <Input label="Link" aria-label="Link" defaultValue={editor.getAttributes('link').href} onValueChange={setHyperlink}></Input>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button color="primary" onPress={() => {
                  insertLink()
                  onClose()
                }}>
                  Lưu
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={colorModal.isOpen} onOpenChange={colorModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chọn màu</ModalHeader>
              <ModalBody>
                <ColorPicker width={456} height={228} color={color}
                  onChange={setColor} hideHSV dark />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button color="primary" onPress={() => {
                  setSelectedTextColor(color.hex)
                  editor.chain().focus().setColor(color.hex).run()
                  onClose()
                }}>
                  Chọn
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={tableModal.isOpen} onOpenChange={tableModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chọn màu</ModalHeader>
              <ModalBody>
                <ColorPicker width={456} height={228} color={color}
                  onChange={setColor} hideHSV dark />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button color="primary" onPress={() => {
                  setSelectedTextColor(color.hex)
                  editor.chain().focus().setColor(color.hex).run()
                  onClose()
                }}>
                  Chọn
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default RichTextEditor;