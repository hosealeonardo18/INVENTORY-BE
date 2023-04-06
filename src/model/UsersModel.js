const Pool = require('../config/db');


const getAllUsers = (searchParams, sortBy, sort, limit, offset) => {
    return Pool.query(`SELECT * FROM users WHERE fullname LIKE '%${searchParams}%' ORDER BY ${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}

const getDetailUsers = (id) => {
    return Pool.query(`SELECT * FROM users WHERE id='${id}'`)
}

const updateUsers = (data) => {
    const {
        id, fullname, email, password, no_telp, gender, image
    } = data;

    return Pool.query(`UPDATE users SET fullname='${fullname}', email='${email}', password='${password}',no_telp='${no_telp}', image='${image}', gender='${gender}' WHERE id='${id}';`)
}

// const deleteJobseekers = (id) => {
//     return Pool.query(`DELETE FROM jobseekers WHERE id='${id}'`)
// }

const findId = (id) => {
    return new Promise((resolve, reject) => {
        Pool.query(`SELECT id FROM users WHERE id='${id}'`, (error, result) => {
            if (!error) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};

const countData = () => {
    return Pool.query(`SELECT COUNT(*) FROM users`);
}

// auth
const registerUsers = (data) => {
    const { id, fullname, password, email, no_telp, gender, created_at, role } = data

    return Pool.query(`INSERT INTO users(id, fullname, email, password, no_telp, image, gender, created_at, role)
    VALUES ('${id}','${fullname}', '${email}', '${password}', '${no_telp}', '', '${gender}', '${created_at}', '${role}')`);
}

const findEmail = (email) => {
    return new Promise((resolve, reject) => {
        Pool.query(`SELECT * FROM users WHERE email='${email}'`, (error, result) => {
            if (!error) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};


module.exports = {
    getAllUsers,
    getDetailUsers,
    registerUsers,
    updateUsers,
    // deleteJobseekers,
    findEmail,
    findId,
    countData
}