import ContactInfoCms from "./ContactInfoCms"

export async function generateMetadata() {
  return {
    title: "Dụng cụ vệ sinh Sao Việt - Admin thông tin liên hệ",
    description: "Dụng cụ vệ sinh Sao Việt - Admin thông tin liên hệ",
  }
}

const Page = () => {
  return <>
    <ContactInfoCms />
  </>
}

export default Page