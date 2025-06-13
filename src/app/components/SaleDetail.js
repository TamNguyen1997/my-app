"use client";
import { Button, Input } from "@nextui-org/react";
import { Gift, ShoppingCart } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { CartContext } from "@/context/CartProvider";
import parse from 'html-react-parser'
import { ProductDetailContext } from "./product/ProductDetail";
import "./SaleDetail.css"

const SaleDetail = ({ saleDetails, product, setImages = () => { } }) => {
  const [selectedDetail, setSelectedDetail] = useState(saleDetails[0] || {});
  const [selectedSecondaryDetail, setSelectedSecondaryDetail] = useState({});
  const [quantity, setQuantity] = useState(1);

  const { addItemToCart } = useContext(CartContext);
  const { setSelectedSaleDetail } = useContext(ProductDetailContext);

  const onPrimarySelect = (key) => {
    const detail = saleDetails.find((detail) => detail.id === key);
    setSelectedDetail(detail);
    setSelectedSecondaryDetail({});
  };

  const getSecondaryDetails = () =>
    saleDetails.filter(
      (item) =>
        item.saleDetailId === selectedDetail.id && item.filterValueId
    );

  const onSecondarySelect = (key) => {
    const detail = saleDetails.find((detail) => detail.id === key);
    setSelectedSecondaryDetail(detail);
  };

  const getPromotion = useCallback(() => {
    if (!product.promotion) return [];
    const matches = product.promotion.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi);
    return matches.map(item => item.replace(/<(\w+)[^>]*>\s*<\/\1>/g, '')).filter(item => item.length > 0);
  }, [product])

  useEffect(() => {
    if (selectedDetail.id && selectedSecondaryDetail.id) {
      setImages(selectedSecondaryDetail.sale_detail_on_image?.map((item) => item.imageUrl) || []);
      setSelectedSaleDetail(selectedSecondaryDetail);
    }
    if (selectedDetail.id && !selectedSecondaryDetail.id) {
      setImages(selectedDetail.sale_detail_on_image?.map((item) => item.imageUrl) || []);
      setSelectedSaleDetail(selectedDetail);
    }
  }, [selectedDetail, selectedSecondaryDetail]);

  const getVariant = (id, selected) => (id === selected ? "solid" : "ghost");

  const getColor = (detail, selected) => {
    const baseClass = `rounded-full w-7 h-7 border-[#e3e3e3] border hover:opacity-50 hover:border-4 hover:border-blue-500`;
    return detail.id === selected
      ? `${baseClass} border-4 border-blue-500`
      : baseClass;
  };

  const formatPrice = (price) =>
    price?.toLocaleString().replaceAll(",", ".");

  const getOriginalPrice = () => {
    const detail =
      selectedSecondaryDetail.price && selectedSecondaryDetail.showPrice
        ? selectedSecondaryDetail
        : selectedDetail.price && !getSecondaryDetails().length
          ? selectedDetail
          : saleDetails[0];

    return detail?.price > detail?.promotionalPrice && detail?.promotionalPrice
      ? formatPrice(detail.price)
      : "";
  };

  const getPrice = () => {
    const detail =
      selectedSecondaryDetail.price && selectedSecondaryDetail.showPrice
        ? selectedSecondaryDetail
        : selectedDetail.price && !getSecondaryDetails().length
          ? selectedDetail
          : saleDetails[0];

    if (!detail) return 0;
    return detail?.promotionalPrice > 0
      ? formatPrice(detail.promotionalPrice)
      : formatPrice(detail.price);
  };

  const addToCartAnimation = (evt, image = null) => {
    const addBtn = evt?.target;
    const headerCartBtn = document.getElementById("header-cart-btn");
    if (!addBtn || !headerCartBtn) return;

    const { top, left, width } = headerCartBtn.getBoundingClientRect();
    const animateItem = image
      ? Object.assign(document.createElement("img"), { src: image })
      : document.createElement("div");

    Object.assign(animateItem.style, {
      position: "fixed",
      zIndex: 99999,
      background: "red",
      width: "50px",
      height: "50px",
    });

    document.body.appendChild(animateItem);

    animateItem
      .animate(
        [
          {
            transform: "scale(1)",
            top: `${addBtn.getBoundingClientRect().top}px`,
            left: `${addBtn.getBoundingClientRect().left}px`,
            opacity: 0.8,
          },
          {
            transform: "scale(0.2)",
            top: `${top}px`,
            left: `${left + width / 2}px`,
            opacity: 0.4,
          },
        ],
        { duration: 600, easing: "ease" }
      )
      .onfinish = () => animateItem.remove();
  };

  const handleAddToCart = (evt, redirect = false) => {
    addToCartAnimation(evt);
    addItemToCart({
      quantity,
      product,
      saleDetail: selectedDetail.id ? selectedDetail : saleDetails[0],
      secondarySaleDetail: selectedSecondaryDetail,
    });
    if (redirect) window.location.replace("/gio-hang");
  };

  return (
    <div>

      <p className="text-[30px] font-extrabold">{product.name}</p>
      <p className="text-gray-500 text-small">
        SKU:{" "}
        {selectedSecondaryDetail.sku ||
          selectedDetail.sku ||
          saleDetails[0]?.sku}
      </p>

      {getOriginalPrice() && (
        <p className="line-through decoration-red-500 text-small opacity-50">
          {`${getOriginalPrice()} đ`}
        </p>
      )}
      <p className="text-[32px] font-medium text-[#b61a2d]">
        {getPrice() && getPrice() > 0 ? `${getPrice()} đ` : ""}
      </p>
      <p className="text-sm">
        Đã bao gồm VAT, chưa bao gồm phí giao hàng.
      </p>
      <p className="text-sm">Giao hàng trong vòng 1-3 ngày.</p>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          {saleDetails
            .filter(
              (item) =>
                !item.saleDetailId &&
                item.filterValueId &&
                item.filterValue &&
                item.filterId
            )
            .map((detail, i) => (
              <div key={i} className="flex flex-col gap-1">
                {detail.type === "COLOR" ? (
                  <div
                    className={getColor(detail, selectedDetail.id)}
                    onClick={() => onPrimarySelect(detail.id)}
                  ></div>
                ) : (
                  <Button
                    color="default"
                    variant={getVariant(detail.id, selectedDetail.id)}
                    onPress={() => onPrimarySelect(detail.id)}
                  >
                    {detail.filterValue.value}
                  </Button>
                )}
              </div>
            ))}
        </div>
        <div>
          {getSecondaryDetails().map((sDetail) => (
            <Button
              color="default"
              key={sDetail.id}
              variant={getVariant(sDetail.id, selectedSecondaryDetail.id)}
              onPress={() => onSecondarySelect(sDetail.id)}
            >
              {sDetail.filterValue.value}
            </Button>
          ))}
        </div>
        {
          getPromotion().length > 0 &&
          <div className="border rounded-md bg-white box-ribbon ">
            <h2 className="ribbon-wrap">
              <div className="ribbon">
                <a href="#" className="mr-[180px] md:mr-[120px] lg:mr-[160px]">
                  Khuyến mãi:
                </a>
              </div>
            </h2>
            <div className="px-2 overflow-auto text-sm py-2 flex flex-col gap-2">
              {
                getPromotion().map((p, index) => parse(`<div className="flex gap-3"><div className="rounded-full bg-blue-400 w-4 h-4 text-xs text-white text-center">${index + 1}</div>` + p + "</div>"))
              }
            </div>
          </div>
        }
        <Input
          type="number"
          label="Số lượng"
          aria-label="Số lượng"
          defaultValue={quantity}
          onValueChange={setQuantity}
          min={1}
          max={999}
        />
        <div className="flex lg:flex-nowrap flex-wrap gap-3 mx-auto">
          <Button
            color="primary"
            isDisabled={getPrice() <= 0}
            onClick={(evt) => handleAddToCart(evt, true)}
          >
            Mua ngay <ShoppingCart />
          </Button>
          <Button
            color="primary"
            isDisabled={getPrice() <= 0}
            onClick={(evt) => handleAddToCart(evt)}
          >
            Thêm vào giỏ hàng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SaleDetail;