
import {ethers} from "ethers";

class ContractToken{
    constructor( provider, signer, address, setError, setSuccess ) {
        this.provider = provider;
        this.address = address;
        this.abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]; // TO BE POPULATED
        this.contract = null; // TO BE INTIALIZED
        this.signer = signer;
        this.setError = setError ? setError : console.log; 
        this.setSuccess = setSuccess ? setSuccess : console.log; 
    }

    async intialize() {
        this.contract = await new ethers.Contract(  this.address, this.abi, this.signer );
    }
    
    async allowance(owner, spender ){
        if(!this.contract) await this.intialize();
        
        let result = await this.contract.allowance(owner, spender)
        .catch( err => { this.setError( err, err.code, err.message ); return null });

        if( result == null || result == undefined ) return null;
        this.setSuccess( result );
        return result;
    }
    
    async approve(spender, amount ){
        if(!this.contract) await this.intialize();
        
        let result = await this.contract.approve(spender, amount)
        .catch( err => { this.setError( err, err.code, err.message ); return null });

        if( result == null || result == undefined ) return null;
        this.setSuccess( result );
        return result;
    }
    
    async balanceOf(account ){
        if(!this.contract) await this.intialize();
        
        let result = await this.contract.balanceOf(account)
        .catch( err => { this.setError( err, err.code, err.message ); return null });

        if( result == null || result == undefined ) return null;
        this.setSuccess( result );
        return result;
    }
    
    async totalSupply( ){
        if(!this.contract) await this.intialize();
        
        let result = await this.contract.totalSupply()
        .catch( err => { this.setError( err, err.code, err.message ); return null });

        if( result == null || result == undefined ) return null;
        this.setSuccess( result );
        return result;
    }
    
    async transfer(to, amount ){
        if(!this.contract) await this.intialize();
        
        let result = await this.contract.transfer(to, amount)
        .catch( err => { this.setError( err, err.code, err.message ); return null });

        if( result == null || result == undefined ) return null;
        this.setSuccess( result );
        return result;
    }
    
    async transferFrom(from, to, amount ){
        if(!this.contract) await this.intialize();
        
        let result = await this.contract.transferFrom(from, to, amount)
        .catch( err => { this.setError( err, err.code, err.message ); return null });

        if( result == null || result == undefined ) return null;
        this.setSuccess( result );
        return result;
    }
    
}

export default ContractToken;
