import "./textEditor.css";
import style from "./textEditor.module.css";

import Document from "@tiptap/extension-document";
import Gapcursor from "@tiptap/extension-gapcursor";
import Paragraph from "@tiptap/extension-paragraph";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Text from "@tiptap/extension-text";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Tooltip } from "@/components/tooltip/Tooltip";

import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";

import TableIcon from "@/public/table.svg";
import AddColumnRightIcon from "@/public/add_column_right.svg";
import AddColumnLeftIcon from "@/public/add_column_left.svg";
import AddRowAbove from "@/public/add_row_above.svg";
import AddRowBelow from "@/public/add_row_below.svg";
import DeleteColumn from "@/public/delete-column.svg";
import DeleteRow from "@/public/delete-row.svg";
import DeleteIcon from "@/public/delete.svg";
import MergeCells from "@/public/table-cells-merge.svg";
import SplitCells from "@/public/table-cell-split.svg";

interface TextEditorProps {
  onContentChange?: (content: string) => void;
  initialContent?: string;
}

const TableEditor = () => {
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
    table: "Добавить таблицу",
    addColumnLeft: "Добавить колонку слева",
    addColumnRight: "Добавить колонку справа",
    deleteColumn: "Удалить колонку",
    addRowAbove: "Добавить строку сверху",
    addRowBelow: "Добавить строку снизу",
    deleteRow: "Удалить строку",
    deleteTable: "Удалить таблицу",
    mergeCells: "Объединить ячейки",
    splitCell: "Разделить ячейки",
  };

  const handleSetTooltipText = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (target.classList.contains(`${style.button}`)) {
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
    <>
      <div className={style.controlGroup} ref={controlGroupRef}>
        <div className={style.buttonGroup} onMouseOver={handleSetTooltipText} onMouseOut={() => setTooltipText("")}>
          <button
            type="button"
            data-type="table"
            className={`${style.button}`}
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 2, withHeaderRow: false }).run()}
          >
            <TableIcon />
          </button>
          <button
            type="button"
            data-type="addColumnLeft"
            className={`${style.button}`}
            onClick={() => editor.chain().focus().addColumnBefore().run()}
          >
            <AddColumnLeftIcon />
          </button>
          <button
            type="button"
            data-type="addColumnRight"
            className={`${style.button}`}
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            <AddColumnRightIcon />
          </button>
          <button
            type="button"
            data-type="deleteColumn"
            className={`${style.button}`}
            onClick={() => editor.chain().focus().deleteColumn().run()}
          >
            <DeleteColumn />
          </button>
          <button
            type="button"
            data-type="addRowAbove"
            className={`${style.button}`}
            onClick={() => editor.chain().focus().addRowBefore().run()}
          >
            <AddRowAbove />
          </button>
          <button
            type="button"
            data-type="addRowBelow"
            className={`${style.button}`}
            onClick={() => editor.chain().focus().addRowAfter().run()}
          >
            <AddRowBelow />
          </button>
          <button
            type="button"
            data-type="deleteRow"
            className={`${style.button}`}
            onClick={() => editor.chain().focus().deleteRow().run()}
          >
            <DeleteRow />
          </button>
          <button
            type="button"
            data-type="deleteTable"
            className={`${style.button}`}
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            <DeleteIcon />
          </button>
          <button
            type="button"
            data-type="mergeCells"
            className={`${style.button}`}
            onClick={() => editor.chain().focus().mergeCells().run()}
          >
            <MergeCells />
          </button>
          <button
            type="button"
            data-type="splitCell"
            className={`${style.button}`}
            onClick={() => editor.chain().focus().splitCell().run()}
          >
            <SplitCells />
          </button>
          <button
            type="button"
            data-type="bold"
            className={`${style.button} ${editor.isActive("bold") ? style.active : ""}`}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            onClick={() => editor.chain().focus().toggleBold().run()}
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
          {tooltipText && mouseCoords && (
            <Tooltip content={<span>{tooltipText}</span>} coords={mouseCoords} controlGroupRef={controlGroupRef} />
          )}
        </div>
      </div>
    </>
  );
};

const extensions = [
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  TextStyle.configure({}),
  Placeholder.configure({
    placeholder: "Добавьте сюда описание товара",
  }),
  StarterKit.configure({}),
];

const content = `
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

const TextEditor = forwardRef(({ onContentChange, initialContent = content }: TextEditorProps, ref) => {
  const [editorInstance, setEditorInstance] = useState<unknown>(null);

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
      slotBefore={<TableEditor />}
      extensions={extensions}
      content={initialContent}
      immediatelyRender={false}
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

TextEditor.displayName = "description";
export default TextEditor;
