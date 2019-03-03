var mysql = require("mysql"); //npm init and add as dependencies
var inquirer = require("inquirer");
//var prompt = require("prompt"); //probably no
var Table = require("cli-table");

var connection = mysql.createConnection({
host: "localhost",
port: 3306,
user: "root",
password: "Getlean6*",
database: "bamazon_db"
});

//connecting to the mysql database and server
connection.connect(function(err) {
if (err) throw err;
console.log("connected as id " + connection.threadId);
start();
});

//or var start = function()
function start() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, response){
        if (err) throw err;
        
        //use the npm cli-tyable to make it look neat and more presentable
        var table = new Table({
            head: ["Item ID", "Product Name", "Department Name", "Price", "Stock Quantity"],
            columnWidths: [6,26,10,8,6]
        });
        for (var i = 0; i < response.length; i++) { //change to res
            table.push([
                response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity,
            ]);
        }
        console.log(table.toString());
//prompt to encourage people to spend money
        inquirer.prompt([
            {
                name:"item_id",
                type:"input",
                message:"What is the ID number of the item you would like to purchase?",
                validate: function(value) {
                    //This function returns true if the value equates to NaN. Otherwise it returns false.
                    if (isNaN(value) == false) {
                        return true
                    } else {
                        return false;
                    }
                }
            }, {
                name:"stock_quantity",
                type:"input",
                message:"How many items would you like to purchase?",
                validate: function(value) {
                    if (isNaN(value) == false) {
                        return true
                    } else {
                        return false;
                    }
                }
            } 
        ]) .then(function(response){
            
            //console.log(JSON.stringify(response));
            //var quantity = parseInt(response.quantity);
            //var itemId = parseInt(response.id);
            //pOrder(itemId, quantity);
            console.log(JSON.stringify(response));
            console.log(response.stock_quantity)
            var quantity = response.stock_quantity; //change to response
            var itemId = response.item_id;
            pOrder(itemId, quantity);
        });
        function pOrder(id, moneyAmount) {
       
            connection.query("SELECT * FROM products WHERE item_id=?", [id], function(err,response){
                if(err){console.log(err)};
                console.log(response)
                if(moneyAmount <= response[0].stock_quantity){
                    var finalCost = response[0].price * moneyAmount;
                    console.log("Thanks we have your order in stock!");
                    console.log("Your final cost for " + moneyAmount + " " + response[0].product_name + " is " + finalCost + " Thank you for your purchase!");

                    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [response[0].stock_quantity - moneyAmount, id]);
                    
                    //connection.query("UPDATE items SET stock_quantity = ? WHERE item_id = ?", [stock_quantity - moneyAmount, id]);

                } else{
                    console.log("Insufficient quantity!, sorry we are running low on the " + response[0].product_name + " please try again later so we can complete and fulfill your order.");

                };
                start();
            })
        }

    });
}
//use mysql  npm find doc and look at passing variables into query