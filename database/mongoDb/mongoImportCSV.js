const childProcess = require('child_process');
const util = require('util');
const path = require('path');

const exec = util.promisify(childProcess.exec);

const csvFolderPath = path.resolve(__dirname, '../../csv/');
let columns = [
  'user_name',
];

const databaseName = 'booking_service';
const collectionName = 'bookings';
const filePath = path.resolve(csvFolderPath, 'testing.csv');
const commandLine = `mongoimport -d ${databaseName} -c ${collectionName} --mode upsert --type csv --file ${filePath} -f ${columns.join(',')}`;
const mongoImport = async () => {
  const result = exec(commandLine);
  const { stdout, stderr } = await result;
  console.log('stdout', stdout);
  console.log('stderr', stderr);
};
mongoImport().then(() => process.exit(-1));
