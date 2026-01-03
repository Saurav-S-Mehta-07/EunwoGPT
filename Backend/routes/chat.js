import express from 'express'
import Thread from '../models/Thread.js';
import getOpenAiApiResponse from '../utils/openAi.js';
import { isLoggedIn } from '../middleware/authMiddleware.js'; // import middleware

const router = express.Router();


//deleteAllData
// router.get("/deleteData",async(req,res)=>{
//     await Thread.deleteMany({});
//     res.send("data deleted successfully");
// })

//test
router.post("/test",async(req , res)=>{
    try{
        const thread = new Thread({
            threadId:"def",
            title:"recent new test thread",
        });
        let response = await thread.save();
        res.send(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error: err.message,
            message: "Failed to save in DB"
        });
    }
});

//to get all threads

router.get("/thread",isLoggedIn, async (req, res) => {
    try {
        const threads = await Thread.find({ user: req.user._id }).sort({ updatedAt: -1 });
        res.send(threads);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            error: err.message,
            message: "Failed to fetch threads",
        });
    }
});



//send threads chats 
router.get("/thread/:threadId",isLoggedIn, async (req, res) => {
    const { threadId } = req.params;

    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    try {
        const thread = await Thread.findOne({ threadId, user: req.user._id });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread.messages);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            error: err.message,
            message: "Failed to fetch chat",
        });
    }
});


//delete route
router.delete("/thread/:threadId",isLoggedIn, async (req, res) => {
    const { threadId } = req.params;

    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId, user: req.user._id });

        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json({ success: "Thread deleted successfully" });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            error: err.message,
            message: "Failed to delete thread",
        });
    }
});



router.post("/chat",isLoggedIn, async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    try {
        let thread = await Thread.findOne({ threadId, user: req.user._id });

        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                user: req.user._id, // 🔹 assign logged-in user
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getOpenAiApiResponse(message);
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();

        res.json({ reply: assistantReply });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            error: err.message,
            message: "Something went wrong",
        });
    }
});



export default router;