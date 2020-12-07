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
  // const objectOfStringsTypeKeys = Object.keys(surveyData).filter(k => {
  //   let v = surveyData[k]; // mhealthnotes : {...}
  //   if (typeof v === "object") {
  //     const values = Object.values(v); // ["mental_issues" , "goals"]
  //     return typeof v[0] === "undefined" && typeof values[0] === "string";
  //   }
  //   return false;
  // });
  //console.log("objectOfStringsTypeKeys", this.objectOfStringsTypeKeys);

  return {
    listOfStringLists,

    objectOfObjectTypeKeys
    // 0: "PDC"
    // 1: "OtherAddictiveBehaviours"
    // 2: "Past4WkEngagedInOtheractivities"
    // 3: "HowDoYouSpendTime"
    // 4: "RiskAssessmentCheck"

    //  objectArrayTypeKeys,  //PDC
    // objectOfStringsTypeKeys // []
  };
}
module.exports = { buildTypesLists };
