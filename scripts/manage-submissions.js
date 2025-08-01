#!/usr/bin/env node

const { db } = require('../server/db');
const { workshopRegistrations, contactSubmissions, newsletterSubscriptions } = require('../shared/schema');
const { eq, inArray, lt } = require('drizzle-orm');

const command = process.argv[2];
const table = process.argv[3];
const id = process.argv[4];

async function listSubmissions(tableName) {
  let results;
  switch (tableName) {
    case 'workshops':
      results = await db.select().from(workshopRegistrations).orderBy(workshopRegistrations.createdAt);
      break;
    case 'contacts':
      results = await db.select().from(contactSubmissions).orderBy(contactSubmissions.createdAt);
      break;
    case 'newsletters':
      results = await db.select().from(newsletterSubscriptions).orderBy(newsletterSubscriptions.createdAt);
      break;
    default:
      console.log('Invalid table. Use: workshops, contacts, or newsletters');
      return;
  }
  
  console.log(`\n${tableName.toUpperCase()} SUBMISSIONS:`);
  console.log('='.repeat(50));
  results.forEach((item, index) => {
    console.log(`${index + 1}. ID: ${item.id}`);
    if (item.name) console.log(`   Name: ${item.name}`);
    if (item.email) console.log(`   Email: ${item.email}`);
    if (item.message) console.log(`   Message: ${item.message.substring(0, 50)}...`);
    console.log(`   Created: ${item.createdAt}`);
    console.log('');
  });
  console.log(`Total: ${results.length} submissions`);
}

async function deleteSubmission(tableName, submissionId) {
  let result;
  switch (tableName) {
    case 'workshops':
      result = await db.delete(workshopRegistrations).where(eq(workshopRegistrations.id, parseInt(submissionId)));
      break;
    case 'contacts':
      result = await db.delete(contactSubmissions).where(eq(contactSubmissions.id, parseInt(submissionId)));
      break;
    case 'newsletters':
      result = await db.delete(newsletterSubscriptions).where(eq(newsletterSubscriptions.id, parseInt(submissionId)));
      break;
    default:
      console.log('Invalid table. Use: workshops, contacts, or newsletters');
      return;
  }
  
  if (result.rowCount > 0) {
    console.log(`✅ Deleted ${tableName} submission with ID ${submissionId}`);
  } else {
    console.log(`❌ No ${tableName} submission found with ID ${submissionId}`);
  }
}

async function deleteByEmail(tableName, email) {
  let result;
  switch (tableName) {
    case 'workshops':
      result = await db.delete(workshopRegistrations).where(eq(workshopRegistrations.email, email));
      break;
    case 'contacts':
      result = await db.delete(contactSubmissions).where(eq(contactSubmissions.email, email));
      break;
    case 'newsletters':
      result = await db.delete(newsletterSubscriptions).where(eq(newsletterSubscriptions.email, email));
      break;
    default:
      console.log('Invalid table. Use: workshops, contacts, or newsletters');
      return;
  }
  
  console.log(`✅ Deleted ${result.rowCount} ${tableName} submissions for email: ${email}`);
}

async function deleteOldSubmissions(tableName, days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  let result;
  switch (tableName) {
    case 'workshops':
      result = await db.delete(workshopRegistrations).where(lt(workshopRegistrations.createdAt, cutoffDate));
      break;
    case 'contacts':
      result = await db.delete(contactSubmissions).where(lt(contactSubmissions.createdAt, cutoffDate));
      break;
    case 'newsletters':
      result = await db.delete(newsletterSubscriptions).where(lt(newsletterSubscriptions.createdAt, cutoffDate));
      break;
    default:
      console.log('Invalid table. Use: workshops, contacts, or newsletters');
      return;
  }
  
  console.log(`✅ Deleted ${result.rowCount} old ${tableName} submissions (older than ${days} days)`);
}

async function clearAll(tableName) {
  let result;
  switch (tableName) {
    case 'workshops':
      result = await db.delete(workshopRegistrations);
      break;
    case 'contacts':
      result = await db.delete(contactSubmissions);
      break;
    case 'newsletters':
      result = await db.delete(newsletterSubscriptions);
      break;
    default:
      console.log('Invalid table. Use: workshops, contacts, or newsletters');
      return;
  }
  
  console.log(`⚠️  Deleted ALL ${result.rowCount} ${tableName} submissions`);
}

// Main execution
async function main() {
  try {
    switch (command) {
      case 'list':
        await listSubmissions(table);
        break;
      case 'delete':
        if (!id) {
          console.log('Usage: node manage-submissions.js delete <table> <id>');
          return;
        }
        await deleteSubmission(table, id);
        break;
      case 'delete-email':
        if (!process.argv[4]) {
          console.log('Usage: node manage-submissions.js delete-email <table> <email>');
          return;
        }
        await deleteByEmail(table, process.argv[4]);
        break;
      case 'delete-old':
        const days = process.argv[4] || 30;
        await deleteOldSubmissions(table, parseInt(days));
        break;
      case 'clear':
        await clearAll(table);
        break;
      default:
        console.log(`
Database Submission Manager

Usage:
  node manage-submissions.js list <table>                    - List all submissions
  node manage-submissions.js delete <table> <id>            - Delete specific submission
  node manage-submissions.js delete-email <table> <email>   - Delete by email
  node manage-submissions.js delete-old <table> [days]      - Delete old submissions
  node manage-submissions.js clear <table>                  - Delete ALL submissions

Tables: workshops, contacts, newsletters

Examples:
  node manage-submissions.js list workshops
  node manage-submissions.js delete workshops 123
  node manage-submissions.js delete-email workshops spam@example.com
  node manage-submissions.js delete-old workshops 7
  node manage-submissions.js clear workshops
        `);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

main(); 