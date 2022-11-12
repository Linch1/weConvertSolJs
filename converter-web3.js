require('./init');
const fs = require('fs');

var files = fs.readdirSync(`${__dirname}/contracts/`);

for( let file of files ){

    let fileName = file.split('.')[0];
    let className = 'Contract' + fileName;

    let abi = JSON.parse(fs.readFileSync(`${__dirname}/contracts/${fileName}.json`)).abi;

    let classFilePath = `${__dirname}/class/web3/${className}.js`;
    let classBuild = `
import Web3Library from "../../lib/Library";

class ${className}{
    constructor( web3, address, setError, setSuccess ) {
        this.web3 = Web3Library.getLib(web3);
        this.address = address;
        this.abi = ${JSON.stringify(abi)}; // TO BE POPULATED
        this.contract = null; // TO BE INTIALIZED
        this.accounts = [];
        this.account = null;
        this.setError = setError ? setError : console.log; 
        this.setSuccess = setSuccess ? setSuccess : console.log; 
    }

    async intialize() {
        this.contract = await new this.web3.eth.Contract( this.abi , this.address );
        this.accounts = await this.web3.eth.getAccounts();
        this.account = this.accounts[0];
    }
    `

    function functionArgsFromAbiElem( elem ){
        let args = [];
        let notNamed = 0;
        for( let arg of elem.inputs ){
            if(!arg.name) {
                args.push(elem.name + notNamed.toString());
                notNamed ++;
            }
            else args.push( arg.name )
        }
        
        return args;
    }
    function getBlockchainInteractionFromAbiElem( elem, args ){
        if( ['pure', 'view'].includes(elem.stateMutability) ){
            return `
        let result = await this.contract.methods.${elem.name}(${args})
        .call()
        .catch( err => { this.setError( err, err.code, err.message ); return null });
        if( !result ) return null;
        this.setSuccess( result );
        return result;`
        
        } else if ( ['payable'].includes(elem.stateMutability) ) {
            return `
        let result = await this.contract.methods.${elem.name}(${args})
        .send({
            from: this.account,
            value: payableValue
        })
        .catch( err => { this.setError( err, err.code, err.message ); return null });
        if( !result ) return null;
        this.setSuccess( result );
        return result;`
        } else {
            return `
        let result = await this.contract.methods.${elem.name}(${args})
        .send({ from: this.account })
        .catch( err => { this.setError( err, err.code, err.message ); return null });
        if( !result ) return null;
        this.setSuccess( result );
        return result;`
        }
    }
    for( let elem of abi ){
        if( elem.type == 'function' ){
            let args = functionArgsFromAbiElem(elem).join(", ");
            let isPayable = ['payable'].includes(elem.stateMutability);
            
            classBuild += `
    async ${elem.name}(${ args + ( args && isPayable ? ', ' : '' ) } ${ isPayable ? 'payableValue' : '' }){
        if(!this.contract) await this.intialize();
        ${ getBlockchainInteractionFromAbiElem( elem, args ) }
    }
    `
        }
    }

    classBuild += `
}

export default ${className};
`;

    fs.writeFileSync( classFilePath, classBuild );

}
