const dns = require('dns');


dns.setServers(['8.8.8.8', '8.8.4.4']);

const srvRecord = '_mongodb._tcp.cluster0.ht3xtyp.mongodb.net';
const hostname = 'cluster0.ht3xtyp.mongodb.net';

console.log('--- Force Resolving with Google DNS (8.8.8.8) ---');

async function getStandardUri() {
    try {
        
        const srvs = await new Promise((resolve, reject) => {
            dns.resolveSrv(srvRecord, (err, recs) => err ? reject(err) : resolve(recs));
        });

        
        const txts = await new Promise((resolve, reject) => {
            dns.resolveTxt(hostname, (err, recs) => err ? reject(err) : resolve(recs));
        });

        const hosts = srvs.map(s => `${s.name}:${s.port}`).join(',');
        const options = txts.flat().join('&');

        console.log('\n✅ Found your Cluster Hosts!');
        console.log('\nUse this connection string in your .env file:');
        console.log('-------------------------------------------');
        
        console.log(`MONGODB_URI=mongodb://vihanballia2004_db_user:F4DeR0P5BeUNuSXj@${hosts}/Recap?${options}&ssl=true`);
        console.log('-------------------------------------------');
        console.log('\nNote: I added "Recap" as the database name. You can change it if needed.');

    } catch (err) {
        console.error('\n❌ Even with Google DNS, it failed:', err.message);
        console.log('This means your network/firewall is blocking connections to MongoDB Atlas completely.');
    }
}

getStandardUri();
