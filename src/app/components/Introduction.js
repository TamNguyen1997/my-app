import "react-multi-carousel/lib/styles.css"

const Introduction = () => {
  return (
    <div className="bg-introduction bg-center w-full bg-cover bg-no-repeat mb-8 md:h-[700px] sm:h-[600px]" style={{
      backgroundSize: "100% 100%"
    }}>
      <div className="flex gap-3 md:ga-7 max-w-[1200px] px-4 mx-auto w-full flex-col md:pt-[90px] pt-7">
        <div className="text-xl font-medium text-justify w-2/3">
          Một trong những công ty dẫn đầu trong lĩnh vực cung cấp máy móc, dụng cụ làm vệ sinh chuyên nghiệp và tư vấn các giải pháp làm sạch cho nhà đầu tư. Được thành lập từ năm 2005, chuyên phân phối chính hãng các thương hiệu:
        </div>
        <div className="grid grid-cols-3 w-3/5">
          <img src="/brand/Logo-Ghibli.png" alt="Ghibli" width={175} height={70}></img>
          <img src="/brand/Rubbermaid.png" alt="Rubbermaid" width={175} height={70}></img>
          <img src="/brand/Logo-Kimberly-Clark.png" alt="Kimberly" width={175} height={70}></img>
          <img src="/brand/Logo-Moerman.png" alt="Moerman" width={175} height={70}></img>
          <img src="/brand/KLEEN-TEX.png" alt="KLEEN-TEX" width={175} height={70}></img>
          <img src="/brand/Logo-Mapa.png" alt="MAPA" width={175} height={70}></img>
        </div>
        <div className="text-xl font-medium text-justify w-2/3">
          Các sản phẩm đạt đầy đủ chứng nhận theo tiêu chuẩn quốc tế. Mang đến sự hài lòng cho khách hàng của doanh nghiệp - là đối tác tin cậy của các nhà đầu tư.
        </div>
      </div>
    </div>)
}

export default Introduction