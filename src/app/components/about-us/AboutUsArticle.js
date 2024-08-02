import { motion } from "framer-motion";

const AboutUsArticle = () => {
  const data = [
    {
      title: "Đội ngũ nhân viên",
      content: `Với sự say mê trong công việc, mong muốn khách hàng được sử dụng những sản phẩm chất lượng, an toàn - Sao Việt luôn tìm hiểu những sản phẩm tiêu chuẩn cao, thương hiệu uy tín, được người dùng trên thế giới tin dùng để phân phối tại thị trường Việt Nam.
Tiêu chí của Sao Việt - Khách hàng là trọng tâm nên mọi quyết định kinh doanh đều hướng đến sự hài lòng của khách hàng.Để đáp ứng tiêu chí đó, chúng tôi đã xây đựng đội ngũ nhân viên năng động, sáng tạo, nhiều năm kinh nghiệm, 
thích ứng nhanh, hợp tác và sự cam kết nghiêm túc để phục vụ khách hàng ngày càng tốt hơn.`,
      image: "https://d1t11jpd823i7r.cloudfront.net/about-us/our-story.png",
    },
    {
      title: "",
      content: "Với sứ mệnh mang đến những sản phẩm chất lượng có giá trị cho người sử dụng và những giải pháp làm sạch có trách nhiệm xã hội, chúng tôi hiểu rằng sự tín nhiệm của quý khách hàng dành cho Sao Việt là điều rất quý giá. Và chúng tôi có trách nhiệm chăm sóc, duy trì mối quan hệ này, đồng thời hướng chúng ngày càng phát triển mạnh mẽ, phù hợp với nhu cầu và định hướng của cả hai bên.",
      image: "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/story/our-ceo.jpeg",
    },
    {
      title: "Giá trị bền vững",
      content: `Quỹ Từ Thiện “Trái Tim Sao Việt” được ban giám đốc Công ty – anh Đinh Công Hiếu và chị Đinh Thị Huế ký duyệt thành lập 
      vào ngày 3/10/2022. Quỹ được mọi thành viên trong công ty đóng góp các ý tưởng, tinh thần hăng hái và hành động nhiệt huyết để cố gắng xây dựng bằng mọi cách có thể.
      “Hãy làm bất cứ điều gì có thể và ngay bây giờ để không bao giờ hối tiếc là quá muộn.Có trách nhiệm với cộng đồng chia sẽ yêu thương đó là SỨ MỆNH của toàn thể nhân viên Sao Việt đang hướng tới
      `,
      image: "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/story/our-products.jpg",
    },
  ];

  const quote = "Truyền thống và uy tín của Sao Việt bắt nguồn chính từ sự tận tâm của những người trẻ Nhiệt huyết – Dám nghĩ – Dám làm – Dám chịu trách nhiệm. Do đó, thương hiệu Sao Việt luôn hàm chứa sự tận tâm quên mình, tính chuyên nghiệp, sự sáng tạo và sung sức của tuổi trẻ, luôn mang trong mình tâm huyết là ngôi sao của đất Việt.";

  return (
    <div className="bg-white pt-[100px]">
      <div className="container">
        {
          data?.map((item, index) => {
            return (
              <motion.div
                initial={{ x: index % 2 ? -200 : 200, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                viewport={{ once: true }}
                key={index}
                className="w-full"
              >
                <div
                  className={`
                                        flex md:flex-row justify-between mb-10 last:mb-0 flex-col-reverse
                                        ${index % 2 && 'md:flex-row-reverse'}
                                    `}
                >
                  <div className="md:w-[calc(50%_-_20px)] w-full mb-5">
                    {
                      item.title && <h2 className="text-3xl font-semibold mb-6 hidden md:block">{item.title}</h2>
                    }
                    <p className="leading-loose">{item.content}</p>
                  </div>
                  <div className="md:w-[calc(50%_-_20px)] w-full mb-5">
                    <h2 className="text-3xl text-center font-semibold mb-6 md:hidden block">{item.title}</h2>
                    <img
                      width="450"
                      height="300"
                      src={item.image}
                      alt=""
                      className="aspect-[16/9] object-cover w-full rounded"
                    />
                  </div>
                </div>
                {
                  !index && quote &&
                  <div
                    className="text-white text-[18px] max-w-[900px] rounded-2xl p-[70px_20px] mb-[60px] mx-auto"
                    style={{ background: "url(/icon/quote-open.png) no-repeat left 15px top 12px,url(/icon/quote-close.png) no-repeat right 15px bottom 15px,linear-gradient(290deg, #713ff4 25%, #cd55ff 105%)" }}
                  >
                    {quote}
                  </div>
                }
              </motion.div>
            )
          })
        }
      </div>
    </div>
  )
};

export default AboutUsArticle;