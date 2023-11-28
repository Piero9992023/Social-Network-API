const { User, Thought } = require('../models')

const userController = {

    // Get All Users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            return res.status(200).json(users);
        } catch(err) {
           return res.status(500).json(err);
        }
    },

    // Get user by :id
    async getSingleUser(req, res) {
        try { 
            const user = await User.findOne({ _id: req.params.userId })

            .populate('thoughts')
            .populate('friends')
            .select('-__v')

            if(!user) {
                return res.status(404).json({message: 'No user found with this ID'});
            }

            return res.status(200).json(user);
        } catch(err) {
            return res.status(500).json(err);
        }
    },

    // Create new user 
    async createUser(req, res) {
        try {
            const dbUserData = await User.create(req.body);
            return res.status(200).json(dbUserData);
        } catch(err) {
            return res.status(500).json(err);
        }
    },

    // Update current user 
    async updateUser(req, res) {
        try {
            const newUserData = await User.findOneAndUpdate(

                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }

            );
            
            if (!newUserData) {
                return res.status(404).json({message: 'No user found with this ID!!'});
            }
            return res.status(200).json(newUserData);
        } catch(err) {
            return res.status(500).json(err);
        }
    },

    //Delete User and associated thoughts 
    async deleteUser(req, res) {
        try{ 
            const user = await User.findOneAndDelete(
                {_id: req.params.userId}
            );

            if (!user) {
                return res.status(404).json(user);
            }

            await User.deleteMany({_id: {$in: user.thoughts} });

            return res.status(200).json({message: "User and associated thoughts were successfully deleted"})
        } catch(err) {
            return res.status(500).json(err);
        }
    },

    //Adding Friend
    async addFriend(req, res) {
        try { 
            const friend = await User.findOneAndUpdate(
                { _id: req.params.userId},
                { $addToSet: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if (!friend) {
                return res.status(404).json({ message: "No user with this ID"})
            }
            return res.status(200).json(friend)
        } catch(err) {
            return res.status(500).json(err);
        }
    },

    //Deleting Friend
    async deleteFriend(req, res) {
        try {
            const friend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if(!friend) {
                return res.status(404).json({ message: "Check user and friend ID"});

            };
            return res.status(200).json(friend);
        } catch(err) {
            return res.status(500).json(err);
        }
    },

};


module.exports = userController;