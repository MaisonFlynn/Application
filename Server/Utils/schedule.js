const cron = require('node-cron');
const User = require('../Models/User');

// Delete NON Verified User(s) IF NOT Verified AFTER 7 DAYS
// Check EVERY Night @ 12AM
cron.schedule('0 0 * * *', async () => {
    console.log('Deleting NON Verified User(s)');
    const expiration = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);  // 7 Day(s)
    try {
        const result = await User.deleteMany({
            verified: false,
            registered: { $lt: expiration }
        });
        console.log(`Deleted ${result.deletedCount} NON Verified User(s)`);
    } catch (error) {
        console.error('Schedule Error', error);
    }
});

// Delete EXPIRED Session(s) IF Older THAN 1 DAY
// Check EVERY Night @ 12AM
cron.schedule('0 0 * * *', async () => {
    console.log('Deleting Expired Session(s)');
    const expiration = new Date(Date.now() - 24 * 60 * 60 * 1000);  // 1 Day
    try {
        const result = await User.updateMany(
            { session: { $lt: expiration } },
            { $unset: { sessionToken: "", session: "" } }
        );
        console.log(`Deleted ${result.nModified} Session(s)`);
    } catch (error) {
        console.error('Schedule Error', error);
    }
});