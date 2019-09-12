const mongoClient = require('mongodb').MongoClient
const {ObjectID} = require('mongodb')

module.exports.get = async function() {
    return new Promise ((resolve, reject) => {
        mongoClient.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }, (err, client) => {
            if(err) reject(err)
            client.db()
            .collection('users').find().toArray((err, result) => {
                if(err) reject(err)
                client.close()
                resolve(result)
            })

        })
    })
}

module.exports.getByID = async function(paramsid) {
    return new Promise ((resolve, reject) => {
        const id = new ObjectID(paramsid)
        mongoClient.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }, (err, client) => {
            if(err) reject(err)
            client.db()
            .collection('users').find({_id: id}).toArray((err, result) => {
                if(err) reject(err)
                client.close()
                resolve(result[0])
            })

        })
    })
}

app.get('/users', async (req, res) => {
    const test = await get()
    console.log(test)
    res.render('test', { test})
})