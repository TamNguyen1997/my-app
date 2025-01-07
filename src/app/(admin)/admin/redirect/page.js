import RedirectList from "@/components/admin/ui/redirect/RedirectList"

export async function generateMetadata() {
  return {
    title: "Dụng cụ vệ sinh Sao Việt - Admin redirect",
    description: "Dụng cụ vệ sinh Sao Việt - Admin redirect",
  }
}

const Redirect = () => {
  return <>
    <RedirectList />
  </>
}

export default Redirect