import { motion } from "framer-motion";

const AboutUsArticle = () => {
  const quote = `Nếu tất cả mọi người cùng nhau tiến về phía trước thì thành công sẽ tự đến \n Henry Ford`;

  return (
    <div className="bg-white pt-[100px] pb-10">
      <div className="container">
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <div
            className={`flex md:flex-row justify-between mb-10 last:mb-0 flex-col-reverse`}
          >
            <div className="md:w-[calc(50%_-_20px)] w-full mb-5">
              <h2 className="text-3xl font-semibold mb-6 hidden md:block">Đội ngũ nhân viên</h2>
              <p className="leading-loose text-justify">Với sự say mê trong công việc, Sao Việt luôn mong muốn khách hàng được sử dụng những sản phẩm chất lượng, an toàn.
                Từ ý nghĩ đó, chúng tôi luôn tìm hiểu những sản phẩm tiêu chuẩn cao, thương hiệu uy tín, được tin dùng về phân phối tại thị trường Việt Nam.
                Tiêu chí của Sao Việt luôn lấy khách hàng làm trọng tâm, nên mọi quyết định kinh doanh đều hướng đến sự hài lòng của khách hàng.
                Chúng tôi đã xây dựng đội ngũ nhân viên năng động, sáng tạo, được đào tạo bài bản, thích ứng nhanh,
                hợp tác và sự cam kết nghiêm túc để phục vụ khách hàng ngày càng tốt hơn.</p>
            </div>
            <div className="md:w-[calc(50%_-_20px)] w-full mb-5 relative">
              <h2 className="text-3xl text-center font-semibold mb-6 md:hidden block">Đội ngũ nhân viên</h2>
              <img
                width="450"
                height="300"
                src="/about-us/article-1.jpg"
                alt="/about-us/article-1.jpg"
                className="aspect-[16/9] object-cover w-full rounded m-auto bottom-3 absolute right-0"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <div
            className="text-[#196b00] text-[20px] text-center max-w-[800px] rounded-2xl p-[40px_20px] mb-[60px] mx-auto whitespace-pre-wrap"
            style={{
              background: `url(/icon/quote-open.png) no-repeat left 15px top 12px,url(/icon/quote-close.png)
                    no-repeat right 15px bottom 15px,linear-gradient(290deg, #d5e135 25%, #59b747 105%)` }}
          >
            <p className="italic">
              Nếu tất cả mọi người cùng nhau tiến về phía trước thì thành công sẽ tự đến.
            </p>
            <p>
              Henry Ford
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <div
            className={`flex md:flex-row justify-between mb-10 last:mb-0 flex-col-reverse`}
          >
            <div className="md:w-[calc(50%_-_20px)] w-full mb-5">
              <h2 className="text-3xl font-semibold mb-6 hidden md:block">Giá trị bền vững</h2>
              <p className="leading-loose text-justify">
                <span>
                  Quỹ từ thiện “Trái Tim Sao Việt” được ban giám đốc - ông Đinh Công Hiếu - ký duyệt thành lập vào ngày 03/10/2022.
                  Quỹ được các thành viên trong công ty ấp ủ về ý tưởng, bằng sự hăng hái và mong muốn thực hiện những hành động có giá trị cho xã hội.
                </span>
                <span className="italic pl-1">
                  “Hãy làm bất cứ điều gì có thể ngay bây giờ để không bao giờ hối tiếc rằng quá muộn. Có trách nhiệm với cộng đồng,
                  chia sẻ yêu thương - đó là SỨ MỆNH của toàn thể nhân viên Sao Việt đang hướng tới”
                </span>
                <span>.</span>
              </p>
            </div>
            <div className="md:w-[calc(50%_-_20px)] w-full mb-5 relative">
              <h2 className="text-3xl text-center font-semibold mb-6 md:hidden block">Giá trị bền vững</h2>
              <img
                width="450"
                height="300"
                src="/about-us/article-2.jpg"
                alt="/about-us/article-2.jpg"
                className="aspect-[16/9] object-cover w-full rounded m-auto bottom-3 absolute right-0"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
};

export default AboutUsArticle;