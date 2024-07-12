import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

export const startBot = () => {
    bot.start(async (ctx) => {
        const startPayload = ctx.startPayload;
        console.log('Start payload:', startPayload);

        let referrerId = null;
        if (startPayload && startPayload.startsWith('referrerId_')) {
            referrerId = startPayload.split('_')[1];
            console.log('Referrer ID:', referrerId);
        }

        const userData = {
            id: ctx.from.id,
            username: ctx.from.username
        };

        try {
            const response = await axios.post('http://localhost:3000/auth/telegram', {
                user: userData
            }, {
                params: { referrerId }
            });

            if (response.data.success) {
                ctx.reply('Welcome to Cyber Knights! You have been successfully authenticated.');
            } else {
                ctx.reply('Authentication failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            ctx.reply('Server error during authentication. Please try again later.');
        }
    });

    bot.launch().then(() => console.log('Bot started'));
};