import {
  Table,
  TableHeader,
  TableColumn,
  TableRow,
  TableCell,
  TableBody,
  Spinner,
  Pagination,
  Link,
  Input,
  Select,
  SelectItem,
  Button,
  Tooltip,
  Switch,
} from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EditIcon, Plus, Search, Trash2 } from "lucide-react";

import { BLOG_CATEGORIES, BLOG_SUB_CATEGORIES } from "@/lib/blog";

const rowsPerPage = 20;
const BlogCms = () => {
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [loadingState, setLoadingState] = useState("loading");
  const [condition, setCondition] = useState({});

  const [total, setTotal] = useState(0);

  useEffect(() => {
    getBlogs();
  }, [page]);

  const getBlogs = async () => {
    setLoadingState("loading");
    let filteredCondition = { ...condition };
    Object.keys(filteredCondition).forEach(
      (key) =>
        filteredCondition[key] === undefined && delete filteredCondition[key]
    );
    const queryString = new URLSearchParams(filteredCondition).toString();

    const json = await fetch(
      `/api/blogs?excludeSupport=true&size=${rowsPerPage}&page=${page}&${queryString}`
    ).then((res) => res.json());
    setTotal(json.total);
    setBlogs(json.result);
    setLoadingState("idle");
  };
  const deleteBlog = (id) => {
    fetch(`/api/blogs/${id}`, { method: "DELETE" }).then(() => getBlogs());
  };

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  const renderCell = useCallback((blog, columnKey) => {
    const cellValue = blog[columnKey];
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Link href={`/admin/blog/edit/${blog.slug}`}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Link>
            <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
              <Trash2 onClick={() => deleteBlog(blog.id)} />
            </span>
          </div>
        );
      case "cate":
        return BLOG_CATEGORIES.find((item) => item.id === blog.blogCategory)
          ?.value;
      case "subcate":
        return BLOG_SUB_CATEGORIES.find(
          (item) => item.id === blog.blogSubCategory
        )?.value;
      default:
        return cellValue;
    }
  }, []);

  const onConditionChange = (value) => {
    setCondition(Object.assign({}, condition, value));
  };

  console.log(condition);
  return (
    <>
      <div className="flex gap-3 pb-3">
        <Input
          label="Slug"
          aria-label="slug"
          labelPlacement="outside"
          value={condition.slug}
          onValueChange={(value) => {
            onConditionChange({ slug: value });
            if (value.length > 2) getBlogs();
          }}
        />

        <Select
          label="Category"
          labelPlacement="outside"
          onSelectionChange={(value) =>
            onConditionChange({ blogCategory: value.values().next().value })
          }
        >
          {BLOG_CATEGORIES.map((category) => (
            <SelectItem key={category.id}>{category.value}</SelectItem>
          ))}
        </Select>
        <Select
          label="Sub-category"
          labelPlacement="outside"
          onSelectionChange={(value) =>
            onConditionChange({ blogSubCategory: value.values().next().value })
          }
        >
          {BLOG_SUB_CATEGORIES.map((subcate) => (
            <SelectItem key={subcate.id}>{subcate.value}</SelectItem>
          ))}
        </Select>

        <Switch
          className="pt-6"
          isSelected={condition.active}
          onValueChange={(value) => onConditionChange({ active: value })}
        >
          {condition.active ? "Active" : "Inactive"}
        </Switch>

        <div className="items-end flex min-h-full gap-3">
          <Tooltip showArrow content="Tìm">
            <Button onClick={getBlogs} color="primary">
              <Search />
            </Button>
          </Tooltip>
          <Tooltip showArrow content="Thêm blog">
            <Button color="primary">
              <Link href="/admin/blog/edit/new" className="text-white">
                <Plus />
              </Link>
            </Button>
          </Tooltip>
        </div>
      </div>

      <Table
        aria-label="Blog"
        bottomContent={
          loadingState === "loading" ? null : (
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
          )
        }
      >
        <TableHeader>
          <TableColumn key="title">Tiêu đề</TableColumn>
          <TableColumn key="slug">Slug</TableColumn>
          <TableColumn key="cate">Category</TableColumn>
          <TableColumn key="subcate">Sub-category</TableColumn>
          <TableColumn key="actions"></TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={"Không có bài viết nào"}
          isLoading={loadingState === "loading"}
          loadingContent={<Spinner label="Loading..." />}
        >
          {blogs.map((blog) => {
            return (
              <TableRow key={blog.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(blog, columnKey)}</TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default BlogCms;
