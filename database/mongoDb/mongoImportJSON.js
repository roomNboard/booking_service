const childProcess = require('child_process');
const util = require('util');
const path = require('path');

const exec = util.promisify(childProcess.exec);

const csvFolderPath = path.resolve(__dirname, '../../csv/');
const externalCsvFolderPath = '/Volumes/David\\ Data/csv_backup/csv_v1/';

const databaseName = 'booking_service';
const collectionName = 'users';
const numberFiles = 10;
const filePath = Array(numberFiles).fill().map((_, i) => path.resolve(externalCsvFolderPath, `users_${i}.json`));
const commandLine = i => `mongoimport -d ${databaseName} -c ${collectionName} --mode insert --type json --file ${filePath[i]}`;
const mongoImport = async () => {
  for (let i = 0; i < numberFiles; i++) {
    const result = exec(commandLine(i));
    const { stdout, stderr } = await result;
    console.log('stdout', stdout);
    console.log('stderr', stderr);
  }
};
mongoImport().then(() => process.exit(-1));
