const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt auto
  }
);

module.exports = mongoose.model("BlacklistToken", blacklistTokenSchema);