

const { stripChars } = require("./utils");
/**  Function : e0e1Old(dict, e0Key)
 *   Sample call : e0e1Old(body,"HowDoYouSpendTime",  "area")
    ** INPUT **
      HowDoYouSpendTime:
        Looking after children:
          Rank: "15"

        Other caregiving activities:
          Rank: 2

        Paid Work:
          Rank: "4"
          
    ** OUTPUT **
      [
        0: {area: "Paid Work",  Rank: 5 }
        1: {area: "Study - college, school or vocational education", Rank: 3}
        2: {area: "Voluntary Work", Rank: "7"}
      ] 
    */
function e0e1Old(dict, e0Key) {
  if (!dict) return [];

  return Object.entries(dict)
    .map(e => {
      return { [e0Key]: e[0], ...e[1] };
    })
    .filter(e => e);
}

function meld(mainKey, subDict) {
  let result = {};
  Object.entries(subDict).forEach(k => {
    
    if (mainKey.search(",")>0)
      mainKey = mainKey.substr(0, mainKey.search(","));

    let keyName = stripChars(`${mainKey}${k[0]}`,'/ -');

    result[keyName] = k[1];
  });
  return result;
}


function e0e1(dict, e0Key) {
  if (!dict) return [];
  let result = {};
  Object.entries(dict)
    .forEach(e => {
            // {EngagedPaidWorkFreq :1, EngagedPaidWorkDays: 3}
      let temp = meld(`${e0Key}${e[0]}`, e[1] );
      result = {...result, ...temp} ;
    });
  return result;
}
// {
//   EngPaidWork_Freq
//   EngPaidWork_Days
// }

// OtherAddictiveBehaviours e0e1(body,"OtherAddictiveBehaviours",  "OBehave")
// Past4WkEngagedInOtheractivities
function spreadUpIntoArray(body, aliasMapper) {
  let result = {};
  Object.keys(aliasMapper).forEach(k => {
    if(body[k]) {
      let temp = e0e1(body[k], aliasMapper[k]);
      result = {...result, ...temp};
    }
  });
  return result;      
}

/**
 * 
 * @param {*} body    SurveyData
 * @param {*} keyName  e.g.HowDoYouSpendTime
 * @returns Sorted string (by rank) of "areas"   : "<area1>(<rank1>), <area2>(<rank2>)"
 * @requires body[keyName] object to have "area" and "Rank" fields
 */
function areaRank(body, keyName) {
  let result = [];
  if (body[keyName])
    result = e0e1Old(body[keyName], "area");

  const sortedResult = result.sort((a, b) =>
    a.Rank > b.Rank ? 1 : b.Rank > a.Rank ? -1 : 0
  );

  return {
    [keyName]: sortedResult
      .map(e => `${e["area"]}(${e["Rank"]})`)
      .join(",  ")
  };
}



function joinStrings(body, listOfStringListNames = [], exclusions = []) {
  let dict = {};
  if (exclusions)
    listOfStringListNames = listOfStringListNames.filter(
      e => !exclusions.includes(e)
    );

  listOfStringListNames.forEach(eStrListName => {
    if (!body[eStrListName]) return "";
    dict[eStrListName] = body[eStrListName].join(", ");
  });
  return dict;
}

module.exports = { spreadUpIntoArray, joinStrings, areaRank };
