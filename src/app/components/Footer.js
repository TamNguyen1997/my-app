import { Facebook, Linkedin, Mail, MapPin, NotebookText, Phone, PhoneCall, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="w-full bg-black text-white">
      <div className="grid grid-cols-9 gap-2 w-[95%] m-auto">
        <div className="col-span-3 p-3">
          <div className="flex flex-col gap-3">
            <p className="font-bold">CÔNG TY TNHH TMDV VỆ SINH SAO VIỆT</p>
            <div className="flex gap-1">
              <MapPin className="text-[#ffd300]" />
              <p>666/62 đường 3/2, phường 14, quận 10, TP Hồ Chí Minh</p>
            </div>
            <div className="flex gap-1">
              <NotebookText className="text-[#ffd300]" />
              <p>MST: 0304014195</p>
            </div>
            <div className="flex gap-1">
              <Mail className="text-[#ffd300]" />
              <p>Email: info@saovietco.vn</p>
            </div>
            <div className="flex gap-1">
              <Phone className="text-[#ffd300]" />
              <p>Tel: 028 3863 9456 – 028 3863 9457</p>
            </div>
            <div className="flex gap-1">
              <PhoneCall className="text-[#ffd300]" />
              <p>Hotline: 090 380 2979</p>
            </div>
          </div>
        </div>
        <div className="col-span-2 p-3 flex flex-col gap-3">
          <p className="font-bold">CHÍNH SÁCH & HỢP TÁC</p>
          <div>
            <Link href="/">
              Đôi nét về chúng tôi
            </Link>
          </div>
          <div>
            <Link href="/">
              Điều khoản giao dịch
            </Link>
          </div>
          <div>
            <Link href="/">
              Bảo mật thông tin
            </Link>
          </div>
          <div>
            <Link href="/">
              Giao hàng
            </Link>
          </div>
          <div>
            <Link href="/">
              Bảo hành – Đổi trả
            </Link>
          </div>
          <div>
            <Link href="/">
              Phương thức thanh toán
            </Link>
          </div>
          <div>
            <Link href="/">
              Phương thức vận chuyển
            </Link>
          </div>
          <div>
            <Link href="/">
              Hướng dẫn mua hàng
            </Link>
          </div>
        </div>
        <div className="col-span-2 p-3 flex flex-col gap-3">
          <p className="font-bold ">THỜI GIAN LÀM VIỆC</p>
          <p>Thứ 2 – Thứ 6: 08h00 – 17h00</p>
          <p>Chủ nhật & Ngày lễ: Nghỉ</p>
          <div className="flex gap-4">
            <Image height="200" width="200" src="/brand/Icon-dmca_protected.png" className="w-[90px] h-[30px]" alt="" />
            <Image height="200" width="200" src="/brand/icon-bo-cong-thuong.png" className="w-[70px] h-[30px]" alt="" />
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-3">
          <p className="font-bold p-3 w-full">FANPAGE CHÍNH THỨC</p>
          <iframe
            data-testid="fb:page Facebook Social Plugin"
            title="fb:page Facebook Social Plugin"
            frameborder="0" allowtransparency="true"
            allowfullscreen="true" allow="encrypted-media"
            src="https://www.facebook.com/v3.3/plugins/page.php?adapt_container_width=true&amp;app_id=838529706996139&amp;channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Df742a846a7856a793%26domain%3Ddungcuvesinhsaoviet.com%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fdungcuvesinhsaoviet.com%252Ff866436d51c4fddf6%26relation%3Dparent.parent&amp;container_width=0&amp;height=500&amp;hide_cover=false&amp;href=https%3A%2F%2Fwww.facebook.com%2Fvesinhsaoviet%2F&amp;locale=vi_VN&amp;sdk=joey&amp;show_facepile=true&amp;small_header=false&amp;tabs=&amp;width=300"
          ></iframe>
        </div>
      </div>

      <div className="bg-[#ffd300] text-black">
        <div className="flex gap-16 w-[95%] m-auto">
          <div>
            <p className="font-bold">Mạng xã hội</p>
            <div className="flex">
              <Facebook className="w-[30px] h-[30px]" />
              <Linkedin className="w-[30px] h-[30px]" />
              <Youtube className="w-[30px] h-[30px]" />
            </div>
          </div>
          <div>
            <p className="font-bold">Thương mại điện tử</p>
            <div className="flex">
              <Image height="200" width="200" src="/brand/icon-Shopee.svg" className="w-[30px] h-[30px]" alt="" />
              <Image height="200" width="200" src="/brand/icon-Laz.svg" className="w-[30px] h-[30px]" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
