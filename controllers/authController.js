import User from '../models/User.js';
import { createOrUpdateUser } from '../services/authService.js';

export const telegramAuth = async (req, res) => {
    const initData = req.body;
    const referrerId = req.body.start_param;

    if (!initData.user || !initData.user.id || !initData.user.username) {
        return res.status(400).json({ success: false, message: 'Invalid data' });
    }

    try {
        const user = await createOrUpdateUser(initData.user, referrerId);
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getUserByUsername = async (req, res) => {
    const {usernames } = req.body;

    if (!usernames || !Array.isArray(usernames) || usernames.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid or missing usernames' });
    }

    try {
        const users = await User.find({ username: { $in: usernames } });

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'No users found' });
        }

        return res.json({ success: true, users });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}
