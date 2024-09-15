"use client"
import { Button, Input, Link, Textarea } from "@nextui-org/react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    const res = await fetch("/api/contact-info", { method: "POST", body: JSON.stringify(data) })
    if (res.ok) {
      toast.success('Đã gửi thông tin')
    } else {
      toast.error('Không thể gửi thông tin')
    }
  }

  return (
    <div>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/lien-he`} />
      <div className="w-2/3 m-auto p-10 text-[14px]">
        <ToastContainer />
        <div className="grid lg:grid-cols-2 xl:grid-cols-2 grid-cols-1 shadow-xl border rounded-lg">
          <div className="p-4 lg:p-12">
            <p className="text-[16px] mt-2 mb-3 text-center font-bold">CÔNG TY TNHH TMDV VỆ SINH SAO VIỆT</p>
            <div className="flex items-start">
              <Phone />
              <div className="flex flex-col border-b pb-[20px] ml-3 mr-10 border-[#5D6A7A] flex-1">
                <span className="block mb-2 font-bold">
                  Hotline
                </span>
                <span className="">
                  090 380 2979
                </span>
              </div>
            </div>
            <div className="flex items-start mt-[20px]">
              <Mail />
              <div className="flex flex-col border-b pb-[20px] ml-3 mr-10 border-[#5D6A7A] flex-1">
                <span className="block mb-2 font-bold">
                  Email
                </span>
                <span className="">
                  info@saovietco.vn
                </span>
              </div>
            </div>
            <div className="flex items-start mt-[20px]">
              <MapPin />
              <div className="flex flex-col border-b pb-[20px] ml-3 mr-10 border-[#5D6A7A] flex-1">
                <span className="block mb-2 font-bold">
                  Địa chỉ liên hệ
                </span>
                <span className="">
                  666/62 Ba Tháng Hai, Phường 14, Quận 10, TP Hồ Chí Minh
                </span>
              </div>
            </div>
            <div className="flex items-start mt-[20px] pl-7">
              <div className="flex flex-col border-b pb-[20px] ml-3 mr-10 border-[#5D6A7A] flex-1">
                <span className="block mb-2 font-bold">
                  Mã số thuế
                </span>
                <span className="">
                  0304014195
                </span>
              </div>
            </div>
            <div className="flex items-start mt-[20px] pl-7">
              <iframe className="w-full h-[232px] rounded-lg" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.452606546126!2d106.67820871480082!3d10.776605192321416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x5fb3760076c1568a!2zQ8OUTkcgVFkgVE5ISCBUSMavxqBORyBN4bqgSSBE4buKQ0ggVuG7pCBW4buGIFNJTkggU0FPIFZJ4buGVA!5e0!3m2!1svi!2s!4v1618452841951!5m2!1svi!2s"></iframe>
            </div>
          </div>
          <div className="p-4 lg:p-12 bg-[#FFD400] rounded-lg">
            <p className="text-[16px] mt-2 mb-3 text-center font-bold">LIÊN HỆ</p>
            <span>
              Sao Việt hân hạnh được tiếp nhận liên hệ từ quý khách hàng. Nếu có bất kỳ thắc mắc hay phản ánh nào, xin vui lòng để lại thông tin bên dưới!
            </span>
            <div >
              <form className="max-w-4xl flex-1 lg:w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4 shadow-sm sm:p-6">
                  <Input
                    label="Tên"
                    aria-label="Tên"
                    {...register("name", { required: true })}
                    isRequired
                  />
                  {errors.name && <span className="text-red-600 text-small">Bạn phải điền tên</span>}
                  <Input
                    label="Số điện thoại"
                    aria-label="Số điện thoại"
                    {...register("phone", { required: true })}
                    isRequired
                  />
                  {errors.phone && <span className="text-red-600 text-small">Bạn phải điền số điện thoại</span>}
                  <Input
                    label="Email"
                    aria-label="Email"
                    {...register("email", { required: true })}
                    isRequired
                  />
                  {errors.email && <span className="text-red-600 text-small">Bạn phải điền email</span>}
                  <Textarea
                    label="Ghi chú"
                    aria-label="Ghi chú"
                    rows={10}
                    isRequired
                    disableAutosize
                    {...register("note", { required: true })}
                  />
                  {errors.note && <span className="text-red-600 text-small">Bạn phải điền ghi chú</span>}
                  <Button className=" w-full items-center justify-center" color="primary" type="submit">
                    Gửi
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-contact p-12 bg-cover bg-no-repeat">
        <div className="max-w-[1200px] px-4 w-full mx-auto grid lg:grid-cols-2 xl:grid-cols-2 grid-cols-1">
          <div>
            <p className="uppercase text-white text-[26px] font-bold pb-4">Thương mại điện tử</p>
            <div className="flex items-center text-center">
              <div className="flex gap-3">
                <Link href="https://bit.ly/lazada-saoviet">
                  <img src="icon-lazada.svg" width={70} height={70}></img>
                </Link>
                <Link href="https://shopee.vn/saovietcompany">
                  <img src="icon-shopee.svg" width={70} height={70}></img>
                </Link>
                <Link href="https://www.tiktok.com/@vesinhsaoviet">
                  <img src="icon-tiktok.png" width={70} height={70}></img>
                </Link>
              </div>
            </div>
          </div>
          <div>
            <p className="uppercase text-white text-[26px] font-bold pb-4">Mạng xã hội</p>
            <div className="items-center text-center">
              <div className="flex gap-3">
                <Link href="https://www.tiktok.com/@vesinhsaoviet">
                  <img src="icon-tiktok.png" width={70} height={70}></img>
                </Link>
                <Link href="http://bit.ly/youtube-saoviet">
                  <img src="icon-youtube.svg" width={70} height={70}></img>
                </Link>
              </div>
              <div className="pt-10">
                <div className="flex gap-3">
                  <div>
                    <Link href="https://www.facebook.com/vesinhsaoviet/">
                      <img src="icon-facebook.svg" width={70} height={70}></img>
                    </Link>
                  </div>
                  <div className="flex flex-col">
                    <Link href="https://fb.com/vesinhsaoviet" className="text-white font-bold">
                      fb.com/vesinhsaoviet
                    </Link>
                    <Link href="https://fb.com/thungnhuabrute" className="text-white font-bold">
                      fb.com/thungnhuabrute
                    </Link>
                    <Link href="https://fb.com/dungcuvesinhsaoviet" className="text-white font-bold">
                      fb.com/dungcuvesinhsaoviet
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}