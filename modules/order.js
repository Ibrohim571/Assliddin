const createApplication = require("express/lib/express");
const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  notebooks: [
    {
      notebook: {
        type: Object,
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    name: String,
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  data: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model("Order", orderSchema);
