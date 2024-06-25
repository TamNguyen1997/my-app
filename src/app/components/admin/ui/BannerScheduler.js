import { forwardRef, useCallback, useEffect, useState, useTransition } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import FlipMove from 'react-flip-move';
import { ImageDraggable } from "./ImageDraggable";
import { Button } from "@nextui-org/react";
import { v4 } from "uuid";

const generateList = (list) => {
  while (list.length < 5) {
    list.push({
      id: v4(),
      status: false
    })
  }
  return list
}

const BannerScheduler = () => {
  const [, startTransition] = useTransition();
  const [scheduledBanners, setScheduledBanners] = useState([])
  const [defaultBanners, setDefaultBanners] = useState([])

  useEffect(() => {
    const imageUrl = "/api/images/banner"
    fetch(`${imageUrl}?type=DEFAULT`).then(res => res.json()).then(generateList).then(setDefaultBanners)
    fetch(`${imageUrl}?type=SCHEDULED`).then(res => res.json()).then(generateList).then(setScheduledBanners)
  }, [])

  const deleteScheduledImagePos = (imageId) => {
    const newState = [...scheduledBanners];

    newState.forEach(item => {
      if (item.id === imageId) {
        item.image = null
      }
    })

    setScheduledBanners(newState);
  }

  const deleteDefaultImagePos = (imageId) => {
    const newState = [...defaultBanners];

    newState.forEach(item => {
      if (item.id === imageId) {
        item.image = null
      }
    })

    setDefaultBanners(newState);
  }

  const saveDefaultImage = (id, image) => {
    const newState = [...defaultBanners];

    newState.forEach(item => {
      if (item.id === id) {
        item.image = `/gallery/${image}`
      }
    })

    setDefaultBanners(newState);
  }

  const saveScheduledImage = (id, image) => {
    const newState = [...scheduledBanners];

    newState.forEach(item => {
      if (item.id === id) {
        item.image = `/gallery/${image}`
      }
    })

    setScheduledBanners(newState);
  }

  const moveScheduledRow = useCallback((dragIndex, hoverIndex) => {
    startTransition(() => {
      setScheduledBanners((prevList) =>
        update(prevList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevList[dragIndex]]
          ]
        })
      );
    });
  }, []);

  const moveDefaultRow = useCallback((dragIndex, hoverIndex) => {
    startTransition(() => {
      setDefaultBanners((prevList) =>
        update(prevList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevList[dragIndex]]
          ]
        })
      );
    });
  }, []);

  return (
    <div>
      <div className='grid grid-cols-2 gap-3'>

        <DndProvider backend={HTML5Backend}>
          <div>
            <FlipMove>
              {
                scheduledBanners.map((item, index) => (
                  <FunctionalDraggable
                    index={index}
                    key={item.id}
                    itemData={item}
                    moveRow={moveScheduledRow}
                    deleteImagePos={deleteScheduledImagePos}
                    isScheduled
                    saveImage={(image) => saveScheduledImage(item.id, image)}
                  />
                ))
              }
            </FlipMove>
          </div>
        </DndProvider>

        <DndProvider backend={HTML5Backend}>
          <div>
            <FlipMove>
              {
                defaultBanners.map((item, index) => (
                  <FunctionalDraggable
                    index={index}
                    key={item.id}
                    itemData={item}
                    moveRow={moveDefaultRow}
                    deleteImagePos={deleteDefaultImagePos}
                    saveImage={(image) => saveDefaultImage(item.id, image)}
                  />
                ))
              }
            </FlipMove>
          </div>
        </DndProvider>
      </div>

      <Button color="primary" className="min-w-[120px] rounded-lg mt-3">Lưu</Button>
    </div>
  )
}

const FunctionalDraggable = forwardRef((props, ref) => (
  <div ref={ref}>
    <ImageDraggable {...props} />
  </div>
));


export default BannerScheduler