import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { useState } from "react";
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
  RiImage2Fill
} from 'react-icons/ri'

export default ({ editor }) => {
  const iconClassName = "border w-6 h-6 justify-items-center items-center"
  const imageModal = useDisclosure();
  const linkModal = useDisclosure();
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [hyperlink, setHyperlink] = useState('')
  if (!editor) {
    return <></>
  }
  const insertImage = () => {
    editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run()
  }
  const insertLink = () => {
    if (!hyperlink) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: hyperlink }).run()
  }
  return (
    <div className="flex p-3">
      <div className="w-1/4"></div>
      <div className="flex w-1/2">
        <div className={iconClassName} style={{backgroundColor : editor.isActive('bold') ? 'white' : '9ca3af'}}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}>
          <RiBold className="w-full h-full" />
        </div>
        <div className={iconClassName} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <RiItalic className="w-full h-full" />
        </div>
        <div className={iconClassName} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <RiStrikethrough className="w-full h-full" />
        </div>
        <div className={iconClassName} onClick={() => editor.chain().focus().toggleCode().run()}>
          <RiCodeSSlashLine className="w-full h-full" />
        </div>
        <div className="pr-5"></div>
        <div className={iconClassName}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <RiH1 className="w-full h-full" />
        </div>
        <div className={iconClassName}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <RiH2 className="w-full h-full" />
        </div>
        <div className="pr-5"></div>
        <div className={iconClassName}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <RiListOrdered className="w-full h-full" />
        </div>
        <div className={iconClassName}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <RiListUnordered className="w-full h-full" />
        </div>
        <div className={iconClassName}
          onClick={imageModal.onOpen}>
          <RiImage2Fill className="w-full h-full" />
        </div>
        <div className={iconClassName} onClick={linkModal.onOpen}>
          <RiLink className="w-full h-full" />
        </div>
      </div>
      <div className="w-1/4"></div>
      <Modal isOpen={imageModal.isOpen} onOpenChange={imageModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chèn hình ảnh</ModalHeader>
              <ModalBody>
                <Input label="URL hình" aria-label="URL hình" defaultValue={imageUrl} onValueChange={setImageUrl}></Input>
                <Input label="Alt hình" aria-label="Alt hình" defaultValue={imageAlt} onValueChange={setImageAlt}></Input>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button color="primary" onPress={() => {
                  insertImage()
                  onClose()
                }}>
                  Lưu
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
    </div>
  )
}