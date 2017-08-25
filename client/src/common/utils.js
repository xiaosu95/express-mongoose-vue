export default {
  getUrl: (file) => {             // blob转url
    var url = null;
    if (window.createObjectURL !== undefined) {
      url = window.createObjectURL(file);
    } else if (window.URL !== undefined) {
      url = window.URL.createObjectURL(file);
    } else if (window.webkitURL !== undefined) {
      url = window.webkitURL.createObjectURL(file);
    }
    return url
  },
  dataURItoBlob: (base64Data) => {        // baes64转blob
    var byteString;
    if (base64Data.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(base64Data.split(',')[1]);
    } else byteString = unescape(base64Data.split(',')[1]);
    var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type: mimeString});
  },
  removal: (arr) => {                   // 去重
    return Array.from(new Set(arr));
  }
}
