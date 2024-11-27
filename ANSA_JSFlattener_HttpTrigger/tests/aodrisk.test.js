const { flattenMatrix, joinStrings, joinObjects } = require("../flatteners");
const { buildTypesLists } = require("../utils");

describe('Matrix Flattening', () => {
  test('should flatten AOD risks matrix correctly', () => {
    const input = {
      riskList: [
        { AODRiskDetail: "Using Alone", Days: "5" },
        { AODRiskDetail: "Polydrug Use", Days: "3" }
      ]
    };

    const matrixMappings = {
      riskList: {
        keyField: "AODRiskDetail",
        valueFields: ["Days"]
      }
    };

    const result = flattenMatrix(input, ["riskList"], matrixMappings);
    
    expect(result).toEqual({
      "riskList_UsingAlone_Days": "5",
      "riskList_PolydrugUse_Days": "3"
    });
  });

  test('should handle empty matrix', () => {
    const input = { riskList: [] };
    const matrixMappings = {
      riskList: {
        keyField: "AODRiskDetail",
        valueFields: ["Days"]
      }
    };
    const result = flattenMatrix(input, ["riskList"], matrixMappings);
    expect(result).toEqual({});
  });

  test('should handle real AODRisk data correctly', () => {
    const input = {
      AODRisk: [
        { AODRiskDetail: "Polydrug Use", Days: "14" },
        { AODRiskDetail: "Driving Intoxicated"}
      ]
    };

    const matrixMappings = {
      AODRisk: {
        keyField: "AODRiskDetail",
        valueFields: ["Days"]
      }
    };

    const result = flattenMatrix(input, ["AODRisk"], matrixMappings);
    
    expect(result).toEqual({
      "AODRisk_PolydrugUse_Days": "14",
      "AODRisk_DrivingIntoxicated_Days": ""
    });
  });
});

describe('String Lists Joining', () => {
  test('should join string lists correctly', () => {
    const input = {
   
      MHRecentRiskIssues: ["Anxiety", "Depression"]
    };

    const result = joinStrings(input, [ "MHRecentRiskIssues"]);
    
    expect(result).toEqual({
     // AODRisks: "Using Alone, Polydrug Use",
      MHRecentRiskIssues: "Anxiety, Depression"
    });
  });
});

describe('Type Detection', () => {
  test('should detect matrix type correctly', () => {
    const input = {
      riskList: [
        { AODRiskDetail: "Using Alone", Days: "5" }
      ],
      stringList: ["item1", "item2"],
      objectArray: [{ key: "value" }]
    };

    const types = buildTypesLists(input);
    
    expect(types.matrixTypeKeys).toContain("riskList");
    expect(types.listOfStringLists).toContain("stringList");
    expect(types.objectArrayTypeKeys).toContain("objectArray");
  });
});

// describe('Integration Test', () => {
//   test('should process complete survey data correctly', () => {
//     const input = {
//       AODRisk: [
//         { AODRiskDetail: "Polydrug Use", Days: "5" },
//         { AODRiskDetail: "Using Alone" }
//       ],
     
//       PDC: [{
//         "Assessment_Date": "2024-01-20",
//         "Assessor_Name": "John Doe"
//       }]
//     };

//     const types = buildTypesLists(input);
//     const flattened = flattenMatrix(input, types.matrixTypeKeys);
//     const joined = joinStrings(input, types.listOfStringLists);

//     expect(flattened).toHaveProperty("AODRisk_PolydrugUse_Days");
//     // expect(joined.AODRisks).toBe("Using Alone, Polydrug Use");
//   });
// });