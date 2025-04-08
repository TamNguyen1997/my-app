
import { db } from "@/lib/db";
import { Image } from "@nextui-org/react";
import { Trash2 } from "lucide-react";

const Page = async ({ saleDetailId }) => {
  const images = await db.sale_detail_on_image.findMany({
    where: {
      saleDetailId: saleDetailId
    }
  })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Sale Detail</h1>
      <div className="flex flex-col gap-4">
        {images.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <Image src={item.imageUrl} alt={item.imageAlt} height={200} width={200} className="w-16 h-16 object-cover" />
            <div className="text-success">
              <Trash2 />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
