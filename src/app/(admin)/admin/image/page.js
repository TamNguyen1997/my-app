import "./style.css"
import ImageCms from "@/components/admin/ui/ImageCms"

export async function generateMetadata() {
  return {
    title: "Dụng cụ vệ sinh Sao Việt - Admin gallery",
    description: "Dụng cụ vệ sinh Sao Việt - Admin gallery",
  }
}

const page = () => {
  return <ImageCms />
}

export default page
