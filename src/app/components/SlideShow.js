import Image from 'next/image';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

export default function Carousel({ slides }) {
  return (
    <div className="overflow-hidden relative">
      <Slide duration={5000}>
        {
          slides.map((s, i) => {
            return <Image key={i} width="1280" height="720" className="w-full h-full" src={s}/>
          })
        }
      </Slide>
    </div>
  )
}
