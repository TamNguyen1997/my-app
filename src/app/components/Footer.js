import { Link } from "@nextui-org/react";
import { Facebook, Mail, MapPin, NotebookText, Phone, PhoneCall, Youtube } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="bg-[#212020] text-white p-2">
      <div className="grid gap-2 m-auto sm:grid-cols-2 lg:grid-cols-9">
        <div className="p-3 sm:grid-cols-1 lg:col-span-3">
          <div className="flex flex-col gap-3">
            <p className="font-bold">CÔNG TY TNHH TMDV VỆ SINH SAO VIỆT</p>
            <div className="flex gap-2">
              <MapPin className="text-[#FFD400]" size="24" />
              <p>666/62 Đường 3/2, Phường 14, Quận 10, TP Hồ Chí Minh</p>
            </div>
            <div className="flex gap-2">
              <NotebookText className="text-[#FFD400]" size="24" />
              <p>MST: 0304014195</p>
            </div>
            <div className="flex gap-2">
              <Mail className="text-[#FFD400]" size="24" />
              <p>Email: info@saovietco.vn</p>
            </div>
            <div className="flex gap-2">
              <Phone className="text-[#FFD400]" size="24" />
              <p>Tel: 028 3863 9456 – 028 3863 9457</p>
            </div>
            <div className="flex gap-2">
              <PhoneCall className="text-[#FFD400]" size="24" />
              <p>Hotline: 090 280 2979</p>
            </div>
          </div>
        </div>
        <div className="p-3 flex flex-col gap-3 sm:grid-cols-1 lg:col-span-2">
          <p className="font-bold">CHÍNH SÁCH & HỢP TÁC</p>
          <LinkList links={[
            { href: "/ho-tro/huong-dan-mua-hang", text: "Hướng dẫn mua hàng" },
            { href: "/ho-tro/hinh-thuc-thanh-toan", text: "Hình thức thanh toán" },
            { href: "/ho-tro/hinh-thuc-van-chuyen", text: "Hình thức vận chuyển" },
            { href: "/ho-tro/chinh-sach-bao-hanh", text: "Bảo hành" },
            { href: "/ho-tro/chinh-sach-doi-tra", text: "Đổi trả" },
            { href: "/ho-tro/chinh-sach-bao-mat", text: "Bảo mật thông tin" },
            { href: "https://docs.google.com/forms/d/e/1FAIpQLSfbYULWGzXgkpcHs5LnCOpgB6inG3zWxR47ocWoZF-MGTfwlw/viewform", text: "Hợp tác bán hàng", external: true },
            { href: "/lien-he", text: "Liên hệ", external: true },
            { href: "https://drive.google.com/drive/folders/1NJf3OdCXKGx23H9acc867UrQMGdq5vWM", text: "Tài liệu doanh nghiệp", external: true },
          ]} />
        </div>

        <div className="p-3 flex flex-col gap-3 lg:col-span-2">
          <p className="font-bold">THỜI GIAN LÀM VIỆC</p>
          <p>Thứ 2 – Thứ 6: 08h00 – 17h00</p>
          <p>Thứ 7: 8h00 - 12h00</p>
          <p>Chủ nhật & Ngày lễ: Nghỉ</p>
          <div className="flex gap-4">
            <Image height={30} width={90} src="/brand/Icon-dmca_protected.webp" alt="DMCA Protected" />
            <Image height={30} width={70} src="/brand/icon-bo-cong-thuong.webp" alt="Bo Cong Thuong" />
          </div>

          <p className="font-bold">MẠNG XÃ HỘI</p>
          <div className="flex gap-3">
            <SocialIcon href="https://www.facebook.com/vesinhsaoviet/?ref=embed_page" Icon={Facebook} />
            <SocialIcon href="https://www.tiktok.com/@vesinhsaoviet" Icon={() => <Image src="/Titkok-line.svg" className="text-white" height={30} width={30} alt="Tikok Dụng cụ vệ sinh Sao Việt" />} />
            <SocialIcon href="http://bit.ly/youtube-saoviet" Icon={Youtube} />
          </div>
        </div>

        <div className="flex flex-col lg:col-span-2">
          <Link href="/ve-chung-toi">
            <p className="font-bold p-3 w-full text-white uppercase">Về chúng tôi</p>
          </Link>
          <p className="font-bold p-3 w-full">FANPAGE CHÍNH THỨC</p>
          <iframe
            className="border-[#FFD400] border h-[130px] rounded-lg w-[300px] max-w-full overflow-hidden"
            data-testid="fb:page Facebook Social Plugin"
            title="fb:page Facebook Social Plugin"
            allowtransparency="true"
            allow="encrypted-media"
            loading="lazy"
            src="https://www.facebook.com/v3.3/plugins/page.php?adapt_container_width=true&app_id=838529706996139&channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Df742a846a7856a793%26domain%3Ddungcuvesinhsaoviet.com%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fdungcuvesinhsaoviet.com%252Ff866436d51c4fddf6%26relation%3Dparent.parent&container_width=0&height=500&hide_cover=false&href=https%3A%2F%2Fwww.facebook.com%2Fvesinhsaoviet%2F&locale=vi_VN&sdk=joey&show_facepile=true&small_header=false&tabs=&width=300"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

const LinkList = ({ links }) => (
  <>
    {links.map(({ href, text, external }, idx) => (
      <div key={idx}>
        <Link href={href} className="text-white" isExternal={external}>
          {text}
        </Link>
      </div>
    ))}
  </>
);

const SocialIcon = ({ href, Icon }) => (
  <Link href={href} isExternal>
    <Icon className="w-[30px] h-[30px] text-white" />
  </Link>
);

export default Footer;
