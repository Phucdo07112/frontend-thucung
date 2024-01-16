import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  avatar: "",
  access_token: "",
  isAdmin: false,
  city: "",
  refreshToken: "",
  heartProduct: [],
  heartPet: [],
  commentIdOrder: []
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const {
        name = "",
        email = "",
        access_Token = "",
        address = "",
        phone = "",
        avatar = "",
        _id = "",
        isAdmin,
        city = "",
        refreshToken = "",
        heartProduct = [],
        heartPet = [],
        commentIdOrder=[]
      } = action.payload;
      state.name = name;
      state.email = email;
      state.address = address;
      state.phone = phone;
      state.avatar = avatar;
      state.id = _id;
      state.access_token = access_Token;
      state.isAdmin = isAdmin;
      state.city = city;
      state.refreshToken = refreshToken ? refreshToken : state.refreshToken;
      state.heartProduct = heartProduct ;
      state.heartPet = heartPet;
      state.commentIdOrder = commentIdOrder;
    },
    resetUser: (state) => {
      state.name = "";
      state.email = "";
      state.address = "";
      state.phone = "";
      state.avatar = "";
      state.id = "";
      state.access_token = "";
      state.isAdmin = false;
      state.city = "";
      state.refreshToken = "";
      state.heartProduct = [];
      state.heartPet = [];
      state.commentIdOrder = [];
    },
    addHeart: (state, action) => {
      const { productId, petId } = action.payload;
      if(productId) {
        if(state.heartProduct.includes(productId)){
          const itemHeartProduct = state?.heartProduct?.filter((item) => item !== productId)
          state.heartProduct = itemHeartProduct
        } else {
          state.heartProduct.push(productId)
        }
      } else if(petId) {
        if(state.heartPet.includes(petId)){
          const itemHeartPet = state?.heartPet?.filter((item) => item !== petId)
          state.heartPet = itemHeartPet
        } else {
          state.heartPet.push(petId)
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUser, resetUser, addHeart } = userSlice.actions;

export default userSlice.reducer;
