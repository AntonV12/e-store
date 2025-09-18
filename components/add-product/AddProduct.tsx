"use client";

import style from "./add-product.module.css";
import TextEditor from "@/components/editor/TextEditor";
import { useActionState, useRef, startTransition, useState, useEffect } from "react";
import { CreateProductState, ProductType } from "@/lib/types";
import { createProduct, updateProduct } from "@/lib/productsActions";
import { useMessage } from "@/lib/messageContext";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { useRouter } from "next/navigation";

const initialProduct = {
  id: 0,
  name: "",
  category: "",
  viewed: 0,
  rating: 0,
  cost: 0,
  imageSrc: [],
  description: "",
  comments: [],
};

export default function AddProduct({
  product = initialProduct,
  isEdit = false,
}: {
  product: ProductType;
  isEdit: boolean;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [images, setImages] = useState(product.imageSrc); // условный тип сделать
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setMessage } = useMessage();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const router = useRouter();

  const initialState: CreateProductState = {
    error: null,
    message: "",
    formData: initialProduct,
  };
  const updateProductWithId = updateProduct.bind(null, product.id);
  const [state, formAction, isPending] = useActionState<CreateProductState, FormData>(
    isEdit ? updateProductWithId : createProduct,
    initialState,
  );

  useEffect(() => {
    if (state?.error) {
      setMessage(state.error);
    }

    if (state?.message) {
      setMessage(state.message);

      const bc = new BroadcastChannel("products");
      bc.postMessage({
        type: "update",
        product: product,
      });
      bc.close();

      router.push(`/products/${product.id}`);
    }
  }, [state, setMessage, product, router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const description = editorRef.current.getContent() || "";

      formData.append("description", description);

      const files = images.map((image) => (typeof image === "string" ? image : image.file));
      if (files) {
        files.forEach((file) => formData.append("images", file));
      }

      formAction(formData);

      if (state?.message) {
        form.reset();
        setImages([]);
        if (editorRef.current) {
          editorRef.current.clearContent();
        }
      }
    });
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);

    const newImages = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        const url = e.target?.result as string;
        newImages.push({
          id: `${Date.now()}-${file.name}`,
          name: file.name,
          url,
          file: file,
        });

        if (newImages.length === files.length) {
          setImages(newImages);
          setIsLoading(false);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => (item.id || item) === active.id);
        const newIndex = items.findIndex((item) => (item.id || item) === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className={style.container}>
      <h2>Добавить новый товар</h2>
      <form className={style.form} onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Название товара:</label>
          <input type="text" id="name" name="name" required defaultValue={product.name} />
        </div>
        <div>
          <label htmlFor="category">Категория:</label>
          <input type="text" id="category" name="category" required defaultValue={product.category} />
        </div>
        <div>
          <label htmlFor="images">Изображения:</label>
          <label htmlFor="images" className={`${style.imgBtn} ${isLoading || isPending ? style.disabled : ""}`}>
            {isLoading ? "Загрузка файлов..." : "Выбрать файлы"}
          </label>
          <input
            hidden
            type="file"
            id="images"
            // name="images"
            accept="image/*"
            // required
            multiple
            onChange={handleFileSelect}
            disabled={isLoading || isPending}
          />
          <div className={style.images}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={images} strategy={horizontalListSortingStrategy}>
                {images.map((image) => (
                  <SortableItem
                    key={image.id || image}
                    id={image.id || image}
                    name={image.name || image}
                    url={image.url || image}
                    isEdit={product.imageSrc.length > 0}
                    setImages={setImages}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
        <div>
          <label htmlFor="cost">Цена:</label>
          <input type="number" id="cost" name="cost" required defaultValue={product.cost} />
        </div>
        <div>
          <label>Описание:</label>
          <TextEditor ref={editorRef} initialContent={product.description} />
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? "Загрузка..." : "Сохранить"}
        </button>
      </form>
    </div>
  );
}
