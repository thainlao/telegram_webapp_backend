import Task from "../models/Task.js";
import User from "../models/User.js";

export const collectCoins = async (req, res) => {
    const { telegramId } = req.body;

    try {
        const user = await User.findOne({ telegramId });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        //8 hours
        // const now = new Date();
        // const lastCollected = user.lastCollected || new Date(0);
        // const hoursSinceLastCollected = (now - lastCollected) / (1000 * 60 * 60);

        // if (hoursSinceLastCollected < 8) {
        //     const nextAvailableTime = new Date(lastCollected.getTime() + 8 * 60 * 60 * 1000);
        //     return res.json({ success: false, message: 'You can only collect coins once every 8 hours', nextAvailableTime });
        // }

        const now = new Date();
        const lastCollected = user.lastCollected || new Date(0);
        const minutesSinceLastCollected = (now - lastCollected) / (1000 * 60);

        if (minutesSinceLastCollected < 5) {
            const nextAvailableTime = new Date(lastCollected.getTime() + 5 * 60 * 1000);
            return res.json({ success: false, message: 'You can only collect coins once every 5 minutes', nextAvailableTime });
        }

        user.cbkCoins += 10;
        user.lastCollected = now;

        await user.save();

        res.json({ success: true, cbkCoins: user.cbkCoins, lastCollected: user.lastCollected });
    } catch (error) {
        console.error('Error collecting coins:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export const getCollectionStatus = async (req, res) => {
    const { telegramId } = req.body;

    try {
        const user = await User.findOne({ telegramId });

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        //8 hours
        // const now = new Date();
        // const lastCollected = user.lastCollected || new Date(0);
        // const hoursSinceLastCollected = (now - lastCollected) / (1000 * 60 * 60);

        // if (hoursSinceLastCollected < 8) {
        //     const nextAvailableTime = new Date(lastCollected.getTime() + 8 * 60 * 60 * 1000);
        //     return res.json({ canCollect: false, nextAvailableTime });
        // }

        // 5 minutes
        const now = new Date();
        const lastCollected = user.lastCollected || new Date(0);
        const minutesSinceLastCollected = (now - lastCollected) / (1000 * 60);

        // Change the comparison from 8 hours to 5 minutes
        if (minutesSinceLastCollected < 5) {
            const nextAvailableTime = new Date(lastCollected.getTime() + 5 * 60 * 1000); // Calculate next available time in 5 minutes
            return res.json({ canCollect: false, nextAvailableTime });
        }

        res.json({ canCollect: true });
    } catch (error) {
        console.error('Error checking collection status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export const createTask = async (req, res) => {
    const { title, img, task_text, reward, link } = req.body;

    try {
        const newTask = new Task({
            title,
            img,
            task_text,
            reward,
            link,
            status: link && link !== '' ? 'open' : 'blocked'
        });

        await newTask.save();
        await User.updateMany({}, { $push: { tasks: newTask } });

        res.status(201).json({ success: true, task: newTask });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getTasks = async (req, res) => {
    const { telegramId } = req.body;

    try {
        const user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const tasks = await Task.find();

        res.json({ success: true, tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const claimTask = async (req, res) => {
    const { telegramId, taskId } = req.body;

    try {
        const user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userTask = user.tasks.id(taskId);
        if (!userTask) {
            return res.status(404).json({ success: false, message: 'Task not found in user tasks' });
        }

        if (userTask.status !== 'claim') {
            return res.status(400).json({ success: false, message: 'Task is not in claimable status' });
        }

        user.cbkCoins += userTask.reward;
        userTask.status = 'done';

        await user.save();

        res.json({ success: true, cbkCoins: user.cbkCoins, task: userTask });
    } catch (error) {
        console.error('Error claiming task:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateTaskStatus = async (req, res) => {
    const { telegramId, taskId, newStatus } = req.body;
    console.log( telegramId, taskId, newStatus)

    try {
        const user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const task = user.tasks.id(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        console.log('Current task status:', task.status);
        task.status = newStatus;
        console.log('Updated task status:', task.status);
        
        await user.save();
        console.log('User saved with updated task status');
        res.json({ success: true, task });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const collectDailyReward = async (req, res) => {
    const { telegramId } = req.body;

    try {
        const user = await User.findOne({ telegramId });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const now = new Date();
        const lastCollected = user.dailyRewardCollected || new Date(0);
        const hoursSinceLastCollected = (now - lastCollected) / (1000 * 60 * 60);

        if (hoursSinceLastCollected < 24) {
            const nextAvailableTime = new Date(lastCollected.getTime() + 24 * 60 * 60 * 1000);
            return res.json({ success: false, message: 'You can only collect the daily reward once every 24 hours', nextAvailableTime });
        }

        user.cbkCoins += 150;
        user.dailyRewardCollected = now;

        await user.save();

        res.json({ success: true, cbkCoins: user.cbkCoins, dailyRewardCollected: user.dailyRewardCollected });
    } catch (error) {
        console.error('Error collecting daily reward:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export const getDailyRewardStatus = async (req, res) => {
    const { telegramId } = req.body;

    try {
        const user = await User.findOne({ telegramId });

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const now = new Date();
        const lastCollected = user.dailyRewardCollected || new Date(0);
        const hoursSinceLastCollected = (now - lastCollected) / (1000 * 60 * 60);

        if (hoursSinceLastCollected < 24) {
            const nextAvailableTime = new Date(lastCollected.getTime() + 24 * 60 * 60 * 1000);
            return res.json({ canCollect: false, nextAvailableTime });
        }

        res.json({ canCollect: true });
    } catch (error) {
        console.error('Error checking daily reward status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}