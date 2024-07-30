import { Link } from "@nextui-org/react";
import { Facebook, Linkedin, Mail, MapPin, NotebookText, Phone, PhoneCall, Youtube } from "lucide-react";
import Image from "next/image";


const Footer = () => {
  return (
    <div className="bg-[#212020] text-white p-2">
      <div className="grid gap-2 m-auto grid-cols-2 lg:grid-cols-9">
        <div className="p-3 sm:grid-cols-1 lg:col-span-3">
          <div className="flex flex-col gap-3">
            <p className="font-bold">CÔNG TY TNHH TMDV VỆ SINH SAO VIỆT</p>
            <div className="flex gap-2">
              <div>
                <MapPin className="text-[#ffd300]" size="24" />
              </div>
              <p className="w-">666/62 đường 3/2, phường 14, quận 10, TP Hồ Chí Minh</p>
            </div>
            <div className="flex gap-2">
              <NotebookText className="text-[#ffd300]" size="24" />
              <p>MST: 0304014195</p>
            </div>
            <div className="flex gap-2">
              <Mail className="text-[#ffd300]" size="24" />
              <p>Email: info@saovietco.vn</p>
            </div>
            <div className="flex gap-2">
              <Phone className="text-[#ffd300]" size="24" />
              <p>Tel: 028 3863 9456 – 028 3863 9457</p>
            </div>
            <div className="flex gap-2">
              <PhoneCall className="text-[#ffd300]" size="24" />
              <p>Hotline: 090 380 2979</p>
            </div>
          </div>
        </div>
        <div className="p-3 flex flex-col gap-3 sm:grid-cols-1 lg:col-span-2">
          <p className="font-bold">CHÍNH SÁCH & HỢP TÁC</p>
          <div>
            <Link href="/ho-tro/huong-dan-mua-hang" className="text-white">
              Hướng dẫn mua hàng
            </Link>
          </div>
          <div>
            <Link href="/ho-tro/hinh-thuc-thanh-toan" className="text-white">
              Hình thức thanh toán
            </Link>
          </div>
          <div>
            <Link href="/ho-tro/hinh-thuc-van-chuyen" className="text-white">
              Hình thức vận chuyển
            </Link>
          </div>
          <div className="flex gap-1">
            <Link href="/ho-tro/chinh-sach-bao-hanh" className="text-white">
              Bảo hành
            </Link>
            <span>-</span>
            <Link href="/ho-tro/chinh-sach-doi-tra" className="text-white">
              Đổi trả
            </Link>
          </div>
          <div>
            <Link href="/ho-tro/chinh-sach-bao-mat" className="text-white">
              Bảo mật thông tin
            </Link>
          </div>
          <div>
            <Link isExternal href="https://docs.google.com/forms/d/e/1FAIpQLSeFq-zgAusY-WWdqsVWp6Cys7ZFRx0KVYgAKFQ37KAvwXtOig/viewform" className="text-white">
              Hợp tác bán hàng
            </Link>
          </div>

        </div>
        <div className="p-3 flex flex-col gap-3 lg:col-span-2">
          <p className="font-bold ">THỜI GIAN LÀM VIỆC</p>
          <p>Thứ 2 – Thứ 6: 08h00 – 17h00</p>
          <p>thứ 7: 8:00 - 12:00</p>
          <p>Chủ nhật & Ngày lễ: Nghỉ</p>
          <div className="flex gap-4">
            <Image height="200" width="200" src="/brand/Icon-dmca_protected.png" className="w-[90px] h-[30px]" alt="" />
            <Image height="200" width="200" src="/brand/icon-bo-cong-thuong.png" className="w-[70px] h-[30px]" alt="" />
          </div>
          <p className="font-bold">MẠNG XÃ HỘI</p>
          <div className="flex gap-3">
            <Link href="https://www.facebook.com/vesinhsaoviet/?ref=embed_page">
              <Facebook className="w-[30px] h-[30px] text-white" />
            </Link>
            <Link href="/">
              <Linkedin className="w-[30px] h-[30px] text-white" />
            </Link>
            <Link href="/" className="pt-1">
              <Youtube className="w-[30px] h-[30px] text-white" />
            </Link>
          </div>

        </div>
        <div className="flex flex-col lg:col-span-2">
          <Link href="/ve-chung-toi">
            <p className="font-bold p-3 w-full">Về chúng tôi</p>
          </Link>
          <p className="font-bold p-3 w-full">FANPAGE CHÍNH THỨC</p>
          <iframe
            className="border-[#ffd300] border h-[130px] rounded-lg w-[300px]"
            data-testid="fb:page Facebook Social Plugin"
            title="fb:page Facebook Social Plugin"
            allowtransparency="true"
            allow="encrypted-media"
            src="https://www.facebook.com/v3.3/plugins/page.php?adapt_container_width=true&amp;app_id=838529706996139&amp;channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Df742a846a7856a793%26domain%3Ddungcuvesinhsaoviet.com%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fdungcuvesinhsaoviet.com%252Ff866436d51c4fddf6%26relation%3Dparent.parent&amp;container_width=0&amp;height=500&amp;hide_cover=false&amp;href=https%3A%2F%2Fwww.facebook.com%2Fvesinhsaoviet%2F&amp;locale=vi_VN&amp;sdk=joey&amp;show_facepile=true&amp;small_header=false&amp;tabs=&amp;width=300"
          ></iframe>
        </div>
      </div>
    </div>
  );
};
export default Footer;
