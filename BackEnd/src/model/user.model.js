const mongooes = require("mongoose");

const UserSchema = new mongooes.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
UserSchema.methods.toJSON = function () {
  const { __v, _id, ...object } = this.toObject();
  Object.id = _id;
  return object;
};
module.exports = mongooes.model("User", UserSchema);
