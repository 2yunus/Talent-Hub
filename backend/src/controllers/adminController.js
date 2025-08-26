// Basic admin controller with stats and listings

const getStats = async (req, res) => {
  try {
    const prisma = req.prisma;
    const [users, jobs, applications] = await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.application.count()
    ]);

    res.json({ users, jobs, applications });
  } catch (error) {
    console.error('Admin getStats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const listUsers = async (req, res) => {
  try {
    const prisma = req.prisma;
    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true }
    });
    res.json({ users });
  } catch (error) {
    console.error('Admin listUsers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { id } = req.params;
    const { role } = req.body;
    if (!['ADMIN', 'EMPLOYER', 'DEVELOPER'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await prisma.user.update({ where: { id }, data: { role } });
    res.json({ user });
  } catch (error) {
    console.error('Admin updateUserRole error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const listJobs = async (req, res) => {
  try {
    const prisma = req.prisma;
    const jobs = await prisma.job.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ jobs });
  } catch (error) {
    console.error('Admin listJobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const moderateJob = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { id } = req.params;
    const { isActive } = req.body;
    const job = await prisma.job.update({ where: { id }, data: { isActive: Boolean(isActive) } });
    res.json({ job });
  } catch (error) {
    console.error('Admin moderateJob error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const listApplications = async (req, res) => {
  try {
    const prisma = req.prisma;
    const applications = await prisma.application.findMany({
      orderBy: { appliedAt: 'desc' },
      include: {
        job: { select: { id: true, title: true, companyName: true } },
        applicant: { select: { id: true, firstName: true, lastName: true, email: true } }
      }
    });
    res.json({ applications });
  } catch (error) {
    console.error('Admin listApplications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// One-time bootstrap to promote current user to ADMIN with a shared secret
const bootstrapAdmin = async (req, res) => {
  try {
    const secret = req.headers['x-admin-bootstrap-secret'];
    if (!secret || secret !== (process.env.ADMIN_BOOTSTRAP_SECRET || 'changeme')) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const prisma = req.prisma;
    const { userId } = req.body || {};
    if (!userId) {
      return res.status(400).json({ error: 'userId required in body' });
    }
    const user = await prisma.user.update({ where: { id: userId }, data: { role: 'ADMIN' } });
    res.json({ message: 'User promoted to ADMIN', user: { id: user.id, role: user.role } });
  } catch (error) {
    console.error('Admin bootstrap error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { id } = req.params;
    
    // Check if user has applications or posted jobs
    const [applications, postedJobs] = await Promise.all([
      prisma.application.findMany({ where: { applicantId: id } }),
      prisma.job.findMany({ where: { postedById: id } })
    ]);
    
    if (applications.length > 0 || postedJobs.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete user with existing applications or posted jobs' 
      });
    }
    
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin deleteUser error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { id } = req.params;
    
    // Check if job has applications
    const applications = await prisma.application.findMany({ where: { jobId: id } });
    
    if (applications.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete job with existing applications' 
      });
    }
    
    await prisma.job.delete({ where: { id } });
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Admin deleteJob error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getStats,
  listUsers,
  updateUserRole,
  deleteUser,
  listJobs,
  moderateJob,
  deleteJob,
  listApplications,
  bootstrapAdmin
};


