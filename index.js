var Web3 = require('web3');

var web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider("ws://localhost:8445"));

var Promise = require('promise');

var express = require('express');
var app = express();

app.get('/', function (req, res) {
   res.send('Hello Eth explorers!');
});

var CONFIRMATION_TIME_IN_BLOCKS = 30; // todo put in config.json
var monitoring_addresses = [];
var monitoring_transactions = [];

app.get('/add_address', function (req, res) {
    var address = req.query.address.toLowerCase();
    //todo add check whether address is valid; regex
    //todo add address if doesnt exist
    monitoring_addresses.push(address);
    console.log(monitoring_addresses);
    res.end(JSON.stringify(monitoring_addresses));
 });

web3.eth.subscribe('newBlockHeaders', function(error, result){
    if (!error) {
        //check whether some transaction is confirmed
        monitoring_transactions.forEach(function(txRecord, index){
            if(result.number - txRecord.blockNumber >= CONFIRMATION_TIME_IN_BLOCKS){
                //todo check getTreansactionRecipet().status
                txRecord.confirmed = true;
                monitoring_transactions[index] = txRecord;
            }
        });
        return;
    }
    console.error("Error in subscription: ", error);
    return;
}).on("data", function(blockHeader){
    web3.eth.getBlock(blockHeader.number).then(function(fullBlock){
        console.log("Get transactions size :"+fullBlock.transactions.length);
        fullBlock.transactions.forEach(function(transaction){
            web3.eth.getTransaction(transaction).then(function(fullTransaction){
                console.log("Check transaction data -> to: ",fullTransaction.to.toLowerCase());
                if(monitoring_addresses.includes(fullTransaction.to.toLowerCase())){
                    monitoring_transactions.push({"hash":transaction,"blockNumber":fullTransaction.blockNumber, "confirmed":false});
                }
                console.log(monitoring_addresses);
                console.log(monitoring_transactions);
            });
        });
        return;
    });
}).on("error", console.error);

async function processBlocks(blockArray) {
    var items = await new Promise.all(blockArray);
    return items;
  }

  async function processTransactions(transactionArray) {
    var items = await new Promise.all(transactionArray);
    return items;
  }

app.get('/process_get', function (req, res) {
    // Prepare output in JSON format
    response = {
       start_block:req.query.first_block,
       end_block:req.query.last_block
    };

    totalBlocks = response.end_block - response.start_block;

    var blockArray = [];
    var transactionArray = [];

    for (var i = 0; i <= totalBlocks; i++) {
        blockArray.push(
            web3.eth.getBlock(i).then(result => {
                return result;
            })
        );
    }

    processBlocks(blockArray).then(function(blocks){
        //console.log(blocks.length);
        for (var i=0; i< blocks.length; i++){
                /*if(blocks[i].transactions.length>0){
                    console.log(blocks[i]);
                }*/
                blocks[i].transactions.forEach(function(transaction){
                    console.log(transaction);
                    transactionArray.push(
                        web3.eth.getTransaction(transaction).then(result => {
                            return result;
                        })
                    );
                });
        }
        processTransactions(transactionArray).then(function(transactions){
            console.log(transactions);
            res.end(JSON.stringify(transactions));
        });
    });

    //res.end(JSON.stringify(response));
 })

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})