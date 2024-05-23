const sections = [
  {
    title: "CÔNG TY TNHH TMDV VỆ SINH SAO VIỆT",
    items: ["Mã số thuế: 0304014195", "Email: info@saovietco.vn", "Hotline: 090 380 2979", "Tel: 028 3863 9456 – 028 3863 9457"],
  },
  {
    title: "CHÍNH SÁCH & HỢP TÁC",
    items: ["Đôi nét về chúng tôi", "Điều khoản giao dịch", "Bảo mật thông tin", "Giao hàng", "Bảo hành – Đổi trả", "Phương thức thanh toán", "Hướng dẫn mua hàng"],
  },
  {
    title: "THỜI GIAN LÀM VIỆC",
    items: ["Thứ 2 – Thứ 6: 08h00 – 17h00", "Thứ 7: 08h00 – 12h00", "Chủ nhật & Ngày lễ: Nghỉ"],
  }
];

const Footer = () => {
  return (
    <div className="w-full mt-24 bg-slate-900 text-gray-300 py-y px-2">
      <div className="mx-auto grid grid-cols-2 md:grid-cols-5 border-b-2 border-gray-600 py-8">
        {sections.map((section, index) => (
          <div key={index}>
            <h6 className="font-bold uppercase pt-2">{section.title}</h6>
            <ul>
              {section.items.map((item, i) => (
                <li key={i} className="py-1 text-gray-500 hover:text-white">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {/* <div className="col-span-2 pt-8 md:pt-2">
          <iframe src="https://dungcuvesinhsaoviet.com/"></iframe>
        </div> */}
      </div>
    </div>
  );
};
export default Footer;