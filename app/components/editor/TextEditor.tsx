import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useRef } from "react";
import style from "./textEditor.module.css";
import "./textEditor.css";
import BulletListIcon from "@/public/bulletList.svg";
import NumberedList from "@/public/numberedList.svg";
import UndoIcon from "@/public/undo.svg";
import RedoIcon from "@/public/redo.svg";
import { useState, forwardRef, useImperativeHandle } from "react";
import { Tooltip } from "@/app/components/Tooltip";

interface TextEditorProps {
  onContentChange?: (content: string) => void;
  initialContent?: string;
}

const MenuBar = () => {
  const { editor } = useCurrentEditor();
  const [tooltipText, setTooltipText] = useState<string>("");
  const [mouseCoords, setMouseCoords] = useState<{ x: number; y: number } | null>(null);
  const controlGroupRef = useRef<HTMLDivElement>(null);

  const shortcuts = {
    bold: "Ctrl+B",
    italic: "Ctrl+I",
    strike: "Ctrl+Shift+S",
    bulletList: "Ctrl+Shift+8",
    orderedList: "Ctrl+Shift+7",
    undo: "Ctrl+Z",
    redo: "Ctrl+Shift+Z",
    h1: "Ctrl+Alt+1",
    h2: "Ctrl+Alt+2",
    h3: "Ctrl+Alt+3",
    h4: "Ctrl+Alt+4",
    h5: "Ctrl+Alt+5",
    h6: "Ctrl+Alt+6",
  };

  const handleSetTooltipText = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (target.classList.contains("textEditor_button__Nuom2")) {
      const buttonType = target.dataset.type as keyof typeof shortcuts;

      if (buttonType) {
        setMouseCoords({ x: e.clientX, y: e.clientY });
        setTooltipText(shortcuts[buttonType]);
      }
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={style.controlGroup} ref={controlGroupRef}>
      <div className={style.buttonGroup} onMouseOver={handleSetTooltipText} onMouseOut={() => setTooltipText("")}>
        <button
          type="button"
          data-type="bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`${style.button} ${editor.isActive("bold") ? style.active : ""}`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          data-type="italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`${style.button} ${editor.isActive("italic") ? style.active : ""}`}
        >
          <i>I</i>
        </button>
        <button
          type="button"
          data-type="strike"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`${style.button} ${editor.isActive("strike") ? style.active : ""}`}
        >
          <span style={{ textDecoration: "line-through" }}>AB</span>
        </button>
        <button
          type="button"
          data-type="h1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`${style.button} ${editor.isActive("heading", { level: 1 }) ? style.active : ""}`}
        >
          H1
        </button>
        <button
          type="button"
          data-type="h2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${style.button} ${editor.isActive("heading", { level: 2 }) ? style.active : ""}`}
        >
          H2
        </button>
        <button
          type="button"
          data-type="h3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${style.button} ${editor.isActive("heading", { level: 3 }) ? style.active : ""}`}
        >
          H3
        </button>
        <button
          type="button"
          data-type="h4"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={`${style.button} ${editor.isActive("heading", { level: 4 }) ? style.active : ""}`}
        >
          H4
        </button>
        <button
          type="button"
          data-type="h5"
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={`${style.button} ${editor.isActive("heading", { level: 5 }) ? style.active : ""}`}
        >
          H5
        </button>
        <button
          type="button"
          data-type="h6"
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={`${style.button} ${editor.isActive("heading", { level: 6 }) ? style.active : ""}`}
        >
          H6
        </button>
        <button
          type="button"
          data-type="bulletList"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${style.button} ${editor.isActive("bulletList") ? style.active : ""}`}
        >
          <BulletListIcon />
        </button>
        <button
          type="button"
          data-type="orderedList"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${style.button} ${editor.isActive("orderedList") ? style.active : ""}`}
        >
          <NumberedList />
        </button>
        <button
          type="button"
          data-type="undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={`${style.button}`}
        >
          <UndoIcon />
        </button>
        <button
          type="button"
          data-type="redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={`${style.button}`}
        >
          <RedoIcon />
        </button>
      </div>
      {tooltipText && mouseCoords && (
        <Tooltip children={<span>{tooltipText}</span>} coords={mouseCoords} controlGroupRef={controlGroupRef} />
      )}
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({}),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Placeholder.configure({
    placeholder: "Добавьте сюда описание товара",
  }),
];

//const content = ``;

const TextEditor = forwardRef(({ onContentChange, initialContent = "" }: TextEditorProps, ref) => {
  const [editorInstance, setEditorInstance] = useState<any>(null);

  useImperativeHandle(ref, () => ({
    clearContent: () => {
      if (editorInstance) {
        editorInstance.commands.clearContent();
      }
    },
    getContent: () => {
      return editorInstance?.getHTML() || "";
    },
    setContent: (content: string) => {
      if (editorInstance) {
        editorInstance.commands.setContent(content);
      }
    },
  }));

  return (
    <EditorProvider
      slotBefore={<MenuBar />}
      extensions={extensions}
      content={initialContent}
      onUpdate={({ editor }) => {
        if (onContentChange) {
          onContentChange(editor.getHTML());
        }
      }}
      editorProps={{
        attributes: {
          class: "tiptap-editor",
        },
      }}
      onCreate={({ editor }) => {
        setEditorInstance(editor);
        if (initialContent) {
          editor.commands.setContent(initialContent);
        }
      }}
    />
  );
});

TextEditor.displayName = "TextEditor";

export default TextEditor;
