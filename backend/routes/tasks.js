const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Create task (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, description, dueDate, priority, projectId, assignedToId } = req.body;
  
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'MEDIUM',
        projectId,
        assignedToId
      },
      include: {
        assignedTo: { select: { id: true, name: true } }
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task
router.put('/:id', authMiddleware, async (req, res) => {
  const { status, title, description, priority, assignedToId } = req.body;
  
  try {
    const taskToUpdate = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!taskToUpdate) return res.status(404).json({ error: 'Task not found' });

    // Admins can update anything. Members can only update their assigned tasks status.
    if (req.user.role !== 'ADMIN') {
      if (taskToUpdate.assignedToId !== req.user.id) {
        return res.status(403).json({ error: 'You can only update tasks assigned to you' });
      }
      
      // If member, only allow status update
      const updatedTask = await prisma.task.update({
        where: { id: req.params.id },
        data: { status },
        include: { assignedTo: { select: { id: true, name: true } } }
      });
      return res.json(updatedTask);
    }

    // Admin update
    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        status,
        priority,
        assignedToId
      },
      include: { assignedTo: { select: { id: true, name: true } } }
    });
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete task (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
