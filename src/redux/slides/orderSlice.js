import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItems: [],
  orderPetItems: [],
  orderItemsSlected: [],
  shippingAddress: {},
  paymentMethod: "",
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: "",
  isPaid: false,
  paidAt: "",
  isDelivered: "Đơn Hàng Chờ Xác Nhận",
  deliveredAt: "",
  isSucessOrder: false,
  isErrorOrder: false,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem, orderPetItem } = action.payload;
      if (orderItem?.product) {
        const itemOrder = state?.orderItems?.find(
          (item) => item?.product === orderItem.product
        );
        if (itemOrder) {
          if (itemOrder.amount <= itemOrder.countInstock) {
            itemOrder.amount += orderItem?.amount;
            state.isSucessOrder = true;
            state.isErrorOrder = false;
          }
        } else {
          state.orderItems.push(orderItem);
        }
      } else if (orderPetItem?.pet) {
        const itemOrderPet = state?.orderPetItems?.find(
          (item) => item?.pet === orderPetItem?.pet
        );
        if (itemOrderPet) {
          if (itemOrderPet.amount <= itemOrderPet.countInstock) {
            itemOrderPet.amount += orderPetItem?.amount;
            state.isSucessOrder = true;
            state.isErrorOrder = false;
          }
        } else {
          state?.orderPetItems?.push(orderPetItem);
        }
      }
    },
    // addOrderPet: (state, action) => {
    //   const { orderPetItem } = action.payload;

    //   const itemOrderPet = state?.orderPetItems?.find(
    //     (item) => item?.pet === orderPetItem?.pet
    //   );
    //   if (itemOrderPet) {
    //     if (itemOrderPet.amount <= itemOrderPet.countInstock) {
    //       itemOrderPet.amount += orderPetItem?.amount;
    //       state.isSucessOrder = true;
    //       state.isErrorOrder = false;
    //     }
    //   } else {
    //     state?.orderPetItems?.push(orderPetItem)
    //     console.log("state.orderPetItems", state);
    //   }
    // },
    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload;

      const itemOrder = state?.orderItems?.filter(
        (item) => item?.product !== idProduct
      );

      const itemPetOrder = state?.orderPetItems?.filter(
        (item) => item?.pet !== idProduct
      );

      const itemOrderSeleted = state?.orderItemsSlected?.filter(
        (item) => item?.product !== idProduct
      );

      state.orderItems = itemOrder;
      state.orderPetItems = itemPetOrder;
      state.orderItemsSlected = itemOrderSeleted;
    },

    increaseAmount: (state, action) => {
      const { idProduct, idPet } = action.payload;
      if(idProduct) {
        const itemOrder = state?.orderItems?.find(
          (item) => item?.product === idProduct
        );
        const itemOrderSelected = state?.orderItemsSlected?.find(
          (item) => item?.product === idProduct
        );
        itemOrder.amount++;
        if (itemOrderSelected) {
          itemOrderSelected.amount++;
        }
      } else if(idPet) {
        const itemOrder = state?.orderPetItems?.find(
          (item) => item?.pet === idPet
        );
        const itemOrderSelected = state?.orderItemsSlected?.find(
          (item) => item?.pet === idPet
        );
        itemOrder.amount++;
        if (itemOrderSelected) {
          itemOrderSelected.amount++;
        }
      }
    },
    decreaseAmount: (state, action) => {
      const { idProduct, idPet } = action.payload;
      if(idProduct) {
        const itemOrder = state?.orderItems?.find(
          (item) => item?.product === idProduct
        );
        const itemOrderSelected = state?.orderItemsSlected?.find(
          (item) => item?.product === idProduct
        );
        itemOrder.amount--;
        if (itemOrderSelected) {
          itemOrderSelected.amount--;
        }
      } else if(idPet) {
        const itemOrder = state?.orderPetItems?.find(
          (item) => item?.pet === idPet
        );
        const itemOrderSelected = state?.orderItemsSlected?.find(
          (item) => item?.pet === idPet
        );
        itemOrder.amount--;
        if (itemOrderSelected) {
          itemOrderSelected.amount--;
        }
      }
    },
    removeAllOrderProduct: (state, action) => {
      const { listChecked } = action.payload;

      const itemOrders = state?.orderItems?.filter(
        (item) => !listChecked.includes(item.product)
      );

      const itemPetOrders = state?.orderPetItems?.filter(
        (item) => !listChecked.includes(item.pet)
      );

      const itemOrdersSelected = state?.orderItems?.filter(
        (item) => !listChecked.includes(item.product || item.pet)
      );
      state.orderItems = itemOrders;
      state.orderItemsSlected = itemOrdersSelected;
      state.orderPetItems = itemPetOrders;
    },
    selectedOrder: (state, action) => {
      const { listChecked } = action.payload;
      const orderSelected = [];
      state?.orderItems?.forEach((order) => {
        if (listChecked.includes(order.product)) {
          orderSelected.push(order);
        }
      });

      state?.orderPetItems?.forEach((order) => {
        if (listChecked.includes(order.pet)) {
          orderSelected.push(order);
        }
      });
      state.orderItemsSlected = orderSelected;
    },
    resetOrder: (state) => {
      state.isSucessOrder = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addOrderProduct,
  // addOrderPet,
  removeOrderProduct,
  increaseAmount,
  decreaseAmount,
  removeAllOrderProduct,
  selectedOrder,
  resetOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
