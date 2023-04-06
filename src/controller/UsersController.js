const UsersModel = require('../model/UsersModel')
const helperResponse = require('../helper/common');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const authHelper = require('../helper/AuthHelper');
const jwt = require('jsonwebtoken');
const { uploadPhotoCloudinary, deletePhotoCloudinary } = require('../../cloudinary')
const moment = require('moment');

const UsersController = {
	getAllUsers: async (req, res) => {
		try {
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 5;
			const offset = (page - 1) * limit;
			let searchParams = req.query.search || "";
			let sortBy = req.query.sortBy || "created_at";
			let sort = req.query.sort || "ASC";

			const result = await UsersModel.getAllUsers(searchParams, sortBy, sort, limit, offset)
			const { rows: [cekUser] } = result;

			delete cekUser.password;

			const { rows: [count] } = await UsersModel.countData();

			const totalData = parseInt(count.count);
			const totalPage = Math.ceil(totalData / limit);
			const pagination = {
				currentPage: page,
				limit: limit,
				totalData: totalData,
				totalPage: totalPage
			}

			return helperResponse.response(res, result.rows, 200, "Get Users Successfull!", pagination);
		} catch (error) {
			console.log(error);
		}
	},

	getDetailUsers: async (req, res) => {
		try {
			const id = req.params.id;

			const { rowCount } = await UsersModel.getDetailUsers(id);
			if (!rowCount) return res.json({ message: 'User Not Found!' });

			const { rows: [cekUser] } = await UsersModel.getDetailUsers(id);

			delete cekUser.password
			return helperResponse.response(res, cekUser, 200, 'Get Data Success!');
		} catch (error) {
			console.log(error);
		}
	},

	updateUsers: async (req, res) => {
		const id = req.params.id;
		const { fullname, email, password, no_telp, gender } = req.body

		// cek user acount
		const { rowCount } = await UsersModel.getDetailUsers(id);
		if (!rowCount) return res.json({ message: 'User Not Found!' });

		// get user data
		const { rows: [cekUser] } = await UsersModel.getDetailUsers(id);

		// split Url image
		const nameImage = cekUser?.image.split("/")
		const splitUrl = nameImage[7].split(".")

		// cek validate user by login 
		const validateUser = req.payload.id
		if (validateUser !== id) {
			return res.status(403).json({ message: "Sorry, Unauthorized!" })
		}

		// hash password
		const salt = bcrypt.genSaltSync(10);
		const passHash = bcrypt.hashSync(password, salt);

		const data = {
			id,
			fullname,
			email,
			password: passHash,
			no_telp,
			gender,
		};

		// validate input gender length < 1
		if (!gender) {
			data.gender = cekUser.gender
		}

		// validate input password length < 1
		if (!password) {
			data.password = cekUser.password
		}

		// validate file upload length < 1
		if (req.file) {
			await deletePhotoCloudinary(splitUrl[0])
			const upload = await uploadPhotoCloudinary(req.file.path)
			data.image = upload.secure_url || url
		} else {
			data.image = cekUser.image;
		}

		return UsersModel.updateUsers(data).then((result) => {
			helperResponse.response(res, result.rows, 201, `User Updated!`);
		})
			.catch((error) => {
				res.send(error);
			});
	},

	// deleteJobseekers: async (req, res) => {
	// 	const id = req.params.id;
	// 	const { rowCount } = await jobseekersModel.findId(id);

	// 	console.log(rowCount);
	// 	if (!rowCount) return res.json({ message: `Data Jobseeker id: ${id} Not Found!` })

	// 	jobseekersModel.deleteJobseekers(id).then(result => {
	// 		helperResponse.response(res, result.rows, 200, "Data Jobseeker Deleted!")
	// 	}).catch(error => {
	// 		res.send(error)
	// 	})
	// },

	registerUsers: async (req, res) => {
		try {
			const { fullname, email, password, no_telp, gender } = req.body

			// validate email
			const { rowCount } = await UsersModel.findEmail(email);
			if (rowCount) return res.json({ message: "Email already use!" })

			// encrypt password
			const salt = bcrypt.genSaltSync(12);
			const passHash = bcrypt.hashSync(password, salt);

			const id = uuidv4();
			const data = {
				id,
				fullname,
				email,
				password: passHash,
				no_telp,
				gender,
				created_at: moment(Date.now()).format('DD-MM-YYYY'),
				role: 'user'
			}

			return UsersModel.registerUsers(data).then(result => {
				helperResponse.response(res, result.rows, 201, "User Registered Successfull!");
			}).catch(error => {
				res.status(500).send(error)
			})
		} catch (error) {
			console.log(error);
		}
	},

	loginUser: async (req, res) => {
		try {
			const { email, password } = req.body;

			// validate email
			const { rows: [cekEmail] } = await UsersModel.findEmail(email);
			if (!cekEmail) return res.json({ message: "Email Not Register!" });

			// validate password
			const validatePassword = bcrypt.compareSync(password, cekEmail.password);
			if (!validatePassword) return res.json({ message: "Password Incorect!" });

			delete cekEmail.password;
			delete cekEmail.gender;
			delete cekEmail.created_at;

			// payload Authentication
			let payload = {
				id: cekEmail.id,
				email: cekEmail.email,
				role: cekEmail.role
			}

			cekEmail.token = authHelper.generateToken(payload);
			cekEmail.refreshToken = authHelper.generateRefreshToken(payload)

			return helperResponse.response(res, cekEmail, 201, "Login Successfull")
		} catch (error) {
			console.log(error);
		}
	},

	refreshTokenUsers: (req, res) => {
		try {
			const { refreshToken } = req.body;
			let decode = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);

			const payload = {
				id: decode.id,
				email: decode.email,
				role: decode.role
			}

			const result = {
				token: authHelper.generateToken(payload),
				refreshToken: authHelper.generateRefreshToken(payload)
			}
			return helperResponse.response(res, result, 200, "Refresh Token Success!")
		} catch (error) {
			console.log(error);
		}
	},
}

module.exports = UsersController;