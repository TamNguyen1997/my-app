import { Link } from "@nextui-org/react"

export default () => {
  return <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div class="mx-auto max-w-screen-sm text-center">
        <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Không tìm thấy sản phẩm.</p>
        <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Không tìm thấy sản phẩm bạn đang tìm. Vui lòng liên hệ với nhân viên bán hàng để biết thêm thông tin</p>
        <Link href="/" class="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Quay về trang chủ</Link>
      </div>
    </div>
  </section>
}