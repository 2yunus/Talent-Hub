# 🚀 Quick Setup for New Devices

This guide is specifically for setting up TalentHub on a new device to avoid the Prisma initialization error.

## ⚡ Quick Fix (If you're getting the Prisma error)

If you see this error:
```
Error: @prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.
```

Run this command from the project root:
```bash
npm run setup
```

This will automatically:
1. Install dependencies
2. Generate Prisma client
3. Push database schema
4. Seed the database

## 🔧 Complete Setup (Recommended)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd talenthub
npm run install:all
```

### 2. Environment Setup
```bash
cp env.example .env
# Edit .env with your database connection
```

### 3. Run Setup Script
```bash
npm run setup
```

### 4. Start Development
```bash
npm run dev
```

## 🎯 What the Setup Script Does

The `npm run setup` command automatically runs:

- `npm install` - Install backend dependencies
- `npx prisma generate` - Generate Prisma client (fixes the initialization error)
- `npx prisma db push` - Push database schema
- `node prisma/seed.js` - Seed with sample data

## 🚨 Common Issues

### Prisma Client Not Generated
```bash
cd backend
npm run prisma:generate
```

### Database Connection Failed
- Check your `.env` file has correct `DATABASE_URL`
- Ensure your database is running
- Verify credentials and permissions

### Port Already in Use
Change the port in `.env` or kill the process using the port.

## ✅ Success Indicators

After running `npm run setup`, you should see:
- ✅ Setup complete message
- No Prisma initialization errors
- Database tables created
- Sample data seeded

## 🆘 Still Having Issues?

1. Check the main [SETUP.md](./SETUP.md) for detailed troubleshooting
2. Ensure Node.js version is 18+ (`node --version`)
3. Verify database connection string format
4. Check firewall/network settings

---

**The setup script prevents the Prisma error by ensuring the client is generated before the server starts! 🎉**
