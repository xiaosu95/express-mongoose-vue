const multer=require('multer');

// 通过 filename 属性定制
exports.$upload = function (path, Suffix) {
	storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, path);    // 保存的路径，备注：需要自己创建
		},
		filename: (req, file, cb) => {
			// 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
			const type = file.originalname.split('.').pop();
			cb(null, file.fieldname + '-' + Date.now() + '.' + type);
		}
	});
	return multer({ storage: storage })
}
