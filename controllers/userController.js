const { Thought, User } = require("../models");

module.exports = {
  async getAllUsers(req, res) {
    try {
      const dbUserData = await User.find({})
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .select("-__v");
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  async createUser({ body }, res) {
    try {
      const validateDuplicateEmail = await User.findOne({ email: body.email });
      if (validateDuplicateEmail) {
        return res.status(400).json({msg: "Email in use"});
      }
      const validateDuplicateUsername = await User.findOne({
        username: body.username,
      });
      if (validateDuplicateUsername) {
        return res.status(400).json({msg: "Username in use"});
      }
      const dbUserData = await User.create(body);
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  async getUserById({ params }, res) {
    try {
      const dbUserData = await User.findOne({ _id: params.id })
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .select("-__v");

      if (!dbUserData) {
        res.status(404).json({message: "Error: invalid ID"});
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  async updateUser({ params, body }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.id },
        { $set: body },
        { new: true, runValidators: true }
      );

      if (!dbUserData) {
        res.status(404).json({message: "Error: invalid ID"});
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  async deleteUser({ params }, res) {
    try {
      const user = await User.findOneAndDelete({ _id: params.id });
      if (!user) {
        res.status(404).json({message: "Error: invalid ID"});
        return;
      }
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({message: "Successfully deleted User Data"});
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  async addFriend({ params }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true, runValidators: true }
      );

      if (!dbUserData) {
        res.status(404).json({message: "Error: invalid ID"});
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  async removeFriend({ params }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true, runValidators: true }
      );

      if (!dbUserData) {
        res.status(404).json({message: "Error: invalid ID"});
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },
};