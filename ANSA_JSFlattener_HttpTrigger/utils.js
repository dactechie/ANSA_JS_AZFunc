
function stripChars(string, chars) {
  return string.replace(RegExp('['+chars+']','g'), '');
}

function buildTypesLists(surveyData) {
  const listOfStringLists = Object.keys(surveyData).filter(k => {
    const v = surveyData[k];
    return Array.isArray(v) && v.length > 0 && typeof v[0] === "string";
  });

  // const objectArrayTypeKeys = Object.keys(surveyData).filter(k => {
  //   let v = surveyData[k];
  //   return (
  //     Array.isArray(v) &&
  //     typeof v[0] === "object" &&
  //     v[0] !== null &&
  //     Object.keys(v[0]).length > 0
  //   );
  // });
  // data :  { "... ", "AddictiveBehaviours" : { "Gambling": {"YesNo" : False, "Days": 34 }} }
  //result :["Gambling", .. ]
  const objectOfObjectTypeKeys = Object.keys(surveyData).filter(k => {
    let v = surveyData[k];
    if (typeof v === "object") {
      //"AddictiveBehaviours" : { "Gambling": {"YesNo" : False, "Days": 34 }} }
      const keys = Object.keys(v); // ["Gambling" ,..]
      if (keys.length > 0 && typeof v[keys[0]] === "object") {
        return Object.keys(v[keys[0]]).length > 0; //{"YesNo"}
      }
    }
    return false;
  });

  //'How do you spend 
  // Drugs and/or Drinking (sourcing & using)
  const rankedObjectOfObjectTypeKeys = objectOfObjectTypeKeys.filter(k => {
    let v = surveyData[k];
    const keys = Object.keys(v); 
    const inKeys = Object.keys(v[keys[0]]);
    return (inKeys.length > 0)  &&  inKeys.includes("Rank");    
  });
  // objectOfObjectTypeKeys = objectOfObjectTypeKeys.filter( k => {
  //   return !rankedObjectOfObjectTypeKeys.includes(k)
  // })

  return {
    listOfStringLists,

   // objectOfObjectTypeKeys,
    rankedObjectOfObjectTypeKeys
    // 0: "PDC"
    // 1: "OtherAddictiveBehaviours"
    // 2: "Past4WkEngagedInOtheractivities"
    // 3: "HowDoYouSpendTime"
    // 4: "RiskAssessmentCheck"

    //  objectArrayTypeKeys,  //PDC
    // objectOfStringsTypeKeys // []
  };
}
module.exports = { buildTypesLists, stripChars };
