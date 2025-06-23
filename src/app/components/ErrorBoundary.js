import { Link } from "@heroui/react"
import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo })
  }
  render() {
    if (this.state.hasError) {
      return (
        <section className="bg-white dark:bg-gray-900">
          <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
              <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Đã xảy ra lỗi.</p>
              <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Đã xảy ra lỗi. Vui lòng liên hệ với nhân viên bán hàng để biết thêm thông tin</p>
              <Link href="/">Quay về trang chủ</Link>
            </div>
          </div>
        </section>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary