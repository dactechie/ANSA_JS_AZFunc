const  buildTable = require( './buildTable');


module.exports = async function (context, req) {

  // function app : ansa-jsflattener
    context.log('JavaScript HTTP '+req.body.SurveyData+'trigger function processed a request.');
    let sd = JSON.parse(req.body.SurveyData);
    const {   objectArrayTypeKeys,
      objectOfObjectTypeKeys,
      objectOfStringsTypeKeys} = buildTable(sd);
   
      

    const responseMessage = //JSON.stringify(
          {'arrays': objectArrayTypeKeys, 'objs':objectOfObjectTypeKeys, 'strings': objectOfStringsTypeKeys};
          //)
    
    // name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}