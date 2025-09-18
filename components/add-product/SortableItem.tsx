import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import styles from "./add-product.module.css";

export function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });
  const url = props.isEdit ? `/api/image?name=${props.name}` : props.url;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = (id: string) => {
    props.setImages((prev) => prev.filter((image) => (image.id || image) !== id));
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={styles.imageItem}>
      <Image src={url} alt={props.name} width={160} height={160} title={props.name} {...listeners}></Image>
      <button type="button" className={styles.closeBtn} onClick={() => handleDelete(props.id)}>
        &#10005;
      </button>
    </div>
  );
}
