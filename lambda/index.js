var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var service = new AWS.DynamoDB({apiVersion: '2012-08-10'});

function listAll(callback){
    var params = {
        TableName: "testecursoaws"
    };

    service.scan(params, function(err, data) {
        if (err) {
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({message: err})
            })
        } else {
            var items = []
            data.Items.forEach(function(item) {
               items.push(item.email.S)
            });
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Sucesso!',
                    items: items
                })
            })
        }
    });
}

exports.handler = (event, context, callback) => {

    const email = JSON.parse(event.body).email;

    if(!email){
        callback(null, {
            statusCode: 400,
            body: JSON.stringify({message:'E-mail não informado!'})
        });
        return;
    }
    
    var params = {
        TableName: 'testecursoaws',
        Item: {
            email: {S: email}
        }
    };
    
    service.putItem(params, function(err, data){
        if(err){
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({message: err})
            })
        } else {
            listAll(callback)
        }
    });
};
