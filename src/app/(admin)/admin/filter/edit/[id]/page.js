import Filter from "./Filter"

export async function generateMetadata() {
  return {
    title: "Dụng cụ vệ sinh Sao Việt - Admin filter",
    description: "Dụng cụ vệ sinh Sao Việt - Admin filter",
  }
}

const Page = () => {
  return <>
    <Filter />
  </>
}

export default Page