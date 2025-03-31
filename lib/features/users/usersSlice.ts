import { createAppSlice } from "@/lib/createAppSlice";
//import type { AppThunk } from "@/lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchUsers, fetchUserById } from "./usersAPI";
import { UserType } from "@/lib/types/types";

export interface UsersSliceState {
  value: UserType[] | null;
  status: "idle" | "loading" | "failed";
}

const initialState: UsersSliceState = {
  value: null,
  status: "idle",
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const usersSlice = createAppSlice({
  name: "users",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UserType[]>) => {
        state.status = "idle";
        state.value = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<UserType>) => {
        state.status = "idle";
      })
      .addCase(fetchUserById.rejected, (state) => {
        state.status = "failed";
      });
  },

  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectUsers: (users) => users.value,
    selectStatus: (users) => users.status,
  },
});

export default usersSlice.reducer;
//export const selectAllUsers = (state: { users: UsersSliceState }) => state.users.value;

// Action creators are generated for each case reducer function.
//export const {  } = usersSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectUsers, selectStatus } = usersSlice.selectors;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());

//     if (currentValue % 2 === 1 || currentValue % 2 === -1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };
