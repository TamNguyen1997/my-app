--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0 (Debian 16.0-1.pgdg120+1)
-- Dumped by pg_dump version 16.0 (Debian 16.0-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: blog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    active boolean DEFAULT false NOT NULL,
    thumbnail text DEFAULT ''::text NOT NULL
);


ALTER TABLE public.blog OWNER TO postgres;

--
-- Name: order_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id text NOT NULL
);


ALTER TABLE public.order_history OWNER TO postgres;

--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    sub_category_id text NOT NULL,
    name text,
    image_url text,
    image_alt text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    id text NOT NULL,
    "categoryId" text
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: sale_detail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sale_detail (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id text NOT NULL,
    value text NOT NULL,
    price integer,
    "parentSaleDetailId" uuid,
    "sale_detailId" uuid
);


ALTER TABLE public.sale_detail OWNER TO postgres;

--
-- Name: subCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."subCategory" (
    name text NOT NULL,
    category_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE public."subCategory" OWNER TO postgres;

--
-- Name: technical_detail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.technical_detail (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    product_id text NOT NULL
);


ALTER TABLE public.technical_detail OWNER TO postgres;

--
-- Data for Name: blog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blog (id, title, content, active, thumbnail) FROM stdin;
1e09aed7-7d3e-4e2f-922f-1d07a43fdd3c	Sao Việt tham gia Ngày hội kết nối kinh doanh Business Open Day của BNI Stars vào ngày 26/04/2024	<p><strong>Trong buổi sáng ngày 26/04, </strong><a target="_blank" rel="noopener" href="https://dungcuvesinhsaoviet.com/"><strong>Công ty TNHH TM DV Vệ Sinh Sao Việt</strong></a><strong> đã tham gia Ngày hội kết nối kinh doanh Business Open Day. Ông Đinh Công Hiếu – Giám Đốc công ty Sao Việt vinh dự là thành viên trong tổ chức.</strong></p><img src="https://dungcuvesinhsaoviet.com/wp-content/uploads/2024/04/Sao-viet-tham-gia-bni-stars-thang-4-2024-cover-01.jpg"><p>Sự kiện nằm trong chuỗi hoạt động của <strong>BNI Stars</strong> – tổ chức kết nối thương mại hàng đầu tại Việt Nam.</p><img src="https://dungcuvesinhsaoviet.com/wp-content/uploads/2024/04/Sao-viet-tham-gia-bni-stars-thang-4-2024-01.jpg">	f	https://dungcuvesinhsaoviet.com/wp-content/uploads/2024/05/Thong-bao-lich-nghi-duong-cong-ty-sao-viet-cover.jpg
96cfefb4-732e-466c-be87-4ca33ed5737b	Sao Việt tham gia Triển lãm Quốc tế Cafe Show Việt Nam lần thứ 9	<p><a target="_blank" rel="noopener" href="https://dungcuvesinhsaoviet.com/"><strong>Công ty TNHH TM DV Vệ Sinh Sao Việt</strong></a><strong> – chuyên phân phối </strong><a target="_blank" rel="noopener" href="https://dungcuvesinhsaoviet.com/danh-muc-san-pham/dung-cu-ve-sinh-rubbermaid-usa/thung-dung-do-brute/"><strong>thùng nhựa BRUTE đa năng của Rubbermaid</strong></a><strong> từ năm 2007, là nhà triển lãm trong sự kiện </strong><a target="_blank" rel="noopener" href="https://ticket.cafeshow.com.vn/"><strong>Cafe Show Việt Nam 2024</strong></a><strong>, diễn ra từ ngày 9 – 11/05/2024.</strong></p><p><strong>Sự kiện nằm trong chuỗi hoạt động quảng bá, nâng cao nhận thức về dòng thùng nhựa BRUTE, quản lý hiệu quả và an toàn cà phê.</strong></p><img src="https://dungcuvesinhsaoviet.com/wp-content/uploads/2024/05/CS_1200x850.jpg"><h2><strong>Triển lãm Quốc tế Cafe Show</strong></h2><p><a target="_blank" rel="noopener" href="https://www.cafeshow.com.vn/"><strong>Cafe Show</strong></a> – thương hiệu có nguồn gốc từ <strong>Hàn Quốc</strong>, là một trong những sự kiện triển lãm mang tầm quốc tế, nằm trong top đầu về lĩnh vực cà phê và đồ uống. Chính thức ra đời từ năm 2002, đến nay chương trình đã tổ chức tại nhiều quốc gia tại châu Á và sắp tới là Paris, Pháp.</p><p>Hơn 20 năm hoạt động, triển lãm không chỉ tập trung vào cà phê mà còn bao gồm trà, các loại đồ uống khác, bánh ngọt, nguyên liệu, máy móc và thiết bị phục vụ ngành cà phê. Triển lãm như một cơ hội để các doanh nghiệp cà phê, barista gặp gỡ, trao đổi kiến thức, thi thố tài năng cũng như khám phá các xu hướng mới nhất trong ngành.</p><p></p><p>Với khẩu hiệu <strong>We clean We care</strong>, Sao Việt đã mang đến hàng loạt dụng cụ vệ sinh công nghiệp đến từ những thương hiệu hàng đầu thế giới như <a target="_blank" rel="noopener" href="https://dungcuvesinhsaoviet.com/danh-muc-san-pham/dung-cu-ve-sinh-rubbermaid-usa/"><strong>Rubbermaid Commercial Products (USA)</strong></a>, <a target="_blank" rel="noopener" href="https://dungcuvesinhsaoviet.com/danh-muc-san-pham/dung-cu-lam-sach-kinh-moerman/"><strong>Moerman (Belgium)</strong></a> và <a target="_blank" rel="noopener" href="https://shopee.vn/saoviettissue"><strong>Kimberly-Clark (USA)</strong></a>. Những thiết bị vệ sinh cao cấp này đảm bảo “Không chỉ chú trọng đến kinh doanh mà còn mang đến cho khách hàng các giải pháp làm vệ sinh hiệu quả nhất.”</p><p></p><p>Với khẩu hiệu <strong>We clean We care</strong>, Sao Việt đã mang đến hàng loạt dụng cụ vệ sinh công nghiệp đến từ những thương hiệu hàng đầu thế giới như <a target="_blank" rel="noopener" href="https://dungcuvesinhsaoviet.com/danh-muc-san-pham/dung-cu-ve-sinh-rubbermaid-usa/"><strong>Rubbermaid Commercial Products (USA)</strong></a>, <a target="_blank" rel="noopener" href="https://dungcuvesinhsaoviet.com/danh-muc-san-pham/dung-cu-lam-sach-kinh-moerman/"><strong>Moerman (Belgium)</strong></a> và <a target="_blank" rel="noopener" href="https://shopee.vn/saoviettissue"><strong>Kimberly-Clark (USA)</strong></a>. Những thiết bị vệ sinh cao cấp này đảm bảo “Không chỉ chú trọng đến kinh doanh mà còn mang đến cho khách hàng các giải pháp làm vệ sinh hiệu quả nhất.”</p>	f	https://dungcuvesinhsaoviet.com/wp-content/uploads/2024/04/Sao-viet-tham-gia-bni-stars-thang-4-2024-cover-01.jpg
98c2eba7-516f-43fa-a774-a7aa3bec8ce2	Săn Sale 4/4 – Mua hàng đỡ tốn: Giảm đến 40% dụng cụ vệ sinh. Chốt đơn nhận quà hàng hiệu	<p><strong>Mua sắm vô tư nhân ngày SALE tháng 4 tại </strong><a target="_blank" rel="noopener" href="https://dungcuvesinhsaoviet.com/"><strong>Sao Việt</strong></a><strong>. Nhanh tay lưu lại loạt ưu đãi hấp dẫn với hàng chục deal dụng cụ vệ sinh chính hãng. Chương trình áp dụng cho khách hàng mua sắm trên các sàn thương mại điện tử.</strong></p><h2><strong>NỘI DUNG CHƯƠNG TRÌNH</strong></h2><ul class="list-disc"><li><p><strong>GIẢM ĐẾN 40% </strong>các dụng cụ vệ sinh cao cấp của<a target="_blank" rel="noopener" href="https://dungcuvesinhsaoviet.com/danh-muc-san-pham/dung-cu-ve-sinh-rubbermaid-usa/"> <strong>Rubbermaid, Hoa Kỳ</strong></a>; máy hút bụi hiện đại của<a target="_blank" rel="noopener" href="https://dungcuvesinhsaoviet.com/danh-muc-san-pham/thiet-bi-lam-sach-cong-nghiep/"> <strong>Ghibli &amp; Wirbel, Ý</strong></a> và dụng cụ lau kính chuyên dụng<a target="_blank" rel="noopener" href="https://dungcuvesinhsaoviet.com/danh-muc-san-pham/dung-cu-lam-sach-kinh-moerman/"> <strong>Moerman, Bỉ</strong></a>.</p></li></ul><ul class="list-disc"><li><p><strong>“DOUBLE GIẢM GIÁ” COMBO MUA THÊM DEAL SỐC</strong> – Áp dụng cho một số gia dụng bếp, dụng cụ vệ sinh <a target="_blank" rel="noopener" href="https://dungcuvesinhsaoviet.com/danh-muc-san-pham/dung-cu-ve-sinh-rubbermaid-usa/"><strong>Rubbermaid</strong></a><strong>.</strong></p></li><li><p><strong>HỐT LIỀN HÀNG HIỆU – </strong>Nhận ngay quà tặng hấp dẫn khi mua khăn giấy, hộp đựng khăn giấy của<a target="_blank" rel="noopener" href="https://www.facebook.com/kimberlyclarksaoviet/"> <strong>Kimberly-Clark Professional</strong></a>; dụng cụ vệ sinh chính hãng.</p></li></ul><p><strong>Thời gian:</strong> Duy nhất <em>3 – 5/4/2024</em></p><p><strong>Áp dụng trên các trang bán hàng TMĐT chính thống của </strong><a target="_blank" rel="noopener" href="https://dungcuvesinhsaoviet.com/"><strong>Sao Việt</strong></a></p><p></p><h2><strong>CHI TIẾT ƯU ĐÃI</strong></h2><h3><strong>VÔ VÀN QUÀ TẶNG KHI MUA KHĂN GIẤY CAO CẤP KIMBERLY-CLARK</strong></h3><p><strong>Ngày sale tháng 4, mua sắm vô tư:</strong> Nhận ngay 1 mẫu khăn giấy cao cấp khi mua 5 sản phẩm cùng loại <strong>(Mua 5 tặng 1)</strong>, áp dụng cho các mã khăn giấy bên dưới.</p>	f	https://dungcuvesinhsaoviet.com/wp-content/uploads/2024/04/Sao-viet-tham-gia-bni-stars-thang-4-2024-01.jpg
f6e1a373-dbce-49ea-9fe5-602cbe3686a0	[LỊCH LÀM VIỆC THÁNG 5] Thông báo lịch nghỉ dưỡng thường niên cho cán bộ, công nhân viên khối văn phòng	<p><strong>Hoạt động du lịch, nghỉ dưỡng tại </strong><a target="_blank" rel="noopener" href="https://dungcuvesinhsaoviet.com/"><strong>Công ty TNHH TM DV Vệ Sinh Sao Việt</strong></a><strong> là một trong số những quyền lợi hấp dẫn cho cán bộ, công nhân viên khối văn phòng, được diễn ra vào quý II hàng năm.</strong></p><p>Sao Việt trân trọng thông báo đến quý khách hàng, quý đối tác lịch làm việc tháng 5, cụ thể như sau:</p><h2><strong>Thời gian diễn ra du lịch, nghỉ dưỡng:</strong></h2><ul class="list-disc"><li><p>Bắt đầu nghỉ từ thứ 6, ngày 17/05/2024</p></li><li><p>Đến hết chủ nhật, ngày 19/05/2024</p></li><li><p>Thời gian làm việc lại: thứ 2, ngày 20/05/2024</p></li></ul><h2><strong>Lịch làm việc tháng 5</strong></h2><p>Hoạt động bình thường từ 8:00 – 17:00, thứ 2 – thứ 6. Riêng thứ 7 từ 8:00 – 12:00</p><p></p><img src="https://dungcuvesinhsaoviet.com/wp-content/uploads/2024/05/Thong-bao-lich-nghi-duong-cong-ty-sao-viet-cover.jpg"><h2><strong>Một số lưu ý</strong></h2><ul class="list-disc"><li><p>Trong thời gian diễn ra hoạt động nghỉ dưỡng, <a target="_blank" rel="noopener" href="https://dungcuvesinhsaoviet.com/"><strong>Công ty TNHH TM DV Vệ Sinh Sao Việt</strong></a>&nbsp;sẽ tạm ngừng tiếp nhận và xử lý các yêu cầu phát sinh từ khách hàng.</p></li><li><p>Để được hỗ trợ, giải quyết về các vấn đề liên quan đến giao dịch, bán hàng, sản phẩm và dịch vụ, quý khách hàng vui lòng thu xếp và thực hiện trước hoặc sau thời gian trên hoặc liên hệ qua số <strong>HOTLINE 090 380 2979.</strong></p></li></ul><h2><strong>Một số hình ảnh của chuyến du lịch, nghỉ dưỡng của Sao Việt trong năm 2023</strong></h2><p><br></p>	f	https://dungcuvesinhsaoviet.com/wp-content/uploads/2024/05/Thong-bao-lich-nghi-duong-cong-ty-sao-viet-4.jpg
\.


--
-- Data for Name: order_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_history (id, product_id) FROM stdin;
8cc9d57d-f364-4bb4-99a7-61c28d2df3fc	hop-dung-khan-lau-sieu-sach-microfiber
e7561587-0098-4729-9e87-3be2e84e90c2	hop-dung-khan-lau-sieu-sach-microfiber
2c382c3f-8b6c-4dab-9354-dee8a966eb45	hop-dung-khan-lau-sieu-sach-microfiber
d091955e-f203-45d7-9a24-af299927ea41	hop-dung-khan-lau-sieu-sach-microfiber
d7153d3a-fe57-40be-8ea5-1f878ed0934e	hop-dung-khan-lau-sieu-sach-microfiber
3242f0a5-22e2-4d08-a8fb-8bb5174da310	hop-dung-khan-lau-sieu-sach-microfiber
6d1cf73a-5184-43c8-8149-b809eb4c91ab	xe-vat-nuoc-lau-san-tay-ep-1-ben-mau-do
685e192e-d361-437c-8030-7a2efcbacfe4	xe-vat-nuoc-lau-san-tay-ep-1-ben-mau-do
cb6049e0-4d19-4c3a-912b-f8f2ff5df02b	xe-vat-nuoc-lau-san-tay-ep-1-ben-mau-do
b54898a9-b518-4789-997a-03c142955cda	bien-canh-bao-tru-caution-wet-floor-in-4-mat-2
bdba1b47-e0fe-4cdb-8f69-57c4e6182d50	bien-canh-bao-tru-caution-wet-floor-in-4-mat-2
496d8b2e-bfed-4c69-a8cb-c365a3c345c6	bien-canh-bao-tru-caution-wet-floor-in-4-mat-2
97f01d69-a9a1-4761-959b-4f30258b1f29	bien-canh-bao-tru-caution-wet-floor-in-4-mat-2
db908ee8-dc58-49b5-b4f3-763463c83fac	bien-canh-bao-tru-caution-wet-floor-in-4-mat-2
6ae7bd40-38e9-4c5b-8c1f-4bd9982a6abe	bien-canh-bao-tru-caution-wet-floor-in-4-mat-2
c354192b-9880-4035-9d6e-296b14cab3f8	ky-hot-rac-khong-nap-can-dai
dcbf94c9-1a00-420c-bb50-2b15ffe7c168	ky-hot-rac-khong-nap-can-dai
4edb53e0-5e44-4db2-9e01-3ce7d6fd92ec	ky-hot-rac-khong-nap-can-dai
ae866761-d218-4ab8-af05-5dac3611fc4a	ky-hot-rac-khong-nap-can-dai
0de114a7-e38a-4b93-b035-05ecfa77087e	ky-hot-rac-khong-nap-can-dai
f9ccf7a8-62fe-4082-83ac-5e45fc135ff2	ky-hot-rac-khong-nap-can-dai
97a45fcd-c256-4034-9f53-4232ff05513e	hop-dung-khan-lau-sieu-sach-microfiber
9120f809-8d4b-452d-9ee1-9c4b332469d4	hop-dung-khan-lau-sieu-sach-microfiber
56b79091-24b1-49e0-b19a-41a14e20b233	hop-dung-khan-lau-sieu-sach-microfiber
819d480f-bccc-4878-af37-a6d424220210	hop-dung-khan-lau-sieu-sach-microfiber
7b43157a-5dde-4f1a-8d5f-fe431746a3f0	cay-dao-13-5-inch-mau-do
8c888eea-901f-44d1-a745-83abbf01d365	cay-dao-13-5-inch-mau-do
f55bafee-3e93-4f66-8e43-b513e8e50050	"cay-dao-13-5-inch-mau-do"
202adb17-ba85-43b6-8e9b-ba12a7eb77b4	"cay-dao-13-5-inch-mau-do"
7fd729b9-49ad-4f42-8eb5-30ea8419538f	khan-lau-san-uot-24-oz-soi-rayon
0b7d0e26-717c-41c8-9748-1362bfbb639e	khan-lau-san-uot-24-oz-soi-rayon
88d80174-4252-46ea-8b7b-cc773bbb028e	khan-lau-san-uot-24-oz-soi-rayon
01ce71f5-3aa5-4385-9ba9-6883cc7c9556	khan-lau-san-uot-24-oz-soi-rayon
3be6fb6a-5710-4cab-aeee-5b0a64c22bf6	ghe-ngoi-em-be-khong-co-banh-xe-chua-lap-rap-mau-den
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (sub_category_id, name, image_url, image_alt, created_at, updated_at, id, "categoryId") FROM stdin;
3d166364-5fd8-4612-9068-90a87c5fe4b9	BIỂN CẢNH BÁO TRỤ “CAUTION WET FLOOR” IN 4 MẶT	https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/08/FG627677YEL-600x600.jpg	BIỂN CẢNH BÁO TRỤ “CAUTION WET FLOOR” IN 4 MẶT	2024-05-22 10:18:46.356	2024-05-22 10:18:46.356	bien-canh-bao-tru-caution-wet-floor-in-4-mat-2	Ghibli
3d166364-5fd8-4612-9068-90a87c5fe4b9	BỘ PHÂN LOẠI RÁC 3 NGĂN	https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/10/FG9T89010000-600x600.jpg	bo-phan-loai-rac-3-ngan	2024-05-22 10:18:46.356	2024-05-22 10:18:46.356	bo-phan-loai-rac-3-ngan	Rubbermaid
3d166364-5fd8-4612-9068-90a87c5fe4b9	CÂY ĐẢO 13.5 INCH MÀU ĐỎ	https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/09/FG1963000000-600x600.jpg	cay-dao-13-5-inch-mau-do	2024-05-22 10:25:43.718	2024-05-22 10:18:46.356	cay-dao-13-5-inch-mau-do	Mapa
3d166364-5fd8-4612-9068-90a87c5fe4b9	GHẾ NGỒI EM BÉ KHÔNG CÓ BÁNH XE CHƯA LẮP RÁP (MÀU ĐEN)	https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/09/FG781408BLA-600x600.jpg	ghe-ngoi-em-be-khong-co-banh-xe-chua-lap-rap-mau-den	2024-05-22 10:31:30.15	2024-05-22 10:18:46.356	ghe-ngoi-em-be-khong-co-banh-xe-chua-lap-rap-mau-den	Moerman
3d166364-5fd8-4612-9068-90a87c5fe4b9	HỘP ĐỰNG KHĂN LAU SIÊU SẠCH MICROFIBER	https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/09/2135007-1-600x600.jpg	HỘP ĐỰNG KHĂN LAU SIÊU SẠCH MICROFIBER	2024-05-22 10:25:43.718	2024-05-22 10:18:46.356	hop-dung-khan-lau-sieu-sach-microfiber	Moerman
3d166364-5fd8-4612-9068-90a87c5fe4b9	KHĂN LAU SÀN ƯỚT 24 OZ SỢI RAYON	https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/09/FGE43800WH00-600x600.jpg	khan-lau-san-uot-24-oz-soi-rayon	2024-05-22 10:18:46.356	2024-05-22 10:18:46.356	khan-lau-san-uot-24-oz-soi-rayon	Mapa
3d166364-5fd8-4612-9068-90a87c5fe4b9	KY HỐT RÁC KHÔNG NẮP, CÁN DÀI	https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/03/FG253100BLA-600x600.jpg	ky-hot-rac-khong-nap-can-dai	2024-05-22 10:18:46.356	2024-05-22 10:18:46.356	ky-hot-rac-khong-nap-can-dai	Rubbermaid
3d166364-5fd8-4612-9068-90a87c5fe4b9	XE VẮT NƯỚC LAU SÀN 35QT MÀU XANH ĐỎ (TAY ÉP GIỮA)	https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/10/FG757888RED-600x600.jpg	XE VẮT NƯỚC LAU SÀN 35QT MÀU XANH ĐỎ (TAY ÉP GIỮA)	2024-05-22 10:18:46.356	2024-05-22 10:18:46.356	xe-vat-nuoc-lau-san-35-qt-mau-xanh-do-tay-ep-giua	Ghibli
3d166364-5fd8-4612-9068-90a87c5fe4b9	XE VẮT NƯỚC LAU SÀN 35QT TAY ÉP 1 BÊN MÀU ĐỎ	https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/10/FG758888RED-600x600.jpg	xe-vat-nuoc-lau-san-tay-ep-1-ben-mau-do	2024-05-22 10:18:46.356	2024-05-22 10:18:46.356	xe-vat-nuoc-lau-san-tay-ep-1-ben-mau-do	Mapa
3d166364-5fd8-4612-9068-90a87c5fe4b9	BIỂN CẢNH BÁO TRỤ “CAUTION WET FLOOR” IN 4 MẶT	https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/08/FG627677YEL-600x600.jpg	BIỂN CẢNH BÁO TRỤ “CAUTION WET FLOOR” IN 4 MẶT	2024-05-24 09:55:01.139	2024-05-24 09:55:01.139	bien-canh-bao-tru-caution-wet-floor-in-4-mat-3	\N
3d166364-5fd8-4612-9068-90a87c5fe4b9	BIỂN CẢNH BÁO TRỤ “CAUTION WET FLOOR” IN 4 MẶT	https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/08/FG627677YEL-600x600.jpg	BIỂN CẢNH BÁO TRỤ “CAUTION WET FLOOR” IN 4 MẶT	2024-05-24 09:55:05.046	2024-05-24 09:55:05.046	bien-canh-bao-tru-caution-wet-floor-in-4-mat-4	\N
3d166364-5fd8-4612-9068-90a87c5fe4b9	BIỂN CẢNH BÁO TRỤ “CAUTION WET FLOOR” IN 4 MẶT	https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/08/FG627677YEL-600x600.jpg	BIỂN CẢNH BÁO TRỤ “CAUTION WET FLOOR” IN 4 MẶT	2024-05-24 09:55:07.843	2024-05-24 09:55:07.843	bien-canh-bao-tru-caution-wet-floor-in-4-mat-5	\N
3d166364-5fd8-4612-9068-90a87c5fe4b9	BIỂN CẢNH BÁO TRỤ “CAUTION WET FLOOR” IN 4 MẶT	https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/08/FG627677YEL-600x600.jpg	BIỂN CẢNH BÁO TRỤ “CAUTION WET FLOOR” IN 4 MẶT	2024-05-24 09:55:10.765	2024-05-24 09:55:10.765	bien-canh-bao-tru-caution-wet-floor-in-4-mat-6	\N
3d166364-5fd8-4612-9068-90a87c5fe4b9	BIỂN CẢNH BÁO TRỤ “CAUTION WET FLOOR” IN 4 MẶT	https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/08/FG627677YEL-600x600.jpg	BIỂN CẢNH BÁO TRỤ “CAUTION WET FLOOR” IN 4 MẶT	2024-05-24 09:55:13.725	2024-05-24 09:55:13.725	bien-canh-bao-tru-caution-wet-floor-in-4-mat-7	\N
3d166364-5fd8-4612-9068-90a87c5fe4b9	BIỂN CẢNH BÁO TRỤ “CAUTION WET FLOOR” IN 4 MẶT	https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/08/FG627677YEL-600x600.jpg	BIỂN CẢNH BÁO TRỤ “CAUTION WET FLOOR” IN 4 MẶT	2024-05-24 09:55:16.558	2024-05-24 09:55:16.558	bien-canh-bao-tru-caution-wet-floor-in-4-mat-8	\N
3d166364-5fd8-4612-9068-90a87c5fe4b9	BIỂN 	https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/08/FG627677YEL-600x600.jpg	BIỂN CẢNH BÁO TRỤ “CAUTION WET FLOOR” IN 4 MẶT	2024-05-24 09:55:22.958	2024-05-24 09:55:22.958	bien-canh-bao-tru-caution-wet-floor-in-4-mat-10	\N
\.


--
-- Data for Name: sale_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sale_detail (id, product_id, value, price, "parentSaleDetailId", "sale_detailId") FROM stdin;
\.


--
-- Data for Name: subCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."subCategory" (name, category_id, created_at, updated_at, id) FROM stdin;
Biển báo sàn	Rubbermaid	2024-05-22 09:05:31.561	2024-05-22 09:05:31.561	3d166364-5fd8-4612-9068-90a87c5fe4b9
Máy chà sàn đơn	Ghibli	2024-05-22 09:06:38.714	2024-05-22 09:06:38.714	450669ae-daad-4201-b153-fe3707406b52
Máy hút bụi	Ghibli	2024-05-22 09:07:01.135	2024-05-22 09:07:01.135	f8f6ce9f-2565-42e2-b7f3-aa6050396691
Cây gắp rác	Moerman	2024-05-22 09:07:27.178	2024-05-22 09:07:27.178	4e3f3d79-2353-4c85-ab1b-1b8639d3f93f
Các loại cây nối lau kính	Moerman	2024-05-22 09:07:50.881	2024-05-22 09:07:50.881	1c43f886-c85b-42c0-9fe1-f550e51a2560
Găng tay bảo hộ	Mappa	2024-05-22 09:08:10.199	2024-05-22 09:08:10.199	35b62248-17fe-423a-8f06-eacc827a7e0e
Găng tay cao su	Mappa	2024-05-22 09:08:21.689	2024-05-22 09:08:21.689	e2b52479-f9af-46e5-9b61-b71afbbae7ce
Bàn chải	Rubbermaid	2024-05-22 09:33:12.558	2024-05-22 09:33:12.558	48b7d950-5ea3-4dd1-b46f-5a9acf68c177
\.


--
-- Data for Name: technical_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.technical_detail (id, key, value, product_id) FROM stdin;
\.


--
-- Name: blog blog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog
    ADD CONSTRAINT blog_pkey PRIMARY KEY (id);


--
-- Name: order_history order_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_history
    ADD CONSTRAINT order_history_pkey PRIMARY KEY (id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: sale_detail sale_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale_detail
    ADD CONSTRAINT sale_detail_pkey PRIMARY KEY (id);


--
-- Name: subCategory subCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."subCategory"
    ADD CONSTRAINT "subCategory_pkey" PRIMARY KEY (id);


--
-- Name: technical_detail technical_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technical_detail
    ADD CONSTRAINT technical_detail_pkey PRIMARY KEY (id);


--
-- Name: order_history_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX order_history_product_id_idx ON public.order_history USING btree (product_id);


--
-- Name: product_sub_category_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_sub_category_id_idx ON public.product USING btree (sub_category_id);


--
-- Name: sale_detail_parentSaleDetailId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sale_detail_parentSaleDetailId_idx" ON public.sale_detail USING btree ("parentSaleDetailId");


--
-- Name: sale_detail_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sale_detail_product_id_idx ON public.sale_detail USING btree (product_id);


--
-- Name: technical_detail_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX technical_detail_product_id_idx ON public.technical_detail USING btree (product_id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

