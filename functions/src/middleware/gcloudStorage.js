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

const fileUpload = (req, res, next) => {
	const busboy = new Busboy({
		headers: req.headers,
		limits: {
			fileSize: 10 * 1024 * 1024
		}
	});

	const fields = {};
	let fileWrite;

	busboy.on("field", (key, value) => {
		fields[key] = value;
	});

	busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
		if (!filename) {
			req.body = fields;
			return next();
		}
		const extension = filename.split(".")[1];
		const uniqueFilename = `${uuid()}.${extension}`;
		const imageFile = bucket.file(uniqueFilename);
		console.log(`Handling file upload field ${fieldname}: ${uniqueFilename}`);

		fileWrite = new Promise((resolve, reject) => {
			file
				.pipe(imageFile.createWriteStream())
				.on("error", reject)
				.on("finish", () => {
					imageFile.makePublic((err, apiRes) => {
            if (err) {
              reject(err);
            }
            return resolve(
              `https://storage.googleapis.com/${config.storageBucket}/${uniqueFilename}`
            );
          });
				});
		});
		return true;
	});

	busboy.on("finish", () => {
		if (fileWrite) {
			fileWrite
				.then(url => {
					req.body = fields;
					req.file = url;
					return next();
				})
				.catch(next);
		} else {
			req.body = fields;
			return next();
		}
		return true;
	});

	busboy.end(req.rawBody);
};

module.exports = {fileUpload, deleteFile};
