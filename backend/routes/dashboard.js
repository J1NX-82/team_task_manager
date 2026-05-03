const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req, res) => {
  try {
    let tasksFilter = {};
    if (req.user.role !== 'ADMIN') {
      tasksFilter.assignedToId = req.user.id;
    }

    const totalTasks = await prisma.task.count({ where: tasksFilter });
    
    const tasksByStatus = await prisma.task.groupBy({
      by: ['status'],
      _count: true,
      where: tasksFilter
    });

    const overdueTasks = await prisma.task.count({
      where: {
        ...tasksFilter,
        dueDate: { lt: new Date() },
        status: { not: 'DONE' }
      }
    });

    // tasks per user
    let tasksPerUser = [];
    if (req.user.role === 'ADMIN') {
      tasksPerUser = await prisma.task.groupBy({
        by: ['assignedToId'],
        _count: true,
        where: { assignedToId: { not: null } }
      });

      // Populate user names
      const userIds = tasksPerUser.map(t => t.assignedToId);
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true }
      });
      
      tasksPerUser = tasksPerUser.map(t => ({
        count: t._count,
        user: users.find(u => u.id === t.assignedToId)?.name || 'Unknown'
      }));
    }

    res.json({
      totalTasks,
      tasksByStatus: tasksByStatus.reduce((acc, curr) => {
        acc[curr.status] = curr._count;
        return acc;
      }, { TODO: 0, IN_PROGRESS: 0, DONE: 0 }),
      overdueTasks,
      tasksPerUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
