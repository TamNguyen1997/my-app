import { Contact, HomeIcon, Image, Layers, NotebookPen, ShoppingBasket } from 'lucide-react';

const items = [
  {
    id: 'homepage',
    name: 'Homepage',
    icon: <HomeIcon />,
    link: '/'
  },
  {
    id: 'gallery',
    name: 'Gallery',
    icon: <Image />,
    link: '/admin/image'
  },
  {
    id: "product",
    name: 'Sản phẩm',
    icon: <ShoppingBasket />,
    link: '/admin/product'
  },
  {
    id: "blog",
    name: 'Blog',
    icon: <NotebookPen />,
    link: '/admin/blog'
  },
  {
    id: "contact-infor",
    name: 'Thông tin liên hệ',
    icon: <Contact />,
    link: '/admin/contact-info'
  },
  {
    id: "category",
    name: 'Category',
    icon: <Layers />,
    link: '/admin/category'
  }
]

export default () => {
  return (<>
    <aside id="sidebar-multi-level-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {
            items.map(item => {
              return <li key={item.id}>
                <a href={item.link} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-500 group">
                  {item.icon}
                  <span className="ms-3">{item.name}</span>
                </a>
              </li>
            })
          }
        </ul>
      </div>
    </aside>
  </>
  )
}
