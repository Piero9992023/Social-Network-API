const { User, Thought } = require('../models')

const thoughtController = {

    // Get Thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();

            return res.status(200).json(thoughts);
        } catch(err) {
            return res.status(500).json(err)
        }
    },

    // Get thought by id 
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })

            if(!thought) {
                return res.status(404).json({ message: "No user with this ID "})
            }
                return res.status(200).json(thought)
        } catch(err) {
            return res.status(500).json(err)
        }
    },

    // Creating Thought 
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);

            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thought._id} },
                { new: true }
            );

            if(!user) {
                return res.status(404).json({
                    message: 'Thought created, but no user found with this ID'
                });
            }
            return res.status(200).json({ message: 'Created the Thought Successfully 🎉' });
        } catch(err) {
            return res.status(500).json(err);
        }
    },

    // Updating Thought 

    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId},
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if(!thought) {
                return res.status(404).json({ message: "No thought with this ID"})
            }

            return res.status(200).json(thought);
        } catch(err) {
            return res.status(500).json(err)
        }
    },

    // Deleting Thought 
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndRemove(
                { _id: req.params.thoughtId }
            );
    
            if (!thought) {
                return res.status(404).json({ message: "No thought with this ID found" });
            };
    
            const updatedUser = await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new : true }
            );
    
            if (!updatedUser) {
                return res.status(404).json({ message: "Thought deleted but no user found with this ID" });
            };
    
            return res.status(200).json({ message: "Thought successfully deleted" });
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // Creating Reaction
    async createReaction(req, res) {
        try {
            const reaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body }},
                { runValidators: true}
            );

            if(!reaction) {
                return res.status(404).json({ message: "No reaction associated with this thought ID"})
            };

            return res.status(200).json(reaction)
        } catch(err) {
            return res.status(500).json(err)
        }
    },

    //Deleting Reaction
    async deleteReaction(req, res) {
        try {
            const reaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { _id: req.params.reactionId } } },
                { runValidators: true, new: true }
            );

            if(!reaction) {
                return res.status(404).json({ message: "No reaction associated with this thought ID"})
            }
            return res.status(200).json(reaction)
        } catch(err) {
            return res.status(500).json(err)
        }
    }

};

module.exports = thoughtController;