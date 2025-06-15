import style from "./comments.module.css";
import { CommentType } from "@/lib/types/types";
import { useState } from "react";

export const CommentsList = ({ comments }: { comments: CommentType[] }) => {
  const [limit, setLimit] = useState<number>(10);
  const reversedComments = [...comments].reverse().slice(0, limit);

  return (
    <div className={style.comments}>
      <h2>Комментарии</h2>
      {comments.length === 0 ? (
        <p>Ещё никто не оставил комментарий</p>
      ) : (
        <>
          <ul>
            {reversedComments.map((comment) => (
              <li key={comment.id}>
                <strong>
                  [{comment.date}] {comment.author}
                </strong>
                {": "}
                {comment.text}
              </li>
            ))}
          </ul>
          {comments.length > limit && <button onClick={() => setLimit(limit + 10)}>Показать ещё</button>}
        </>
      )}
    </div>
  );
};
