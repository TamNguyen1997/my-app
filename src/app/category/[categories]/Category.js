"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Category = ({ params }) => {
  const [data, setData] = useState([])
  const [category, setCategory] = useState({ name: "" })
  useEffect(() => {
    const fetchCategory = () => {
      fetch(`/api/categories/${params}`).then(async res => {
        if (res.ok) {
          setCategory(await res.json())
        }
      })
    };
    const fetchProducts = () => {
      fetch(`/api/categories/${params}/products`).then(async res => {
        if (res.ok) {
          setData(await res.json())
        }
      })
    }
    fetchCategory()
    fetchProducts()
    window.scrollTo(0, 0)
  }, [params]);

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
        Home <span className="mx-2">/</span> {params}
      </div>
      <div className="w-full lg:w-11/12 mx-auto my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
        {data.map((product) => (
          <Link
            href={`/products/${product.id}`}
            key={product.id}
            className="group">
            <div className="aspect-h-1 aspect-w-1 w-full  md:h-5/6 overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
              <Image
                width={500}
                height={400}
                src={product.imageUrl}
                alt={product.imageAlt}
                className="h-full w-full object-cover object-center group-hover:opacity-50"/>
            </div>
            <h3 className="mt-4 text-sm text-gray-700">{product.description}</h3>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Category;
