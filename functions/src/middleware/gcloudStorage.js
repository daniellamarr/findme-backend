const path = require("path");
const Busboy = require("busboy");
const uuid = require("uuid4");
const {Storage} = require("@google-cloud/storage");
const config = require("../../config/config.json");

const storage = new Storage({
	projectId: config.projectId,
	keyFilename: path.resolve(__dirname, "../../config/serviceAccountKey.json")
});

const bucket = storage.bucket(config.storageBucket);

const deleteFile = filename =>
	new Promise((resolve, reject) => {
		const file = bucket.file(filename);
		file.delete((err, apiRes) => {
			if (err) {
				reject(err);
			}
			resolve(apiRes);
		});
	});

const constructFileUploadPromise = (filename, file) => {
	const extension = filename.split(".")[1];
	const uniqueFilename = `${uuid()}.${extension}`;
	const imageFile = bucket.file(uniqueFilename);
	return new Promise((resolve, reject) => {
		file
			.pipe(imageFile.createWriteStream())
			.on("error", reject)
			.on("finish", () => {
				imageFile.makePublic((err, apiRes) => {
					if (err) {
						reject(err);
					}
					resolve(`https://storage.googleapis.com/${config.storageBucket}/${uniqueFilename}`);
				});
			});
	});
};

const fileUpload = (req, res, next) => {
	const busboy = new Busboy({
		headers: req.headers,
		limits: {
			fileSize: 10 * 1024 * 1024
		}
	});

	const fields = {};
	const fileWrites = [];

	busboy.on("field", (key, value) => {
		fields[key] = value;
	});

	busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
		console.log("File Encountered");
		if (!filename) {
			req.body = fields;
			return next();
		}
		console.log(`Handling file upload field ${fieldname}: ${filename}`);

		fileWrites.push(constructFileUploadPromise(filename, file));

		console.log("File Pushed unto filewrites array");
		return true;
	});

	busboy.on("finish", () => {
		if (fileWrites.length > 0) {
			Promise.all(fileWrites)
				.then(files => {
					req.body = fields;
					req.files = files;
					return next();
				})
				.catch(next);
		} else {
			req.body = fields;
			req.files = [];
			return next();
		}
		return true;
	});

	busboy.end(req.rawBody);
};

module.exports = {fileUpload, deleteFile};
