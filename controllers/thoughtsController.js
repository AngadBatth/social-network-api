const { Thought, User } = require("../models");

module.exports = {
  async getAllThoughts(req, res) {
    try {
      const dbThoughtData = await Thought.find({})
        .populate({
          path: "reactions",
          select: "-__v",
        })
        .select("-__v");
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  async createThought({ body }, res) {
    try {
      const validateUser = await User.findOne({
        _id: body.userId,
      });
      if (!validateUser) {
        res.status(404).json({message: "User not found"});
        return;
      }
      const dbThoughtData = await Thought.create(body);

      const dbUserData = await User.findOneAndUpdate(
        {
          _id: body.userId,
        },
        {
          $push: {
            thoughts: dbThoughtData._id,
          },
        },
        {
          new: true,
        }
      );
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  async getThoughtById({ params }, res) {
    try {
      const dbThoughtData = await Thought.findOne({
        _id: params.id,
      }).populate("reactions");

      if (!dbThoughtData) {
        res.status(404).json({message: "Error: invalid ID",});
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  async updateThought({ params, body }, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        {
          _id: params.id,
        },
        body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!dbThoughtData) {
        res.status(404).json({message: "Error: invalid ID",});
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  async deleteThought({ params }, res) {
    try {
      const dbThoughtData = await Thought.findOneAndDelete({
        _id: params.id,
      });

      if (!dbThoughtData) {
        res.status(404).json({message: "Error: invalid ID",});
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  async addReaction({ params, body }, res) {
    try {
      const validateUsername = await User.findOne({
        username: body.username,
      });
      if (!validateUsername) {
        res.status(404).json({message: "User not found"});
        return;
      }
      const dbThoughtData = await Thought.findOneAndUpdate(
        {
          _id: params.thoughtId,
        },
        {
          $push: {
            reactions: body,
          },
        },
        {
          runValidators: true,
          new: true,
        }
      );

      if (!dbThoughtData) {
        res.status(404).json({message: "Error: invalid ID",});
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  async removeReaction({ params }, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        {
          _id: params.thoughtId,
        },
        {
          $pull: {
            reactions: {
              _id: params.reactionId,
            },
          },
        },
        {
          runValidators: true,
          new: true,
        }
      );
      if (!dbThoughtData) {
        res.status(404).json({message: "Error: invalid ID",});
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },
};