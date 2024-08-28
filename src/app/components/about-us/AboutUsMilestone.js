import { Image } from '@nextui-org/react';
import "react-multi-carousel/lib/styles.css";

const AboutUsMilestone = () => {
  return (
    <div className="container pt-10">
      <div className="max-w-full overflow-hidden">
        <h2
          className="text-3xl font-semibold bg-[linear-gradient(291.66deg,#d5e135_25%,#59b747_105%)] bg-clip-text mb-8"
          style={{ WebkitTextFillColor: 'rgba(0,0,0,0)' }}
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