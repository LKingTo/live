const config = process.env
const baseUrl = config.NODE_ENV==="development" ? "http://127.0.0.1" : "http://www.example.com"
const baseEnv = {
	env:config.NODE_ENV,//当前环境
	mode:config.VUE_APP_CURRENTMODE,//当前模式
	webUrl : config.VUE_APP_CURRENTMODE==="electron" ? `${baseUrl}:8512` : "/webserve",
	socketUrl : {
		//barrage:`${baseUrl}:8511/barrage`,
		barrage: config.NODE_ENV==="development" ? `${baseUrl}:8511/barrage` : `${baseUrl}/barrage`,
	},
	//livingUrl : config.NODE_ENV==="development"?`${baseUrl}:8000/live`:`${baseUrl}/live/live`
	livingUrl : config.NODE_ENV==="development" ? `${baseUrl}:8000/live` : `${baseUrl}/live/live`

}

export default baseEnv
