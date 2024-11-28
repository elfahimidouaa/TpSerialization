const fs = require('fs');
const convert = require('xml-js');
const protobuf = require('protobufjs');


const root = protobuf.loadSync('employee.proto');
const EmployeeList = root.lookupType('Employees');

const employees = [];
employees.push({
  id: 1,
  name: 'DOUAA EL FAHIMI',
  salary: 9000,
});
employees.push({
  id: 2,
  name: 'AYA EL FAHIMI',
  salary: 22000,
});
employees.push({
  id: 3,
  name: 'MARWA EL FAHIMI',
  salary: 23000,
});

let jsonObject = { employee: employees };
let jsonData = JSON.stringify(jsonObject, null, 2);

// Serialize to XML
const options = { compact: true, ignoreComment: true, spaces: 2 };
let xmlData = `<root>\n${convert.json2xml(jsonObject, options)}\n</root>`;

// Serialize to Protobuf
let errMsg = EmployeeList.verify(jsonObject);
if (errMsg) {
  throw Error(errMsg);
}

let message = EmployeeList.create(jsonObject); 
let buffer = EmployeeList.encode(message).finish(); 


fs.writeFileSync('data.json', jsonData);
fs.writeFileSync('data.xml', xmlData);
fs.writeFileSync('data.proto', buffer);


const jsonFileSize = fs.statSync('data.json').size;
const xmlFileSize = fs.statSync('data.xml').size;
const protoFileSize = fs.statSync('data.proto').size;


console.log('\n--- Serialized Data ---');
console.log('\nJSON Data:');
console.log(jsonData);

console.log('\nXML Data:');
console.log(xmlData);

console.log('\nProtobuf Binary Data (as Buffer):');
console.log(buffer);

console.log('\n--- File Sizes ---');
console.log(`Taille de 'data.json' : ${jsonFileSize} octets`);
console.log(`Taille de 'data.xml' : ${xmlFileSize} octets`);
console.log(`Taille de 'data.proto' : ${protoFileSize} octets`);
