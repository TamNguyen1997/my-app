import { Link } from "@nextui-org/react"

export default () => {
  return <section className="bg-white dark:bg-gray-900">
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center">
        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Không tìm thấy blog.</p>
        <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Không tìm thấy blog bạn đang tìm.</p>
        <div className="flex-row">
          <Link href="/tin-tuc">Quay về tin tức</Link> <br />
          <Link href="/kien-thuc-hay">Quay về kiến thức hay</Link>
        </div>
      </div>
    </div>
  </section>
}