var Web3 = require('web3');
//var web3 = new Web3();
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");
//web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));

var Promise = require('promise');

var express = require('express');
var app = express();

app.get('/', function (req, res) {
   res.send('Hello Eth explorers!');
})

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
