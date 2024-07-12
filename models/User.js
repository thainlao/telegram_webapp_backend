import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: String,
    img: String,
    task_text: String,
    status: {
        type: String,
        enum: ['blocked', 'claim', 'done','open'],
        default: function () {
            return this.link && this.link !== '' ? 'open' : 'blocked';
        }
    },
    reward: Number,
    link: String
});

const userSchema = new mongoose.Schema({
    telegramId: {
        type: Number,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    cbkCoins: {
        type: Number,
        default: 40 
    },
    friends: {
        type: [String],
        default: [] 
    },
    lastCollected: {
        type: Date,
        default: null
    },
    referralLink: {
        type: String,
        unique: true
    },
    referrer: {
        type: String,
        default: null
    },
    tasks: {
        type: [taskSchema],
        default: []
    },
    dailyRewardCollected: {
        type: Date,
        default: null
    }
});

const User = mongoose.model('User', userSchema);

export default User;