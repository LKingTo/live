const express = require('express');
const router = express.Router();
const commonJS = require('../public/js/common')
const sqlHandle = require('../public/config/mysqlModal')
const jwt = require('jsonwebtoken')

/* GET users listing. */
router.get('/test', async (req, res, next) => {
	let img = await commonJS.base64Image("https://c-ssl.duitang.com/uploads/item/201807/08/20180708222217_wayur.jpeg")
	res.send(img);
});

/**
 * @description 用户登录
 * @param {type}
 * @return {type}
 */
router.post('/login', async (req, res, next) => {
	const {account, password} = req.body
	if (account && password) {
		let sql = `select * from user where email='${account}' and password='${password}' limit 1`;
		let result = await sqlHandle.DB2(sql);
		if (result.length === 1) {
			const token = 'Bearer ' + jwt.sign(
				{
					id: result[0].id,
					name: result[0].name,
					age: result[0].age,
					email: result[0].email
				},
				'living_toto',
				{
					expiresIn: 3600 * 24 * 7
				}
			)
			res.send(commonJS.outPut(200, token, 'success'))
		} else {
			res.send(commonJS.outPut(500, '账号或密码错误', 'fail'))
		}
	} else {
		res.send(commonJS.outPut(500, '账号或密码错误不能为空', 'fail'))
	}
})

/**
 * @description: 获取用户信息
 * @param {type}
 * @return {type}
 */
router.get('/getUserInfo', async (req, res, next) => {
	let data = req.query;
	let sql = `select * from user where id = '${data.id}' limit 1`
	let result = await sqlHandle.DB2(sql)
	if (result.length === 1) {
		res.send(commonJS.outPut(200, result[0], 'success'))
	} else {
		res.send(commonJS.outPut(500, result, 'fail'))
	}
})

/**
 * @description 新增用户信息
 * @param {type}
 * @return {type}
 */
router.post('/addUser', async (req, res, next) => {
	const {name, age, email, password} = req.body;
	if (!email || !password) {
		res.send(commonJS.outPut((500, '邮箱或密码不能为空', 'fail')));
		return;
	}
	let sql = `insert into user (id,name,age,email,password) values ('${commonJS.getCode(32)}','${name}','${age}','${email}','${password}')`
	let result = await sqlHandle.DB2(sql);
	if (result.affectedRows === 1) {
		res.send(commonJS.outPut(200, req.body, 'success'))
	} else {
		res.send(commonJS.outPut(500, result, 'fail'))
	}
})

/**
 * @description 编辑用户信息
 * @param {type}
 * @return {type}
 */
router.post('/editUser', async (req, res, next) => {
	const {id, name, age, password} = req.body;
	if (!id) {
		res.send(commonJS.outPut(500, '缺少关键数据用户ID，编辑失败', 'fail'))
	} else {
		let sql = `update user set name=${name},age=${age},password=${password} where id=${id}`;
		let result = await sqlHandle.DB2(sql);
		if (result.affectedRows === 1) {
			res.send(commonJS.outPut(200, req.body, 'success'));
		} else {
			res.send(commonJS.outPut(500, result, 'success'));
		}
	}
})

module.exports = router;
