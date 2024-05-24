import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

export default function Carousel({ timeout, slides }) {
  return (
    <div className="overflow-hidden relative">
      <Slide duration={5000}>
        {
          slides.map((s, i) => {
            return <img
              key={i}
              src={s}
              alt=""
            />
          })
        }
      </Slide>
    </div>
  )
}
