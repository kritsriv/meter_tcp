// create an empty modbus client
const ModbusRTU = require("modbus-serial");
const vector = {
    getInputRegister: function(addr, unitID) {
        // Synchronous handling
        return addr;
    },
    getHoldingRegister: function(addr, unitID, callback) {
        // Asynchronous handling (with callback)
        setTimeout(function() {
            // callback = function(err, value)
            callback(null, addr + 8000);
        }, 10);
    },
    getCoil: function(addr, unitID) {
        // Asynchronous handling (with Promises, async/await supported)
        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve((addr % 2) === 0);
            }, 10);
        });
    },
    setRegister: function(addr, value, unitID) {
        // Asynchronous handling supported also here
        console.log("set register", addr, value, unitID);
        return;
    },
    setCoil: function(addr, value, unitID) {
        // Asynchronous handling supported also here
        console.log("set coil", addr, value, unitID);
        return;
    },
    readDeviceIdentification: function(addr) {
        return {
            0x00: "MyVendorName",
            0x01: "MyProductCode",
            0x02: "MyMajorMinorRevision",
            0x05: "MyModelName",
            0x97: "MyExtendedObject1",
            0xAB: "MyExtendedObject2"
        };
    }
};

// // set the server to answer for modbus requests
// console.log("ModbusTCP listening on modbus://0.0.0.0:8502");
// const serverTCP = new ModbusRTU.ServerTCP(vector, { host: "0.0.0.0", port: 8502, debug: true, unitID: 1 });

// console.log("ModbusTCP listening on modbus://0.0.0.0:8503");
// const serverTCP1 = new ModbusRTU.ServerTCP(vector, { host: "0.0.0.0", port: 8503, debug: true, unitID: 1 });

// console.log("ModbusTCP listening on modbus://0.0.0.0:8504");
// const serverTCP2 = new ModbusRTU.ServerTCP(vector, { host: "0.0.0.0", port: 8504, debug: true, unitID: 1 });

// console.log("ModbusTCP listening on modbus://0.0.0.0:8505");
// const serverTCP3 = new ModbusRTU.ServerTCP(vector, { host: "0.0.0.0", port: 8505, debug: true, unitID: 1 });

// console.log("ModbusTCP listening on modbus://0.0.0.0:8506");
// const serverTCP4 = new ModbusRTU.ServerTCP(vector, { host: "0.0.0.0", port: 8506, debug: true, unitID: 1 });

// serverTCP.on("socketError", function(err){
//     // Handle socket error if needed, can be ignored
//     console.error(err);
// });

// serverTCP1.on("socketError", function(err){
//     // Handle socket error if needed, can be ignored
//     console.error(err);
// });

// serverTCP2.on("socketError", function(err){
//     // Handle socket error if needed, can be ignored
//     console.error(err);
// });

// serverTCP3.on("socketError", function(err){
//     // Handle socket error if needed, can be ignored
//     console.error(err);
// });

// serverTCP4.on("socketError", function(err){
//     // Handle socket error if needed, can be ignored
//     console.error(err);
// });
let port = 8503
for (let i =0; i< 500; i++) {
    console.log("ModbusTCP listening on modbus://0.0.0.0:"+port);
    new ModbusRTU.ServerTCP(vector, { host: "0.0.0.0", port: port++, debug: true, unitID: 1 });
}