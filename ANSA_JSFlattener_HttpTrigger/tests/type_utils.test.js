// typeutils.test.js

const { buildTypesLists } = require("../utils");

describe('Type Detection Utils', () => {
  test('should detect empty arrays of each type', () => {
    // const input = {
    //   emptyMatrix: [],
    //   emptyStrings: [],
    //   emptyObjects: []
    // };
    const input = {
      "ClientType": "ownuse",
      "AssessmentDate": "2024-11-27",
      "Past4WkHousingHomeless": "No",
      "K5_Score": 15,
      "PrimaryCaregiver": [
        "PrCaregiverUnder5_15yo"
      ],
      "Past4WkPhysicalHealth": 6,
      "K5Q1": "2",
      "AODconcerns": "Yes",
      "DoC_Opioids": [
        "Oxycodone",
        "Fentanyl",
        "Desc of Other opioid mor ethan 30 chars"
      ],
      "PDCSubstanceOrGambling": "Caffeine",
      "DrugsOfConcernDetails": [
        {
          "DrugsOfConcern": "Caffeine",
          "MethodOfUse": "Ingest",
          "DaysInLast28": "27",
          "Units": "dosage (mls)",
          "HowMuchPerOccasion": "30-39",
          "Goals": "Cease Use"
        },
        {
          "DrugsOfConcern": "Other Opioids",
          "MethodOfUse": "Inject",
          "DaysInLast28": "18",
          "Units": "$$$",
          "HowMuchPerOccasion": "80-99",
          "Goals": "Maintain Current Level of use"
        },
        {
          "DrugsOfConcern": "other Drug more than 30 charsdf adsf",
          "MethodOfUse": "Inhale (vapour)",
          "DaysInLast28": "25",
          "Units": "grams",
          "HowMuchPerOccasion": "9",
          "Goals": "Maintain Current Level of use"
        }
      ],
      "HowLongSinceLastInjected": "Within last 4 weeks",
      "AODRisksChecked": [
        {
          "AODRiskDetail": "Long desciption of toher risk (more than 30 chars)",
          "Days": "16"
        },
        {
          "AODRiskDetail": "Sharing Injecting Equipment",
          "Days": "27"
        },
        {
          "AODRiskDetail": "Memory Loss",
          "Days": "27"
        }
      ],
      "AODRisksCheckedItems": [
        "other",
        "Sharing Injecting Equipment",
        "Memory Loss"
      ]
    };
    const types = buildTypesLists(input);
    // expect(types.matrixTypeKeys).toEqual([]);
    expect(types.listOfStringLists).toEqual(["PrimaryCaregiver",
      "DoC_Opioids",
      "AODRisksCheckedItems"]);
    expect(types.objectArrayTypeKeys).toEqual(["DrugsOfConcernDetails",
      "AODRisksChecked"]);
    expect(types.matrixTypeKeys).toEqual(["DrugsOfConcernDetails",
      "AODRisksChecked"]);

    // Get lists that match matrix keys with 'Items' suffix
    const filteredLists = types.listOfStringLists.filter(listName => 
      types.matrixTypeKeys.some(matrixKey => listName === matrixKey + 'Items')
    );

    // expect(filteredLists).toEqual([
    //   "DrugsOfConcernDetailsItems",
    //   "AODRisksCheckedItems"
    // ]);

    // expect(filteredLists).not.toContain("OtherStringList");

    console.log('Filtered string lists that match matrix items:', filteredLists);

    // console.log(
    //   types.listOfStringLists.filter(elem =>{
    //     elem = types.matrixTypeKeys.map(e =>
    //       e+'Items'
    //     )
    //   })
    // )
  });

  // test('should detect mixed types correctly', () => {
  //   const input = {
  //     matrix: [
  //       { field1: "value1", field2: "value2" },
  //       { field1: "value3", field2: "value4" }
  //     ],
  //     strings: ["string1", "string2"],
  //     objects: [{ key: "value" }],
  //     nonArray: "not an array",
  //     nullField: null,
  //     undefinedField: undefined
  //   };

  //   const types = buildTypesLists(input);

  //   expect(types.matrixTypeKeys).toContain("matrix");
  //   expect(types.listOfStringLists).toContain("strings");
  //   expect(types.objectArrayTypeKeys).toContain("objects");
  //   expect(types.matrixTypeKeys).not.toContain("nonArray");
  //   expect(types.listOfStringLists).not.toContain("nullField");
  //   expect(types.objectArrayTypeKeys).not.toContain("undefinedField");
  // });
});
