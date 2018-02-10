const program = require('commander');
const net = require('net');

function scan(ip, port, callback) {
    // console.log(ip, port)
    // start
    try {
        var client = new net.Socket();
        client.connect(port, ip, function() {
            // console.log('Connected');
            // client.write('Hello, server! Love, Client.');
            client.destroy();
            callback(undefined, true);
        });
    
        client.on('data', function(data) {
            // console.log('Received: ' + data);
            client.destroy(); // kill client after server's response
        });
    
        client.on('close', function() {
            // console.log('Connection closed');
        });
    
        client.on('error', function(err) {
            // console.log(err);
            callback(err);
        });    
    } catch(e) {
        // console.log(e);
        callback(e);
    }
}

// function ip2tuples(ip) {
//     let strs = ip.split('.');
//     return strs.map(str => parseInt(str));
// }

// function tuples2ip(tuples) {
//     return tuples.join('.');
// }

// function inctuples(tuples, i = 3) {
//     tuples[i] += 1;
//     if (tuples[i] >= 256) {
//         tuples[i] = 0;
//         inctuples(tuples, i - 1);
//     }
// }

function ip2int(ip) {
    let strs = ip.split('.');
    return strs.reduce((sum, str) => sum * 256 + parseInt(str), 0);
}

function int2ip(num) {
    let reverse = []
    for (let i = 0; i < 4; i++) {
        let quotient = Math.floor(num / 256);
        let remain = num % 256;
        reverse.push(remain);
        num = quotient;
    }
    reverse.reverse();
    return reverse.join('.');
}

function main() {
    program
        .version('0.1.0')
        .option('-p, --ports <port list>', 'The list of ports to scan, e.g. -p 80,443,21')
        .option('-n, --network <network range>', 'The ip range to scan, e.g. -n 192.168.100.1-192.168.100.254')
        .parse(process.argv);
    if (program.ports == null || program.network == null) program.help();
    let hosts = {};

    let ports = program.ports.split(',');
    let ips = program.network.split('-');
    let start = ip2int(ips[0]);
    let end = ip2int(ips[1]);

    console.log('Start scanning, might take ' + Math.floor((end - start) / 300 + 1) + ' minute(s)');
    let scansleft = 0;
    for (let i = start; i <= end; i++) {
        let ip = int2ip(i);
        for (let port of ports) {
            scansleft += 1;
            scan(ip, parseInt(port), (err, val) => {
                scansleft -= 1;
                if (!err) {
                    let host = hosts[ip];
                    if (host == null) {
                        host = {};
                        hosts[ip] = host;
                    }
                    host[port] = true;
                }
                if (scansleft <= 0) {
                    console.log(hosts);
                }
            })
        }
    }
}

// scan('192.168.10.254', 20);
main();