import React, { Component } from "react";

var ExcelCSV = require("excelcsv");

var fileIn = "src/col.xlsx";

var parser = new ExcelCSV(fileIn);
var csv = parser.init()(csv);
// import XLSX from "xlsx";

// var oFileIn;
// export default class ExceltoJSON extends Component {
//   filePicked = oEvent => {
//     // Get The File From The Input
//     var oFile = oEvent.target.files[0];
//     var sFilename = oFile.name;
//     // Create A File Reader HTML5
//     var reader = new FileReader();

//     // Ready The Event For When A File Gets Selected
//     reader.onload = function(e) {
//       var data = e.target.result;
//       var cfb = XLSX.CFB.read(data, { type: "binary" });
//       var wb = XLSX.parse_xlscfb(cfb);
//       // Loop Over Each Sheet
//       wb.SheetNames.forEach(function(sheetName) {
//         // Obtain The Current Row As CSV
//         // var sCSV = XLS.utils.make_csv(wb.Sheets[sheetName]);

//         var data = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
//           header: 1
//         });
//         data, function(indexR, valueR) {
//           var sRow = "<tr>";
//           data[indexR], function(indexC, valueC) {
//             sRow = sRow + "<td>" + valueC + "</td>";
//           };
//           sRow = sRow + "</tr>";
//           "#my_file_output".append(sRow);
//         };
//       });
//     };

//     // Tell JS To Start Reading The File.. You could delay this if desired
//     reader.readAsBinaryString(oFile);
//   };

//   function() {
//     oFileIn = document.getElementById("my_file_input");
//     if (oFileIn.addEventListener) {
//       oFileIn.addEventListener("change", filePicked, false);
//     }
//   }

//   render() {
//     return (
//       <div>
//         <input type="file" id="my_file_input" />
//         <table id="my_file_output" />
//         <button>Convert</button>
//       </div>
//     );
//   }
// }

// import convertExcel from "excel-as-json";

// var convertExcel = require("excel-as-json").processFile;

// const options = { sheet: "1", isColOriented: true, omitEmptyFields: false };
// export default class ExceltoJson extends Component {
//   handleConvertExcel = event => {
//     ("entered");
//   };

//   // convertExcel = ('col.xlsx', 'col.json', options, (err, data)) => {
//   //     ('entered')
//   // }
//   render() {
//     return (
//       <button onClick={event => this.handleConvertExcel(event)}>Upload</button>
//     );
//   }
// }

//   handleFile = e => {
//     var files = e.target.files;
//     var i, f;
//     for (i = 0; i != files.length; ++i) {
//       f = files[i];
//       var reader = new FileReader();
//       var name = f.name;
//       reader.onload = function(e) {
//         var data = e.target.result;

//         var workbook;
//         // if (rABS) {
//         //   /* if binary string, read with type 'binary' */
//         //   workbook = XLSX.read(data, { type: "binary" });
//         // } else {
//         //   /* if array buffer, convert to base64 */
//         //   var arr = fixdata(data);
//         //   workbook = XLSX.read(btoa(arr), { type: "base64" });
//         // }

//         /* DO SOMETHING WITH workbook HERE */
//       };
//       reader.readAsBinaryString(f);
//     }
//     ("entered");
//   };

// input_dom_element.addEventListener('change', handleFile, false);
