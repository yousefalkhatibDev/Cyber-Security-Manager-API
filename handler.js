'use strict';
const server = require('./server')
const Serverless = require('serverless')
module.exports.ReconTrails = new Serverless(server);
// module.exports.ReconTrails = async (event) => {
//     return {
//         statusCode: 200,
//         body: JSON.stringify(
//             {
//                 message: "hi there, i am ahmad",
//                 input: event
//             },
//             null,
//             2
//         ),
//     };
// };
