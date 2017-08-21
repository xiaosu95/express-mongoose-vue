const multer = require('multer');

// 上传控制
exports.$upload = function (path, fileType) {
	const storage = multer.diskStorage({
		// destination: (req, file, cb) => {
		// 	cb(null, path);    // 保存的路径，备注：需要自己创建
		// },
		destination: path,			// 传递字符串时可以自动创建
		filename: (req, file, cb) => {
			// 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
			cb(null, file.fieldname + '-' + exports.createRandom() + '.' + exports.getFileType(file.mimetype));
		}
	});
	const fileFilter = (req, file, cb) => {
		if (fileType.includes(exports.getFileType(file.mimetype))) cb(null, true);
		else {
			cb(null, false);
			cb(new Error('上传格式错误'))
		}
	}
	return multer({ storage: storage, fileFilter: fileFilter })
}

// 生成时间戳加三位随机数
exports.createRandom  = function () {
	return `${Date.now()}-${parseInt(Math.random() * 10)}${parseInt(Math.random() * 10)}${parseInt(Math.random() * 10)}`
}

// 获取文件类型
exports.getFileType = function (file) {
	const aggregate = {
		'image/jpeg': 'jpg',
		'image/png': 'png',
		'text/html': 'html',
		'text/plain': 'txt',
		'application/zip': 'zip',
		'application/pdf': 'pdf'
	}
	return aggregate[file]
}

// 删除数组中的某个元素
exports.deleteArray = function (arr, item) {
	let idx = arr.indexOf(item);
	idx != -1 && arr.splice(idx, 1);
}
