// "QuantifiableMappings": {
//   "Past4WkDailyLivingImpacted":"NotAtAll_Daily",
//   "Past4WkDifficultyFindingHousing":"NotAtAll_Daily",
const lookups = require("./lookups");

function mapQuantifiables(data, quantifiableMappings) {
  const results = {};
  const mappingKeys = Object.keys(quantifiableMappings); //["Past4WkDailyLivingImpacted", "Past4WkDifficultyFindingHousing"]
  Object.keys(data)
  .filter(dataKey => mappingKeys.includes(dataKey))
  .forEach(k => {
    const mappingType = quantifiableMappings[ k ]; //NotAtAll_Extremely
    // "NotAtAll_Extremely": {
    //   "Not At all": 0,
    // lookups[ "Daily_NotAtAll"  => {... } =>   [ "Not at all"] =>  4,
    results[k] =   lookups[mappingType] [ data[k] ]; //data["Past4WkDailyLivingImpacted"] = > Less than wekkely
  });
  return results;
}

function stripChars(string, chars) {
  return string.replace(RegExp('['+chars+']','g'), '');
}

function buildTypesLists(surveyData) {
  const listOfStringLists = Object.keys(surveyData).filter(k => {
    const v = surveyData[k];
    return Array.isArray(v) && v.length > 0 && typeof v[0] === "string";
  });

  /*
  The main differences are:

matrixTypeKeys explicitly checks v.length > 0 while objectArrayTypeKeys implicitly requires this through v[0] access
objectArrayTypeKeys additionally checks that the first object has properties (Object.keys(v[0]).length > 0)


   The key difference is in how they handle empty objects:

For [{}]:

objectArrayTypeKeys returns false (requires object to have properties)
matrixTypeKeys returns true (accepts empty objects)

So matrixTypeKeys is more permissive - it will include arrays containing empty objects, while objectArrayTypeKeys requires the objects to have at least one property.
  */
  const objectArrayTypeKeys = Object.keys(surveyData).filter(k => {
    let v = surveyData[k];
    return (
      Array.isArray(v) &&
      typeof v[0] === "object" &&
      v[0] !== null &&
      Object.keys(v[0]).length > 0
    );
  });

  const matrixTypeKeys = Object.keys(surveyData).filter(k => {
    const v = surveyData[k];
    return (
      Array.isArray(v) && 
      v.length > 0 && 
      typeof v[0] === "object" &&
      v[0] !== null
    );
  });

  return {
    listOfStringLists,
    objectArrayTypeKeys,
    matrixTypeKeys
  };
}

function addCheckMark(surveyData, fullCheckLists) {
  let moddedChecklists = {};  

  for (const [listName, fullList] of Object.entries(fullCheckLists)) {
    const checkedValues = surveyData[listName];
    
    moddedChecklists[listName] = {};
    if (typeof checkedValues ==="undefined")
      continue;
    fullList.forEach(v => {
      if(checkedValues.includes(v))
        moddedChecklists[listName][v] = "y";
      else
        moddedChecklists[listName][v] = " ";
      
    });  
  }

  return moddedChecklists;
}
module.exports = { buildTypesLists, stripChars, addCheckMark, mapQuantifiables };
