import { memo, useCallback } from "react";
import { ImageType } from "./AddProduct";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  // horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";

const ImageList = ({
  images,
  setImages,
  isEdit,
}: {
  images: (ImageType | string)[];
  setImages: React.Dispatch<React.SetStateAction<(ImageType | string)[]>>;
  isEdit: boolean;
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setImages((items) => {
          const oldIndex = items.findIndex((item) => (typeof item === "string" ? item : item.id) === active.id);
          const newIndex = items.findIndex((item) => (typeof item === "string" ? item : item.id) === over?.id);

          return arrayMove(items as ImageType[], oldIndex, newIndex);
        });
      }
    },
    [setImages]
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images} /* strategy={horizontalListSortingStrategy} */>
        {images.map((image) => (
          <SortableItem
            key={typeof image === "string" ? image : image.id}
            id={typeof image === "string" ? image : image.id}
            name={typeof image === "string" ? image : image.name}
            url={typeof image === "string" ? image : image.url}
            isEdit={isEdit}
            setImages={setImages}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default memo(ImageList);
