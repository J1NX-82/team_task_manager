const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all projects
router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        _count: {
          select: { tasks: true, members: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single project
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true } }
          }
        },
        tasks: {
          include: {
            assignedTo: { select: { id: true, name: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create project (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description, memberIds } = req.body;
  
  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        creatorId: req.user.id,
        members: {
          create: memberIds?.map(userId => ({ userId })) || []
        }
      }
    });
    
    // Add creator as member if not already in memberIds
    if (!memberIds?.includes(req.user.id)) {
      await prisma.projectMember.create({
        data: { projectId: project.id, userId: req.user.id }
      });
    }

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project members (Admin only)
router.post('/:id/members', authMiddleware, adminMiddleware, async (req, res) => {
  const { userId } = req.body;
  
  try {
    const member = await prisma.projectMember.create({
      data: {
        projectId: req.params.id,
        userId
      }
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id/members/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await prisma.projectMember.delete({
      where: {
        userId_projectId: {
          projectId: req.params.id,
          userId: req.params.userId
        }
      }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
