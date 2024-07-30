import { motion } from "framer-motion";

const AboutUsArticle = () => {
    const data = [
        {
            title: "Tim pendiri",
            content: "Semuanya berawal ketika Vu Van, CEO dan salah satu pendiri ELSA Speak, meninggalkan Vietnam untuk mengejar gelar MBA dan Magister Pendidikan di Stanford University. Vu percaya diri dengan bahasa Inggrisnya, tetapi dia tahu dia memiliki aksen Vietnam yang kuat. Profesor dan teman sekelasnya tidak selalu dapat memahami apa yang dia katakan, yang membuatnya merasa bahwa pendapatnya di kelas sering diabaikan.",
            image: "https://d1t11jpd823i7r.cloudfront.net/about-us/our-story.png",
        },
        {
            title: "",
            content: "Waktu mencari salah satu rekan pendiri, Vu minta Dr. Xavier Anguera, seorang ahli teknologi yang disegani, untuk membantu membentuk perusahaan baru. Pada tahun 2015, mereka secara resmi meluncurkan ELSA Speak. Sejak saat itu, ELSA Speak telah diakui oleh Forbes sebagai salah satu dari 4 perusahaan terbaik yang menggunakan Kecerdasan Buatan (AI) untuk mengubah dunia, dan menduduki peringkat dalam Top 5 Aplikasi AI, bersama dengan Cortana dari Microsoft dan Google Allo dari Google. ELSA Speak saat ini digunakan oleh jutaan pelajar di seluruh dunia.",
            image: "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/story/our-ceo.jpeg",
        },
        {
            title: "Misi kami",
            content: "ELSA Speak menggunakan teknologi dan desain untuk memungkinkan orang di seluruh dunia berbicara bahasa Inggris dengan percaya diri. Kami bertujuan untuk membuka peluang yang lebih besar bagi jutaan pelajar di seluruh dunia.",
            image: "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/story/our-products.jpg",
        },
    ];

    const quote = "Vu menyadari bahwa dia tidak menghadapi masalah ini sendirian. Kebanyakan teman internasionalnya menghadapi hambatan komunikasi yang sama di tahun pertama mereka belajar di luar negeri. Namun ketika dia melihat ke dalam masalah ini, dia menemukan beberapa solusi.";

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