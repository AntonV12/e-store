import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserType } from "@/lib/types/types";

export const fetchUsers = createAsyncThunk<UserType[], number, { rejectValue: string }>(
  "users/fetchUsers",
  async (limit, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users?limit=${limit}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch products");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Failed to fetch users");
    }
  }
);

export const fetchUserById = createAsyncThunk<UserType, number, { rejectValue: string }>(
  "users/fetchUserById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${id}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch product");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Failed to fetch user");
    }
  }
);
