'use client';

import { Input } from '@nextui-org/react';
import { LoaderIcon, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import slugify from 'slugify';

const SearchBar = () => {
  const wrapperRef = useRef(null);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isBlogsLoading, setIsBlogsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [condition, setCondition] = useState({});

  const onSearch = async () => {
    setIsCategoriesLoading(true);
    setIsProductsLoading(true);
    setIsBlogsLoading(true)

    let filteredCondition = { ...condition };
    Object.keys(filteredCondition).forEach(
      (key) =>
        filteredCondition[key] === undefined && delete filteredCondition[key]
    );
    const queryString = new URLSearchParams({ slug: slugify(filteredCondition.slug) }).toString();

    fetch(`/api/categories/?size=${5}&page=${1}&${queryString}`).then(
      async (res) => {
        const data = await res.json();
        setCategories(data.result);
        setIsCategoriesLoading(false);
      }
    );

    fetch(`/api/products/?size=${5}&page=${1}&${queryString}&includeCate=true`).then(
      async (value) => {
        const response = await value.json();
        setProducts(response.result);
        setIsBlogsLoading(false);
      }
    );

    fetch(`/api/blogs/?size=${5}&page=${1}&${queryString}&excludeSupport=true`).then(
      async (value) => {
        const response = await value.json();
        setBlogs(response.result);
        setIsProductsLoading(false);
      }
    );
  };
  const onConditionChange = (value) => {
    setCondition(Object.assign({}, condition, value));
  };

  return (
    <div ref={wrapperRef} className="relative lg:w-72 md:w-60 xl:w-96 sm:w-44">
      <Input
        isClearable
        radius="lg"
        placeholder="Tìm sản phẩm..."
        aria-label="Search"
        startContent={
          <Search className="hover:opacity-hover" strokeWidth={3}></Search>
        }
        value={condition.name}
        onValueChange={(value) => {
          onConditionChange({ name: value, slug: value });
          if (value.length > 2) onSearch();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            window.location.replace(`/tim-kiem?key=${slugify(condition.name)}`)
          }
        }}
        onClear={() => onConditionChange({ name: '', slug: '' })}
      />
      {condition.name && condition.name.length > 2 && (
        <div className="w-[400px] bg-white shadow-lg rounded-lg absolute top-full left-0 mt-2 overflow-hidden z-50">
          <div className="px-4 py-2 bg-slate-200 border-b-1 border-slate-300">
            <p className="text-slate-600">Có phải bạn đang muốn tìm</p>
          </div>
          {!isCategoriesLoading ? (
            categories.length > 0 ? (
              <div className="divide-y-small divide-slate-300">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/${category.slug}`}
                    onClick={() => onConditionChange({ name: '', slug: '' })}
                  >
                    <div className="px-4 py-2 hover:bg-slate-50 cursor-pointer">
                      {category.name}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-2 flex justify-center">
                Không tìm thấy kết quả
              </div>
            )
          ) : (
            <div className="w-full p-2 flex justify-center items-center">
              <LoaderIcon className="animate-spin" />
            </div>
          )}
          <div className="px-4 py-2 bg-slate-200 border-b-1 border-t-1 border-slate-300">
            <p className="text-slate-600">Sản phẩm gợi ý</p>
          </div>
          {!isProductsLoading ? (
            products.length > 0 ? (
              <div className="divide-y-small divide-slate-300 py-2">
                {products.map((product) => {
                  return (
                    <div key={product.id}>
                      <Link
                        href={`/${product.subCate ? product.subCate.slug : "san-pham"}/${product.id}`}
                        onClick={() => onConditionChange({ name: '', slug: '' })}
                      >
                        <div className="px-4 py-2 flex items-center gap-5 hover:bg-slate-50 cursor-pointer">
                          {
                            product.image ?
                              <Image
                                width={60}
                                height={60}
                                priority
                                src={`${process.env.NEXT_PUBLIC_FILE_PATH +
                                  product.image?.path
                                  }`}
                                alt={product?.name}
                              /> : ""
                          }
                          <div className="">
                            <h3 className="font-semibold text-slate-600">
                              {product?.name}
                            </h3>
                            <p className="text-slate-400">
                              {product.category?.name}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-2 flex justify-center">
                Không tìm thấy kết quả
              </div>
            )
          ) : (
            <div className="w-full p-2 flex justify-center items-center">
              <LoaderIcon className="animate-spin" />
            </div>
          )}

          <div className="px-4 py-2 bg-slate-200 border-b-1 border-t-1 border-slate-300">
            <p className="text-slate-600">Blog gợi ý</p>
          </div>
          {!isBlogsLoading ? (
            blogs.length > 0 ? (
              <div className="divide-y-small divide-slate-300 py-2">
                {blogs.map((blog) => {
                  return (
                    <div key={blog.id}>
                      <Link
                        href={`}`}
                        onClick={() => onConditionChange({ name: '', slug: '' })}
                      >
                        <div className="px-4 py-2 flex items-center gap-5 hover:bg-slate-50 cursor-pointer">
                          {
                            blog.thumbnail ?
                              <Image
                                width={60}
                                height={60}
                                priority
                                src={`${process.env.NEXT_PUBLIC_FILE_PATH +
                                  blog.thumbnail
                                  }`}
                                alt={blog.thumbnail}
                              /> : ""
                          }
                          <div className="">
                            <h3 className="font-semibold text-slate-600">
                              {blog.title}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-2 flex justify-center">
                Không tìm thấy kết quả
              </div>
            )
          ) : (
            <div className="w-full p-2 flex justify-center items-center">
              <LoaderIcon className="animate-spin" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
