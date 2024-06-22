import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { X } from 'lucide-react';
import { DateInput, Switch } from '@nextui-org/react';

//High Level 101 -- react-dnd uses drop areas and draggable items

export function ImageDraggable({ itemData, moveRow, index, deleteImagePos }) {
    const { id } = itemData;
    //react-dnd uses refs as its vehicle to make elements draggable
    const ref = useRef(null);

    //we use `useDrop` to designate a drop zone
    //it returns `collectedProps` and a `drop` function
    const [collectedProps, drop] = useDrop({
        //collectedProps is an object containing collected properties from the collect function

        //`accept` is very important. It determines what items are allowed to be dropped inside it
        //this corresponds with the useDrag `type` value we'll see in a bit.
        accept: "dnd-image",

        //here's that collect function!
        //Usually the info we want out of `collect()` comes from the `monitor` object
        //react- dnd gives us. We can use `monitor` to know things about the state of dnd,
        //like isDragging, clientOffset, etc.
        //If we we want to expose this data outside of the hook and use in other places, we
        //should return it as a part of the `collect(monitor)` function.
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId()
                // Example: maybe you want `isOver: monitor.isOver()` for dynamic styles
            };
        },

        //`hover` gets called by react-dnd when an `accept`ed draggable item is hovering
        //over the drop zone. There is a decent amount of vanilla js that is required to
        //make the reorder ui work:
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            // Time to actually perform the action
            moveRow(dragIndex, hoverIndex);
            item.index = hoverIndex;
        }
    });

    //useDrag allows us to interact with the drag source
    const [collectedDragProps, drag, preview] = useDrag({
        //here's that `type` that corresponds with `accept`. These two have to align.
        type: "dnd-image",
        //`item` describes the item being dragged. It's called by react-dnd when drag begins.
        //`item` gets passed into hover and we use that data there
        item: () => {
            return { id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    //Here's an example of how we use `collectedProps`.
    //I'm using bgColor instead of opacity to demonstrate the difference between the item
    //being dragged and the preview, meaning the element in dragging state. isDragging affects
    //the actual dragged element, not the preview.
    //*Note: if we want to change the preview we would want to use a custom drag layer and render a preview component
    const bgColor = collectedDragProps.isDragging ? "rgba(0,0,0,0.03)" : "";

    //in the return statement, we assign the ref to be the value of the div

    //Join the two refs together. This is a shorthand that allows us to create
    //a drop zone around our draggables in one line.
    drag(drop(ref));

    return (
        <div
            ref={ref}
            data-handler-id={collectedProps.handlerId}
            className="border rounded-2xl select-none p-[24px_12px_12px] cursor-grab h-full"
            style={{ backgroundColor: bgColor }}
        >
            <div className="grid grid-cols-[auto_120px] gap-3">
                <div className="flex flex-wrap items-start">
                    {
                        itemData.images?.map((img, imgIndex) =>
                            <div
                                key={imgIndex}
                                className="group relative hover:opacity-70 aspect-[16/10] w-[min(120px,100%)] mr-3 mb-3"
                            >
                                <img src={img} className="w-full h-full object-cover mr-1" />
                                <span className="absolute -top-2.5 -right-2.5 hidden group-hover:block animate-vote bg-red-500 rounded-full hover:bg-red-700 cursor-pointer" onClick={() => deleteImagePos(index, imgIndex)}><X color="#FFFFFF" /></span>
                            </div>
                        )
                    }
                    <div className="aspect-[1/1] w-[min(75px,100%)] text-xl flex items-center justify-center border cursor-pointer hover:bg-[rgba(0,0,0,0.03)] transition">
                        +
                    </div>
                </div>
                <div className="flex flex-col space-y-2.5 items-end">
                    <DateInput
                        className={`
                                      [&>div]:min-h-7
                                      [&>div]:h-7
                                      [&>div]:rounded
                                    `}
                        defaultValue={itemData.date}
                        aria-label="Date"
                    />
                    <Switch isSelected={itemData.status} />
                </div>
            </div>
        </div>
    );
}