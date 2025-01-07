import BlogCms from "@/components/admin/BlogCms"

export async function generateMetadata() {
  return {
    title: "Dụng cụ vệ sinh Sao Việt - Admin blog",
    description: "Dụng cụ vệ sinh Sao Việt - Admin blog",
  }
}

const Admin = () => {
  return <BlogCms></BlogCms>
}

export default Admin
