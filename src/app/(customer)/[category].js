
import { useRouter } from 'next/router'
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";

const Cate = async () => {
  const router = useRouter()
  const params = router.query.category;

  const category = await db.category.findFirst({ where: { slug: params.slug } })

  if (!category) {
    return NextResponse.json({ message: "No category found" }, { status: 404 })
  }

  const categoriesToProducts = await db.categories_to_products.findMany({
    where: { categoryId: category.id }, include: {
      product: {
        include: { image: true }
      }
    }
  })
  const data = categoriesToProducts.map(item => item.product)

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-60 bg-cover bg-center bg-no-repeat">
        <div className="flex flex-col items-center justify-center w-full h-full bg-no-repeat bg-cover bg-slate-700">
          <h1 className="text-4xl font-bold text-white">{category.name}</h1>
        </div>
      </div>
      <div
        className="mx-auto w-11/12 px-2 py-8 sm:px-6 sm:py-12 lg:px-8 text-gray-500 text-sm"
        style={{ maxWidth: "90rem" }}>
        <Breadcrumbs>
          <BreadcrumbItem>
            <Link href="/">Trang chủ</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link href={`/${category.slug}`}>{category.name}</Link>
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="w-full lg:w-11/12 mx-auto my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-2">
        {data.map((product) => (
          <Link
            href={`/products/${product.id}`}
            key={product.id}
            className="group border rounded h-[450px] overflow-clip">
            <Image
              width={500}
              height={400}
              src={`${process.env.NEXT_PUBLIC_FILE_PATH + product?.image?.path}`}
              alt={product?.imageAlt}
              className="h-[300px] w-full object-cover object-center group-hover:opacity-50 p-2" />
            <p className="mt-4 text-sm text-gray-700 font-semibold text-center">
              {product.name}
            </p>
            <p className="text-center text-red-500 font-bold text-xl pt-3">
              {
                (Math.random() * 1000000).toLocaleString()
              }
            </p>
          </Link>
        ))}
      </div>
    </>
  );
};


export default Cate;
