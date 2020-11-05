const express = require('express');
const router = express.Router();
const commonJS = require('../public/js/common')
const sqlHandle = require('../public/config/mysqlModal')

/**
 * @description 获取直播间信息
 * @param keyword
 * @return {type}
 */
router.get("/roomList", async (req, res, next) => {
	const {keyword} = req.query
	let sql
	if (!keyword) {
		sql = `select living_room.id,living_room.user_id,living_room.title,user.name,living_room.image,user.avatar,living_room.type from living_room left join user on living_room.user_id = user.id  where living_room.status != 0`
	} else {
		sql = `select living_room.id,living_room.user_id,living_room.title,user.name,living_room.image,user.avatar,living_room.type from living_room left join user on living_room.user_id = user.id where title like '%${keyword}%' or user.name like '%${keyword}%' and living_room.status !=0 limit 20`
	}
	let result = await sqlHandle.DB2(sql)
	if (result.length >= 0) {
		res.send(commonJS.outPut(200, result, 'success'))
	} else {
		res.send(commonJS.outPut(500, result, 'fail'))
	}
})

/**
 * @description 根据类型获取直播间信息
 * @param type
 * @return {type}
 */
router.get("/roomListByType", async (req, res, next) => {
	const {type} = req.query
	let sql
	if (!type) {
		sql = `select living_room.id,living_room.user_id,living_room.title,user.name,living_room.image,user.avatar,living_room.type from living_room left join user on living_room.user_id = user.id  where living_room.status != 0`
	} else {
		sql = `select living_room.id,living_room.user_id,living_room.title,user.name,living_room.image,user.avatar,living_room.type from living_room left join user on living_room.user_id = user.id where type = '${type}' and living_room.status !=0 limit 20`
	}
	let result = await sqlHandle.DB2(sql)
	if (result.length >= 0) {
		res.send(commonJS.outPut(200, result, 'success'))
	} else {
		res.send(commonJS.outPut(500, result, 'fail'))
	}
})

/**
 * @description: 新建房间
 * @param {type}
 * @return {type}
 */
router.post("/addRoom", async (req, res, next) => {
	const {title, user_id, type} = req.body
	let sql = `insert into living_room (id,title,user_id,type) value ('${commonJS.getCode(32)}','${title}','${user_id}','${type}')`
	let result = await sqlHandle.DB2(sql)
	if (result.affectedRows === 1) {
		res.send(commonJS.outPut(200, data, 'success'))
	} else {
		res.send(commonJS.outPut(500, result, 'fail'))
	}
})

/**
 * @description: 编辑房间
 * @param {type}
 * @return {type}
 */
router.post("/editRoom", async (req, res, next) => {
	const data = req.body
	const {title, status, user_id, id} = data
	let sql = `update living_room set title='${title}',status='${status}',user_id='${user_id}' where id ='${id}'`
	let result = await sqlHandle.DB2(sql)
	if (result.affectedRows === 1) {
		res.send(commonJS.outPut(200, data, 'success'))
	} else {
		res.send(commonJS.outPut(500, result, 'fail'))
	}
})

/**
 * @description: 获取直播间详情
 * @param {type}
 * @return {type}
 */
router.get("/roomDetail", async (req, res, next) => {
	let data = req.query
	let sql = `select living_room.title,living_room.type,user.name,user.id,user.avatar from living_room left join user on living_room.user_id = user.id  where living_room.id = '${data.id}' and living_room.status != 0`
	let result = await sqlHandle.DB2(sql)
	if (result.length === 1) {
		let resultData = {
			...result[0],
			room_id: data.id
		}
		res.send(commonJS.outPut(200, resultData, 'success'))
	} else {
		res.send(commonJS.outPut(500, result, 'fail'))
	}
})

module.exports = router;
