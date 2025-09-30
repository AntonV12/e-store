import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./add-product.module.css";
import { ImageType } from "./AddProduct";
import { memo } from "react";

type PropsType = {
  id: string;
  name: string;
  url: string;
  isEdit: boolean;
  setImages: React.Dispatch<React.SetStateAction<(ImageType | string)[]>>;
};

const SortableItem = (props: PropsType) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });
  const url = props.url.startsWith("data:image") ? props.url : `/api/image?name=${props.name}`;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = (id: string) => {
    props.setImages(
      (prev: (ImageType | string)[]) =>
        prev.filter((image) => (typeof image === "string" ? image : image.id) !== id) as string[] | ImageType[]
    );
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={styles.imageItem}>
      <picture className={styles.picture}>
        <img src={url} alt={props.name} width={160} height={160} title={props.name} {...listeners} />
      </picture>

      <button type="button" className={styles.closeBtn} onClick={() => handleDelete(props.id)}>
        &#10005;
      </button>
    </div>
  );
};

export default memo(SortableItem);
