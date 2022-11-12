require('./init');
const fs = require('fs');


var files = fs.readdirSync(`${__dirname}/contracts/`);


for( let file of files ){

    let fileName = file.split('.')[0];
    let className = 'Contract' + fileName;

    let abi = JSON.parse(fs.readFileSync(`${__dirname}/contracts/${fileName}.json`)).abi;

    let classFilePath = `${__dirname}/class/ethers/${className}.js`;
    let classBuild = `
import {ethers} from "ethers";

class ${className}{
    constructor( provider, signer, address, setError, setSuccess ) {
        this.provider = provider;
        this.address = address;
        this.abi = ${JSON.stringify(abi)}; // TO BE POPULATED
        this.contract = null; // TO BE INTIALIZED
        this.signer = signer;
        this.setError = setError ? setError : console.log; 
        this.setSuccess = setSuccess ? setSuccess : console.log; 
    }

    async intialize() {
        this.contract = await new ethers.Contract(  this.address, this.abi, this.signer );
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
        let result = await this.contract.${elem.name}(${args})
        .catch( err => { this.setError( err, err.code, err.message ); return null });

        if( result == null || result == undefined ) return null;
        this.setSuccess( result );
        return result;`
        
        } else if ( ['payable'].includes(elem.stateMutability) ) {
            return `
        let result = await this.contract.${elem.name}(${ args + ( args  ? ', ' : '' ) } { value: payableValue })
        .catch( err => { this.setError( err, err.code, err.message ); return null });

        if( result == null || result == undefined ) return null;
        this.setSuccess( result );
        return result;`
        } else {
            return `
        let result = await this.contract.${elem.name}(${args})
        .catch( err => { this.setError( err, err.code, err.message ); return null });

        if( result == null || result == undefined ) return null;
        this.setSuccess( result );
        return result;`
        }
    }
    for( let elem of abi ){
        if( elem.type == 'function' ){
            let args = functionArgsFromAbiElem(elem).join(", ").trim();
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
