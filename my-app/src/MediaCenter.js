// import React, { Component } from "react";

// import { Upload, message, Button, Icon } from "antd";
// // import { Modal, Form, Input, Radio } from "antd";

// // const FormItem = Form.Item;

// export default class MediaCenter extends React.Component {
//   state = {
//     fileList: [{
//       uid: -1,
//       name: 'xxx.png',
//       status: 'done',
//       url: 'http://www.baidu.com/xxx.png',
//     }],
//   }
//   handleChange = (info) => {
//     let fileList = info.fileList;

//     // 1. Limit the number of uploaded files
//     //    Only to show two recent uploaded files, and old ones will be replaced by the new
//     fileList = fileList.slice(-2);

//     // 2. read from response and show file link
//     fileList = fileList.map((file) => {
//       if (file.response) {
//         // Component will show file.url as link
//         file.url = file.response.url;
//       }
//       return file;
//     });

//     // 3. filter successfully uploaded files according to response from server
//     fileList = fileList.filter((file) => {
//       if (file.response) {
//         return file.response.status === 'success';
//       }
//       return true;
//     });

//     this.setState({ fileList });
//   }
//   render() {
//     const props = {
//       action: '//jsonplaceholder.typicode.com/posts/',
//       onChange: this.handleChange,
//       multiple: true,
//     };
//     return (
//       <Upload {...props} fileList={this.state.fileList}>
//         <Button>
//           <Icon type="upload" /> upload
//         </Button>
//       </Upload>
//     );
//   }
// }

// // export default class AgentUpload extends Component {
// //   render() {
// //     return (

// //     )
// //   }
// // }

// // import { Upload, Button, Icon, message } from "antd";
// // // import reqwest from 'reqwest';
// // import axios from "axios";

// // export default class MediaCenter extends React.Component {
// //   state = {
// //     fileList: [],
// //     uploading: false
// //   };

// //   handleUpload = () => {
// //     const { fileList } = this.state;
// //     const formData = new FormData();
// //     fileList.forEach(file => {
// //       formData.append("files[]", file);
// //     });

// //     this.setState({
// //       uploading: true
// //     });

//     // You can use any AJAX library you like
//     //   axios({
//     //     url: "/api/upload/",
//     //     method: "post",
//     //     processData: false,
//     //     data: formData,
//     //     success: () => {
//     //       this.setState({
//     //         fileList: [],
//     //         uploading: false
//     //       });
//     //       message.success("upload successfully.");
//     //     },
//     //     error: () => {
//     //       this.setState({
//     //         uploading: false
//     //       });
//     //       message.error("upload failed.");
//     //     }
//     //   });
//     // };

// //     axios
// //       .post("/api/upload/", {
// //         uploadedFiles: this.state.fileList
// //       })
// //       .then(res => {
// //         console.log(res);
// //       });
// //   };

// //   render() {
// //     const { uploading } = this.state;

// //     const props = {
// //       action: "/api/upload/",
// //       onRemove: file => {
// //         this.setState(({ fileList }) => {
// //           const index = fileList.indexOf(file);
// //           const newFileList = fileList.slice();
// //           newFileList.splice(index, 1);
// //           return {
// //             fileList: newFileList
// //           };
// //         });
// //       },
// //       beforeUpload: file => {
// //         this.setState(({ fileList }) => ({
// //           fileList: [...fileList, file]
// //         }));
// //         return false;
// //       },
// //       fileList: this.state.fileList,
// //       defaultFileList: [
// //         {
// //           uid: 1,
// //           name: "xxx.png",
// //           status: "done",
// //           reponse: "Server Error 500", // custom error message to show
// //           url: "http://www.baidu.com/xxx.png"
// //         },
// //         {
// //           uid: 2,
// //           name: "yyy.png",
// //           status: "done",
// //           url: "http://www.baidu.com/yyy.png"
// //         },
// //         {
// //           uid: 3,
// //           name: "zzz.png",
// //           status: "error",
// //           reponse: "Server Error 500", // custom error message to show
// //           url: "http://www.baidu.com/zzz.png"
// //         }
// //       ]
// //     };

// //     return (
// //       <div>
// //         {/*{this.props.uploadList.map(file => {
// //           return (
// //             <div>
// //               {file}
// //               <br />
// //               <br />
// //               <Upload {...props}>
// //                 <Button>
// //                   <Icon type="upload" /> Select File
// //                 </Button>
// //               </Upload>

// //               <Button
// //                 className="upload-demo-start"
// //                 type="primary"
// //                 onClick={this.handleUpload}
// //                 disabled={this.state.fileList.length === 0}
// //                 loading={uploading}
// //               >
// //                 {uploading ? "Uploading" : "Start Upload"}
// //               </Button>
// //             </div>
// //           );
// //         })}*/}
// //       </div>
// //     );
// //   }
// // }
