import BlogForm from "@/components/admin/ui/BlogForm"
import { Tabs, Tab, Table, TableHeader, TableColumn, TableRow, TableCell, TableBody, Spinner, Pagination } from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EditIcon, Trash2 } from "lucide-react";

const rowsPerPage = 20;
const BlogCms = () => {
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState([])
  const [loadingState, setLoadingState] = useState("loading")

  const [selectedTab, setSelectedTab] = useState("Tất cả blog")
  const [selectedBlog, setSelectedBlog] = useState({})
  const [total, setTotal] = useState(0)

  useEffect(() => {
    getBlogs()
  }, [page])

  const getBlogs = async () => {
    setLoadingState("loading")
    const json = await fetch(`/api/blogs?excludeSupport=true&size=${rowsPerPage}&page=${page}`).then(res => res.json())
    setTotal(json.total)
    setBlogs(json.result)
    setLoadingState("idle")
  }
  const deleteBlog = (id) => {
    fetch(`/api/blogs/${id}`, { method: "DELETE" }).then(() => getBlogs())
  }

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

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
        <Table aria-label="Blog"
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
            <TableColumn key="title">Tiêu đề</TableColumn>
            <TableColumn key="slug">Slug</TableColumn>
            <TableColumn key="actions"></TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={"Không có bài viết nào"}
            isLoading={loadingState === "loading"}
            loadingContent={<Spinner label="Loading..." />}>
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
        <BlogForm blog={selectedBlog} setBlog={setSelectedBlog}></BlogForm>
      </Tab>
    </Tabs>
  </>)
}

export default BlogCms