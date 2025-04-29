import style from "./comments.module.css";
import { CommentType } from "@/lib/types/types";

export const CommentsList = ({ comments }: { comments: CommentType[] }) => {
  return (
    <div className={style.comments}>
      <h2>Комментарии</h2>
      {comments.length === 0 ? (
        <p>Ещё никто не оставил комментарий</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong>
                [{comment.date}] {comment.author}
              </strong>
              {": "}
              {comment.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
