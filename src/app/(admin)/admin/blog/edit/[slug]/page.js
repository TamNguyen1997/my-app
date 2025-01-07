import EditBlog from "./EditBlog"

export async function generateMetadata() {
  return {
    title: "Dụng cụ vệ sinh Sao Việt - Admin blog",
    description: "Dụng cụ vệ sinh Sao Việt - Admin blog",
  }
}

const Page = () => {
  return <EditBlog />
}

export default Page
