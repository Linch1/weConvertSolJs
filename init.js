const fs = require('fs');
if (!fs.existsSync(`${__dirname}/contracts/`)){
    fs.mkdirSync(`${__dirname}/contracts/`);
}
if (!fs.existsSync(`${__dirname}/class/`)){
    fs.mkdirSync(`${__dirname}/class/`);
}
if (!fs.existsSync(`${__dirname}/class/ethers`)){
    fs.mkdirSync(`${__dirname}/class/ethers`);
}
if (!fs.existsSync(`${__dirname}/class/web3`)){
    fs.mkdirSync(`${__dirname}/class/web3`);
}