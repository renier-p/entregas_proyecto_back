import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  },
});

cartsSchema.pre("find", function (next) {
  this.populate("products._id");
  next();
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;
