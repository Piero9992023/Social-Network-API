const router = require('express').Router();

//Importing thoughtController for these routes
const {

    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    deleteReaction

} = require("../../controllers/thoughtController");

// Route -> localhost:3001/api/thoughts
router.route("/").get(getThoughts).post(createThought);

// Route -> localhost:3001/api/thoughts/:thoughtId
router.route("/:thoughtId").get(getSingleThought).put(updateThought).delete(deleteThought);

// Route -> localhost:3001/api/thoughts/:thoughtId/reactions
router.route("/:thoughtId/reactions").post(createReaction);

// Route -> localhost:3001/api/thoughts/:thoughtId/reactions/reactionId
router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);

module.exports = router;

