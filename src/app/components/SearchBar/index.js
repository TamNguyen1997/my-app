'use client';

import { Input } from '@nextui-org/react';
import { LoaderIcon, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const SearchBar = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`/api/products?size=10&page=1`)
        .then((res) => res.json())
        .then((value) => setProducts(value.result)),
      fetch(`/api/brands`)
        .then((res) => res.json())
        .then((json) => setBrands(json)),
    ]).then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="relative">
      <Input
        isClearable
        radius="lg"
        placeholder="Tìm sản phẩm..."
        aria-label="Search"
        startContent={
          <Search className="hover:opacity-hover" strokeWidth={3}></Search>
        }
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />
      {searchText && (
        <div className="w-[400px] bg-white shadow-lg rounded-lg absolute top-full left-0 mt-2 overflow-hidden z-50">
          <div className="px-4 py-2 bg-slate-200 border-b-1 border-slate-300">
            <p className="text-slate-600">Có phải bạn đang muốn tìm</p>
          </div>
          {!isLoading ? (
            <div className="divide-y-small divide-slate-300">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="px-4 py-2 hover:bg-slate-50 cursor-pointer"
                >
                  {brand.name}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full p-2 flex justify-center items-center">
              <LoaderIcon className="animate-spin" />
            </div>
          )}
          <div className="px-4 py-2 bg-slate-200 border-b-1 border-t-1 border-slate-300">
            <p className="text-slate-600">Sản phẩm gợi ý</p>
          </div>
          {!isLoading ? (
            <div className="divide-y-small divide-slate-300 py-2">
              {products.map((product) => (
                <div key={product.id}>
                  <Link href={`/san-pham/${product.slug}`}>
                    <div className="px-4 py-2 flex items-center gap-5 hover:bg-slate-50 cursor-pointer">
                      <Image
                        width={60}
                        height={60}
                        priority
                        src={`${
                          process.env.NEXT_PUBLIC_FILE_PATH +
                          product.image?.path
                        }`}
                        alt={product.image?.name}
                      />
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
              ))}
            </div>
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
