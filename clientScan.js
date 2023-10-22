// create an empty modbus client
const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();
var fs = require('fs');
var meters = require('./meters.json')
const mbsId       = 1;
const mbsTimeout  = 2000;
let logger = []
function byteToLong(arr) {
    return (arr[0] << 16) & 0xFFFF ||  arr[1]
}
//==============================================================
async function connectClient (mbsHost, mbsPort, id)
{
    // close port (NOTE: important in order not to create multiple connections)
    client.close(()=>{
        console.log('clear connection')
    });

    // set requests parameters
    client.setID      (id);
    client.setTimeout (mbsTimeout);

    // try to connect
    try {
        await client.connectTCP (mbsHost, { port: mbsPort })
        let L1L2Voltage = await client.readHoldingRegisters(0x2a, 2);//l1-l2 v
        let L2L3Voltage = await client.readHoldingRegisters(0x2c, 2);//l2-l3 v
        let L3L1Voltage = await client.readHoldingRegisters(0x2e, 2);//l3-l1 v
        let frequency = await client.readHoldingRegisters(0x28, 2); 

        let L1PF1 = await client.readHoldingRegisters(0x08, 2);//l1pf1
        let L2PF1 = await client.readHoldingRegisters(0, 2);//l2pf1
        let L3PF3 = await client.readHoldingRegisters(0, 2);//l3pf3
        let ActivePower = await client.readHoldingRegisters(0, 2);//active power

        let data = {
            Timestamp: new Date().toLocaleString(),
            IP: mbsHost,
            Port: mbsPort,
            ID: mbsId,
            L1L2Voltage: byteToLong(L1L2Voltage.data)/10,
            L2L3Voltage: byteToLong(L2L3Voltage.data)/10,
            L3L1Voltage: byteToLong(L3L1Voltage.data)/10,
            frequency: byteToLong(frequency.data)/10,
            L1PF1: byteToLong(L1PF1.data)/10,
            L2PF2: byteToLong(L2PF1.data)/10,
            L3PF3: byteToLong(L3PF3.data)/10,
            ActivePower: byteToLong(ActivePower.data),
        }

        console.log(data);
        logger.push(data)
    } catch(ex) {
        let data = {
            Timestamp: new Date().toLocaleString(),
            IP: mbsHost,
            Port: mbsPort,
            ID: mbsId,
            Error: ex
        }
        console.log(data)
        logger.push(data)
    }
};



async function  main() {

    console.log(meters)

    for (let i=0; i< meters.length;i++) {
        await connectClient(meters[i].ip, meters[i].port, meters[i].id);
    }

    fs.writeFile('logger.json', JSON.stringify(logger), 'utf8', ()=>{});

    // let port = 8503
    // for  (let i=0; i < 501; i++) {
    //     console.log(`Loop modbus connection ${i}`)
    //     await connectClient("127.0.0.1", port++);
    // } 
}

main()