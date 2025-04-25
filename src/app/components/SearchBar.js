'use client';

import { Input } from '@nextui-org/react';
import { LoaderIcon, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import slugify from 'slugify';
import parse from 'html-react-parser';

const SearchBar = () => {
  const wrapperRef = useRef(null);
  const [isLoading, setIsLoading] = useState({ categories: false, products: false, blogs: false });
  const [results, setResults] = useState({ categories: [], products: [], blogs: [] });
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const queryString = useMemo(() => new URLSearchParams({ slug: slugify(query, { locale: 'vi' }).replace(/[()]/g, '') }), [query]);

  const onSearch = async (value) => {
    setIsLoading({ categories: true, products: true, blogs: true });

    Promise.all([
      fetch(`/api/categories/?size=3&page=1&${queryString}`).then(res => res.json()),
      fetch(`/api/products/search/?size=5&page=1&searchTerm=${value}&includeCate=true`).then(res => res.json()),
    ]).then(([categories, products]) => {
      setResults(prev => ({ ...prev, categories: categories.result, products: products.result }));
      setIsLoading(prev => ({ ...prev, categories: false, products: false }));
    });
    fetch(`/api/blogs/?size=3&page=1&searchTerm=${value}`).then(res => res.json()).then(json => {
      setResults(prev => ({ ...prev, blogs: json.result }))
      setIsLoading(prev => ({ ...prev, blogs: false }));
    })
  };

  const shouldShowResults = useMemo(() => query.length > 2, [query]);

  const getLink = useCallback((key, item) => {
    switch (key) {
      case 'categories':
        return `/${item.slug}`;
      case 'products':
        return `/${item.subCate?.slug}/${item.slug}`;
      case 'blogs':
        return item.categories?.includes(process.env.NEXT_PUBLIC_WORDPRESS_POST_NEWS_ID) ? `/tin-tuc/${item.slug}` : `/kien-thuc-hay/${item.slug}`;
      default:
        return '/';
    }
  }, [results, queryString]);

  return (
    <div ref={wrapperRef} className="relative lg:w-72 md:w-60 xl:w-96 sm:w-44">
      <Input
        isClearable
        radius="lg"
        placeholder="Tìm sản phẩm..."
        startContent={<Search className="hover:opacity-hover" strokeWidth={3} />}
        value={query}
        onValueChange={(value) => {
          setQuery(value);
          if (value.length > 2) onSearch(value);
        }}
        onKeyDown={(e) => e.key === 'Enter' && query.trim() && window.location.replace(`/tim-kiem?key=${slugify(query, { locale: 'vi' }).replace(/[()]/g, '')}`)}
        onClear={() => setQuery('')}
        onFocus={() => setIsFocused(true)}
      />
      {shouldShowResults && isFocused && (
        <div className="w-[400px] bg-white shadow-lg rounded-lg absolute top-full left-0 mt-2 overflow-hidden z-50">
          {[{ key: 'categories', label: 'Có phải bạn đang muốn tìm' },
          { key: 'products', label: 'Sản phẩm gợi ý' },
          { key: 'blogs', label: 'Blog gợi ý' }].map(({ key, label }) => (
            <div key={key}>
              <div className="px-4 py-2 bg-slate-200 border-b border-slate-300 text-slate-600">{label}</div>
              {isLoading[key] ? (
                <div className="w-full p-2 flex justify-center"><LoaderIcon className="animate-spin" /></div>
              ) : results[key].length > 0 ? (
                <div className="divide-y divide-slate-300 py-2">
                  {results[key].map((item, i) => (
                    key === "blogs" ? <BlogSearchItem key={item.id} item={item} url={getLink(key, item)} /> : <DefaultSearchItem key={item.id} item={item} url={getLink(key, item)} type={key} />
                  ))}
                </div>
              ) : <div className="py-2 flex justify-center">Không tìm thấy kết quả</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DefaultSearchItem = ({ item, url, type }) => {
  return (
    <Link key={item.id} href={`${url}`}>
      <div className="px-4 py-2 flex items-center gap-5 hover:bg-slate-50 cursor-pointer">
        {item.imageUrl || item.thumbnail ? <Image width={60} height={60} src={item.imageUrl || item.thumbnail} alt={item.name || item.title || "Tìm kiếm Dụng cụ vệ sinh Sao Việt"} /> : ''}
        <div>
          <h3 className="font-semibold text-slate-600">{item.name || item.title}</h3>
          {type === 'products' && <p className="text-slate-400">{item.category?.name}</p>}
        </div>
      </div>
    </Link>
  )
};

const BlogSearchItem = ({ item, url }) => {
  return (
    <Link key={item.id} href={`${url}`}>
      <div className="px-4 py-2 flex items-center gap-5 hover:bg-slate-50 cursor-pointer">
        <Image width={60} height={60} src={`${item._embedded["wp:featuredmedia"]?.length ? item._embedded["wp:featuredmedia"][0]["source_url"] : "/default-featured-image.webp"}`} alt={item.title.rendered} />
        <div>
          <h3 className="font-semibold text-slate-600">{parse(item.title.rendered)}</h3>
        </div>
      </div>
    </Link>
  )
}


export default SearchBar;
