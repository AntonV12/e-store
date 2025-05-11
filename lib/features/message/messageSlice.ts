import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MessageState {
  text: string;
}

const initialState: MessageState = {
  text: "",
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage(state, action: PayloadAction<string>) {
      state.text = action.payload;
    },
    clearMessage(state) {
      state.text = "";
    },
  },
});

export const { setMessage, clearMessage } = messageSlice.actions;
//export default messageSlice.reducer;
