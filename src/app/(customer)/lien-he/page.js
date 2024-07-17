"use client"
import { Button, Input, Textarea } from "@nextui-org/react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
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
    <div className=" w-2/3 m-auto p-10 text-[14px]">
      <ToastContainer />
      <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 grid-cols-1 shadow-xl border rounded-lg">
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
        <div className="p-4 lg:p-12 bg-[#ffd300] rounded-lg">
          <p className="text-[16px] mt-2 mb-3 text-center font-bold">LIÊN HỆ</p>
          <span>
            Sao Việt rất vui vì được tiếp nhận liên hệ của bạn. Có bất cứ điều gì cần phản hồi/giải đáp, gửi ngay cho chúng mình bên dưới nhé!
          </span>
          <div >
            <form className="mx-auto max-w-4xl flex-1 lg:w-full" onSubmit={handleSubmit(onSubmit)}>
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
                  isRequired
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
  );
}