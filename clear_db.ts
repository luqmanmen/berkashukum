import { config } from 'dotenv';
config();

async function clearData() {
  console.log('Loading prisma...');
  const { prisma } = await import('./src/lib/prisma');
  console.log('Clearing database...');
  try {
    // Delete in order to respect foreign keys
    await prisma.orderItem.deleteMany({});
    console.log('Deleted all OrderItems');
    
    await prisma.order.deleteMany({});
    console.log('Deleted all Orders');
    
    await prisma.product.deleteMany({});
    console.log('Deleted all Products');
    
    await prisma.article.deleteMany({});
    console.log('Deleted all Articles');
    
    await prisma.activityLog.deleteMany({});
    console.log('Deleted all ActivityLogs');
    
    console.log('Database cleared successfully.');
  } catch (e) {
    console.error('Error clearing database:', e);
  } finally {
    process.exit(0);
  }
}

clearData();
