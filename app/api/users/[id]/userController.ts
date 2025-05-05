import { pool } from "@/lib/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ProductType, UserType } from "@/lib/types/types";

export const updateUser = async (user: UserType): Promise<{ success: boolean; message: string }> => {
  try {
    const { id, cart } = user;
    const sql = "UPDATE users SET cart = ? WHERE id = ?";

    const [results] = await pool.execute<ResultSetHeader>(sql, [cart, id]);

    return {
      success: results.affectedRows > 0,
      message: results.affectedRows > 0 ? "Пользователь успешно обновлен" : "Пользователя не получилось обновить",
    };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Database error" };
  }
};
