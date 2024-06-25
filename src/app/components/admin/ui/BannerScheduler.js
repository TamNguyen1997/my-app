import { forwardRef, useCallback, useEffect, useState, useTransition } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import FlipMove from 'react-flip-move';
import { ImageDraggable } from "./ImageDraggable";
import { Button } from "@nextui-org/react";
import { v4 } from "uuid";

const imageUrl = "/api/images/banner"

const generateList = (list, type) => {
  while (list.length < 5) {
    list.push({
      id: v4(),
      type: type,
      active: false
    })
  }
  return list
}

const deleteImagePos = (imageId, list, setList) => {
  const newState = [...list];

  newState.forEach(item => {
    if (item.id === imageId) {
      item.image = null
    }
  })

  setList(newState);
}

const saveImage = (id, image, list, setList) => {
  const newState = [...list];

  newState.forEach(item => {
    if (item.id === id) {
      item.imageId = image.id
      item.image = image
    }
  })

  setList(newState);
}

const BannerScheduler = () => {
  const [, startTransition] = useTransition();
  const [scheduledBanners, setScheduledBanners] = useState([])
  const [defaultBanners, setDefaultBanners] = useState([])

  useEffect(() => {
    fetch(`${imageUrl}?type=DEFAULT`).then(res => res.json()).then((banners) => generateList(banners, "DEFAULT")).then(setDefaultBanners)
    fetch(`${imageUrl}?type=SCHEDULED`).then(res => res.json()).then((banners) => generateList(banners, "SCHEDULED")).then(setScheduledBanners)
  }, [])

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

  const onSave = () => {
    fetch(`${imageUrl}`, { method: "POST", body: JSON.stringify(defaultBanners) })
    fetch(`${imageUrl}`, { method: "POST", body: JSON.stringify(scheduledBanners) })
  }

  return (
    <div>
      <div className='grid grid-cols-2 gap-3'>

        <DndProvider backend={HTML5Backend}>
          <div>
            <FlipMove className="flex flex-col gap-2">
              {
                scheduledBanners.map((item, index) => (
                  <FunctionalDraggable
                    index={index}
                    key={item.id}
                    itemData={item}
                    moveRow={moveScheduledRow}
                    deleteImagePos={(id) => deleteImagePos(id, scheduledBanners, setScheduledBanners)}
                    isScheduled
                    saveImage={(image) => saveImage(item.id, image, scheduledBanners, setScheduledBanners)}
                  />
                ))
              }
            </FlipMove>
          </div>
        </DndProvider>

        <DndProvider backend={HTML5Backend}>
          <div>
            <FlipMove className="flex flex-col gap-2">
              {
                defaultBanners.map((item, index) => (
                  <FunctionalDraggable
                    index={index}
                    key={item.id}
                    itemData={item}
                    moveRow={moveDefaultRow}
                    deleteImagePos={(id) => deleteImagePos(id, defaultBanners, setDefaultBanners)}
                    saveImage={(image) => saveImage(item.id, image, defaultBanners, setDefaultBanners)}
                  />
                ))
              }
            </FlipMove>
          </div>
        </DndProvider>
      </div>

      <Button color="primary" className="min-w-[120px] rounded-lg mt-3" onClick={onSave}>Lưu</Button>
    </div>
  )
}

const FunctionalDraggable = forwardRef((props, ref) => (
  <div ref={ref}>
    <ImageDraggable {...props} />
  </div>
));


export default BannerScheduler