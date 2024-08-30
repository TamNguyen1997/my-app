import { Image } from '@nextui-org/react';
import "react-multi-carousel/lib/styles.css";

const AboutUsMilestone = () => {
  return (
    <div className="container pt-10">
      <div className="max-w-full overflow-hidden">
        <h2
          className="text-3xl font-semibold bg-clip-text mb-8 w-64"
        >
          Lịch sử hình thành
        </h2>
        <Image
          width={1280}
          height={720}
          src='/about-us/history.png'
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

export default AboutUsMilestone;