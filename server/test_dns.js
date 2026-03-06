const dns = require('dns');

const srvRecord = '_mongodb._tcp.cluster0.ht3xtyp.mongodb.net';

console.log(`Checking DNS SRV record for: ${srvRecord}`);

dns.resolveSrv(srvRecord, (err, addresses) => {
    if (err) {
        console.error('DNS Resolution Failed:', err);
        console.log('\n--- Why this happens ---');
        console.log('1. Your network (ISP or Router) might be blocking SRV records.');
        console.log('2. Your current IP might not be whitelisted in MongoDB Atlas.');
        console.log('\n--- Suggested Fixes ---');
        console.log('1. Use the "Standard Connection String" (the long one with multiple hosts) in Atlas.');
        console.log('2. Try changing your DNS to Google (8.8.8.8) or Cloudflare (1.1.1.1).');
        return;
    }
    console.log('Found Addresses:', addresses);
});
