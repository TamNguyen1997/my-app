import { Link } from "@heroui/react"

const CategoryNotFound = () => {
  return <section className="bg-white dark:bg-gray-900">
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center">
        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Không tìm thấy thông tin.</p>
        <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Không tìm thấy thông tin bạn đang tìm. Vui lòng liên hệ với nhân viên bán hàng để biết thêm.</p>
        <Link href="/" className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Quay về trang chủ</Link>
      </div>
    </div>
  </section>
}

export default CategoryNotFound