import { Router } from 'express';
import { claimTask, collectCoins, collectDailyReward, createTask, getCollectionStatus, getDailyRewardStatus, getTasks, updateTaskStatus } from '../controllers/userController.js';
import { getUserByUsername } from '../controllers/authController.js';
const router = Router();

//collect coins
router.post('/collect-coins', collectCoins);

//get coins status
router.post('/collection-status', getCollectionStatus);

//get user data by username
router.post('/get-user-by-username', getUserByUsername)

router.post('/tasks', getTasks);
router.post('/claim-task', claimTask);
router.post('/update-task-status', updateTaskStatus);
router.post('/create-task', createTask);

// Collect daily reward
router.post('/collect-daily-reward', collectDailyReward);

// Get daily reward status
router.post('/daily-reward-status', getDailyRewardStatus);

export default router;