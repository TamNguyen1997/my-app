import BlogForm from "@/components/admin/ui/BlogForm"
import { Tabs, Tab, Table, TableHeader, TableColumn, TableRow, TableCell, TableBody } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { EditIcon, Trash2 } from "lucide-react";

const BlogCms = () => {

  const [blogs, setBlogs] = useState([])

  const [selectedTab, setSelectedTab] = useState("Tất cả blog")
  const [selectedBlog, setSelectedBlog] = useState({})

  useEffect(() => {
    fetch("/api/blogs").then(res => res.json()).then(setBlogs)
  }, [])

  const deleteBlog = (id) => {
    fetch(`/api/blogs/${id}`, { method: "DELETE" }).then(res => res.json()).then(setBlogs)
  }

  const renderCell = useCallback((blog, columnKey) => {
    const cellValue = blog[columnKey];
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon onClick={() => {
                setSelectedBlog(blog)
                setSelectedTab("Thêm blog")
              }} />
            </span>
            <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
              <Trash2 onClick={() => deleteBlog(blog.id)} />
            </span>
          </div>
        );
      default:
        return cellValue;
    }
  }, [])

  return (<>
    <Tabs aria-label="Blogs" selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
      <Tab key="Tất cả blog" title="Tất cả blog">
        <Table aria-label="Blog">
          <TableHeader>
            <TableColumn key="title">Tiêu đề</TableColumn>
            <TableColumn key="actions"></TableColumn>
          </TableHeader>
          <TableBody emptyContent={"Không có bài viết nào"}>
            {
              blogs.map(blog => {
                return <TableRow key={blog.id}>
                  {(columnKey) => <TableCell>{renderCell(blog, columnKey)}</TableCell>}
                </TableRow>
              })
            }
          </TableBody>
        </Table>
      </Tab>
      <Tab key="Thêm blog" title="Thêm blog">
        <BlogForm blog={selectedBlog}></BlogForm>
      </Tab>
    </Tabs>
  </>)
}

export default BlogCms