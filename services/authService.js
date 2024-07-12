import User from '../models/User.js';
import Task from '../models/Task.js';

export const createOrUpdateUser = async (userData, referrerId) => {
    const { id, username } = userData;
    let user = await User.findOne({ telegramId: id });

    if (!user) {
        const tasks = await Task.find();
        user = new User({
            telegramId: id,
            username: username,
            cbkCoins: 40,
            referralLink: `https://t.me/CyberKnightsbEST_bot/CBK_Short_bot/${id}`,
            referrer: referrerId,
            tasks: tasks
        });

        if (referrerId) {
            const referrer = await User.findOne({ telegramId: referrerId });
            if (referrer) {
                if (!referrer.friends.includes(username)) {
                    referrer.cbkCoins += 150;
                    referrer.friends.push(username);
                    await referrer.save();
                    console.log(`Added ${username} to ${referrer.username}'s friends list.`);
                } else {
                    console.log(`${username} is already a friend of ${referrer.username}.`);
                }
            }
        }
        await user.save();
    }
    return user;
};

export const verifyTelegramAuth = (data) => {

    if (!data.user || !data.user.id || !data.user.username) {
        console.log('Invalid data: Missing user information');
        return false;
    }
    
    return true;
};
