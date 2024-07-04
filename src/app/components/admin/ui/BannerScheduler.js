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

const BannerScheduler = () => {
  const [, startTransition] = useTransition();
  const [scheduledBanners, setScheduledBanners] = useState([])
  const [defaultBanners, setDefaultBanners] = useState([])

  useEffect(() => {
    fetch(`${imageUrl}?type=DEFAULT`).then(res => res.json()).then((banners) => generateList(banners, "DEFAULT")).then(setDefaultBanners).catch(console.log)
    fetch(`${imageUrl}?type=SCHEDULED`).then(res => res.json()).then((banners) => generateList(banners, "SCHEDULED")).then(setScheduledBanners).catch(console.log)
  }, [])

  const setValue = useCallback((id, value, list, setList) => {
    let newState = [...list];

    newState.forEach(item => {
      if (item.id === id) {
        Object.assign(item, value)
      }
    })

    setList(newState)
  })

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
    let defaultBannersToCreate = defaultBanners
    let scheduledBannersToCreate = scheduledBanners

    defaultBannersToCreate.forEach((item, index) => {
      item.order = index
    })

    scheduledBannersToCreate.forEach((item, index) => {
      item.order = index
    })

    fetch(`${imageUrl}`, { method: "POST", body: JSON.stringify(defaultBannersToCreate) })
    fetch(`${imageUrl}`, { method: "POST", body: JSON.stringify(scheduledBannersToCreate) })
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
                    deleteImagePos={() => setValue(item.id, { imageId: null, image: null }, scheduledBanners, setScheduledBanners)}
                    isScheduled
                    saveImage={(image) => setValue(item.id, { imageId: image.id, image: image }, scheduledBanners, setScheduledBanners)}
                    setActiveFrom={(activeFrom) => setValue(item.id, { activeFrom: new Date(activeFrom.toString()) }, scheduledBanners, setScheduledBanners)}
                    setActiveTo={(activeTo) => setValue(item.id, { activeTo: new Date(activeTo.toString()) }, scheduledBanners, setScheduledBanners)}
                    setActive={(value) => setValue(item.id, { active: value }, scheduledBanners, setScheduledBanners)}
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
                    deleteImagePos={() => setValue(item.id, { imageId: null, image: null }, defaultBanners, setDefaultBanners)}
                    saveImage={(image) => setValue(item.id, { imageId: image.id, image: image }, defaultBanners, setDefaultBanners)}
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