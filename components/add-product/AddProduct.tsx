"use client";

import style from "./add-product.module.css";
import TextEditor from "@/components/editor/TextEditor";
import { useActionState, useRef, startTransition, useState, useEffect, useCallback } from "react";
import { CreateProductState, ProductType } from "@/lib/types";
import { createProduct, updateProduct } from "@/lib/productsActions";
import { useMessage } from "@/lib/messageContext";
import { useRouter } from "next/navigation";
import ImageList from "./ImageList";
import { translit } from "@/utils/translit";

type DescriptionType = {
  clearContent: () => void;
  getContent: () => string;
  setContent: (content: string) => void;
};

export type ImageType = {
  id: string;
  name: string;
  url: string;
  file: File | null;
};

const initialContent: string = `
        <h1>Общие параметры</h1>
        <table>
          <tbody>
            <tr>
              <td>Тип</td>
              <td></td>
            </tr>
            <tr>
              <td>Модель</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      `;

export default function AddProduct({ product, isEdit = false }: { product: ProductType; isEdit: boolean }) {
  const editorRef = useRef<DescriptionType | null>(null);
  const [images, setImages] = useState<(ImageType | string)[]>(product.imageSrc);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setMessage } = useMessage();

  const router = useRouter();

  const initialState: CreateProductState = {
    error: null,
    message: "",
    formData: product,
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

      if (isEdit) {
        router.push(`/products/${product.id || state.formData?.id}/${translit(product.name)}`);
      }
    }
  }, [state, setMessage, product, router, isEdit]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      startTransition(() => {
        const form = e.currentTarget;
        const formData = new FormData(form);
        const description: string = (editorRef.current as unknown as DescriptionType)?.getContent() || "";
        formData.append("description", description);

        const files = images.map((image) => (typeof image === "string" ? image : image.file));
        if (files) {
          files.forEach((file) => formData.append("images", file as File | string));
        }

        formAction(formData);

        if (state.message) {
          form.reset();
          setImages([]);
          if (editorRef.current) {
            editorRef.current.setContent(initialContent);
          }
        }
      });
    },
    [images, formAction, state],
  );

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);

    const newImages: (ImageType | string)[] = [];

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
          setImages((prev) => [...prev, ...newImages]);
          setIsLoading(false);
        }
      };

      reader.readAsDataURL(file);
    });
  }, []);

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
          <label
            htmlFor="images"
            className={`${style.imgBtn} ${isLoading || isPending || images.length ? style.disabled : ""}`}
          >
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
            <ImageList images={images} setImages={setImages} isEdit={product.imageSrc.length > 0} />
            {images.length ? (
              <>
                <label htmlFor="extraImages" className={style.extraImages}>
                  +
                </label>
                <input type="file" id="extraImages" accept="image/*" multiple hidden onChange={handleFileSelect} />
              </>
            ) : null}
          </div>
        </div>
        <div>
          <label htmlFor="cost">Цена:</label>
          <input type="number" id="cost" name="cost" required defaultValue={product.cost || ""} />
        </div>
        <div>
          <label>Описание:</label>
          <TextEditor ref={editorRef} initialContent={product.description || initialContent} />
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? "Загрузка..." : "Сохранить"}
        </button>
      </form>
    </div>
  );
}
