const Users = require(".userModel");
var svm = require('node-svm');

// TODO: Get user to predict's categories
Users.find({}, (err, categories) => {
    if (err || !categories) {
        return res.status(400).send("error");
    }
    return res.status(200).send(categories);
});

// TODO: Preprocess features and create vector to predict
vectorToPredict = [0, 0, 0];

// Load training set
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('../svmTraining.txt')
});

var svmTraining = []
lineReader.on('line', function (line) {
    values = line.split(',')
    valuesLabel = values[3];
    valuesXlist = [values[0], values[1], values[2]]
    svmTraining = [valuesXlist, valuesLabel];
});

// var xor = [
//     [[0, 0], 0],
//     [[0, 1], 1],
//     [[1, 0], 1],
//     [[1, 1], 0]
// ];

// Initialize a new predictor
var clf = new svm.CSVC();

clf.train(svmTraining).done(function () {
    // Predict user's 'liked' kitchen based on 'liked' recipes
    var prediction = clf.predictSync(vectorToPredict);
    // TODO: Send prediction result to database

    // svmTraining.forEach(function (ex) {
    //     var prediction = clf.predictSync(ex[0]);
    //     console.log('%d XOR %d => %d', ex[0][0], ex[0][1], prediction);
    // });
});