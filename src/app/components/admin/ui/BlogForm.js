import { useEditor } from "@tiptap/react";
import ImageCms from "@/components/admin/ui/ImageCms";
import {
  Button,
  DatePicker,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import RichTextEditor from "./RichTextArea";

import { parseDate } from "@internationalized/date";
import slugify from "slugify";
import crypto from "crypto";

import { editorConfig } from "@/lib/editor";
import { BLOG_CATEGORIES, BLOG_SUB_CATEGORIES } from "@/lib/blog";
import { toast, ToastContainer } from "react-toastify";

const BlogForm = ({ blog, setBlog }) => {
  const { register, handleSubmit } = useForm();

  const [isSelected, setIsSelected] = useState(blog?.active);

  const editor = useEditor(editorConfig(blog.content));

  const onSubmit = async (data) => {
    if (!blog.id && !blog.slug) {
      blog.slug = `${slugify(blog.title, {
        locale: "vi",
      }).toLowerCase()}-${crypto.randomBytes(6).toString("hex")}`;
    }
    if (blog.slug) {
      blog.slug = `${slugify(blog.slug, { locale: "vi" })}`;
    }

<<<<<<< HEAD
=======
    console.log(editor.getHTML());
>>>>>>> 9212c4fc2852a9fa0d6d80e1b8fb768198238436
    const body = Object.assign(blog, data, {
      thumbnail: thumbnail,
      content: editor.getHTML(),
      active: isSelected,
    });
    const res = await fetch("/api/blogs", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return;
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [thumbnail, setThumbnail] = useState(blog?.thumbnail);
  const selectedImage = (value) => {
    blog.thumbnail = value.path;
    setThumbnail(value.path);
    onOpenChange();
  };

  const loadDraft = () => {
    editor.commands.setContent(blog.draft);
  };

  const loadContent = () => {
    editor.commands.setContent(blog.content);
  };

  const saveDraft = async () => {
    if (!blog.id) {
      toast.error("Phải lưu blog trước");
    } else {
      const res = await fetch(`/api/blogs/${blog.id}/draft`, {
        method: "PUT",
        body: JSON.stringify({ draft: editor.getHTML() }),
      });
      if (res.ok) {
        toast.success("Đã lưu bản nháp");
      } else {
        toast.error("Không thể lưu bản nháp");
      }
    }
  };

  return (
    <div className="p-3">
      <ToastContainer />
      {editor && <RichTextEditor editor={editor} />}
      <div className="pt-3 pr-3">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex gap-3">
            <Input
              label="Tiêu đề"
              aria-label="Tiêu đề"
              value={blog?.title}
              onValueChange={(value) =>
                setBlog(Object.assign({}, blog, { title: value }))
              }
            ></Input>
            <Input
              label="Slug"
              aria-label="Slug"
              value={blog?.slug}
              onValueChange={(value) =>
                setBlog(Object.assign({}, blog, { slug: value }))
              }
            ></Input>
            <div className="items-end flex min-h-full">
              <Button
                onClick={() => {
                  console.log(blog.title);
                  setBlog(
                    Object.assign({}, blog, {
                      slug: `${slugify(blog.title, {
                        locale: "vi",
                      }).toLowerCase()}-${crypto
                        .randomBytes(6)
                        .toString("hex")}`,
                    })
                  );
                }}
                color="primary"
              >
                Thêm slug
              </Button>
            </div>
          </div>
          <div className="flex gap-3">
            <Input
              label="Meta title"
              aria-label="Meta title"
              {...register("metaTitle")}
              defaultValue={blog?.metaDescription}
            ></Input>
            <Input
              label="Meta description"
              aria-label="Meta description"
              {...register("metaDescription")}
              defaultValue={blog?.metaDescription}
            ></Input>
          </div>
          <div>
            <Textarea
              label="Tóm tắt"
              aria-label="Tóm tắt"
              {...register("summary")}
              defaultValue={blog?.summary}
            ></Textarea>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <Input
                  label="Thumbnail"
                  aria-label="Thumbnail"
                  {...register("thumbnail")}
                  value={blog?.thumbnail}
                  disabled
                ></Input>
                <div className="pt-2">
                  <Button onClick={onOpen} className="">
                    Chọn ảnh
                  </Button>
                </div>
              </div>
              <Input
                label="Alt bài viết"
                aria-label="Thumbnail"
                {...register("altThumb")}
                defaultValue={blog?.altThumb}
              ></Input>
              <Input
                label="Keyword"
                aria-label="Keyword"
                {...register("keyword")}
                defaultValue={blog?.keyword}
              ></Input>
              <Input
                label="Tác giả"
                aria-label="Keyword"
                {...register("author")}
                defaultValue={blog?.author}
              ></Input>
              <Select
                label="Phân loại"
                selectedKeys={new Set([blog.blogCategory])}
                onSelectionChange={(value) =>
                  setBlog(
                    Object.assign({}, blog, {
                      blogCategory: value.values().next().value,
                    })
                  )
                }
              >
                {BLOG_CATEGORIES.map((category) => (
                  <SelectItem key={category.id}>{category.value}</SelectItem>
                ))}
              </Select>
              <Select
                label="Sub Category"
                selectedKeys={new Set([blog.blogSubCategory])}
                onSelectionChange={(value) =>
                  setBlog(
                    Object.assign({}, blog, {
                      blogSubCategory: value.values().next().value,
                    })
                  )
                }
              >
                {BLOG_SUB_CATEGORIES.map((subcate) => (
                  <SelectItem key={subcate.id}>{subcate.value}</SelectItem>
                ))}
              </Select>
              <div className="flex gap-3">
                <DatePicker
                  label="Ngày publish"
                  onChange={(value) =>
                    setBlog(
                      Object.assign({}, blog, {
                        activeFrom: new Date(value.toString()),
                      })
                    )
                  }
                  defaultValue={
                    blog.activeFrom ? getDateString(blog.activeFrom) : ""
                  }
                  aria-label="Ngày publish"
                ></DatePicker>
                <Switch
                  isSelected={isSelected}
                  onValueChange={setIsSelected}
                ></Switch>
              </div>
              <div>
                <Link href={`/admin/blog/`} className="pt-2">
                  Trở về
                </Link>
                <Link href="#" onClick={saveDraft} className="pl-4">
                  Lưu bản nháp
                </Link>
                <Link href="#" onClick={loadDraft} className="pl-4">
                  Load bản nháp
                </Link>
                <Link href="#" onClick={loadContent} className="pl-4">
                  Load bản chính
                </Link>
                <div className="float-right flex gap-3">
                  <Link href={`/admin/blog/preview/${blog.slug}`} isExternal>
                    Preview
                  </Link>
                  <Button
                    type="submit"
                    href={`/admin/blog/edit/${blog.slug}`}
                    color="primary"
                  >
                    Lưu
                  </Button>
                </div>
              </div>
            </div>
            <div>
              {blog?.thumbnail ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_FILE_PATH + blog.thumbnail}`}
                  width="300"
                  height="300"
                  alt="Thumbnail image"
                />
              ) : null}
            </div>
          </div>
        </form>
      </div>
      <Modal
        size="full"
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Chọn hình ảnh
              </ModalHeader>
              <ModalBody>
                <ImageCms
                  disableAdd={true}
                  onImageClick={selectedImage}
                  disableDelete={true}
                />
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
    </div>
  );
};

const getDateString = (isoDate) =>
  parseDate(new Date(isoDate).toISOString().split("T")[0]);

export default BlogForm;
