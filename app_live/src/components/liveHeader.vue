<template>
	<div class="live-header">
		<div class="live-header-logo" @click="gotoIndex">
			<img src="@/assets/images/logo.png"/>
		</div>
		<div class="live-header-center">
			<div class="live-header-center-list">
				<div class="live-header-center-item">直播</div>
				<div class="live-header-center-item">分类</div>
				<div class="live-header-center-item">赛事</div>
				<div class="live-header-center-item">视频</div>
			</div>
			<Input placeholder="输入相关的直播信息" v-model="searchInfo" />
			<Button type="primary" style="margin-left:20px">搜索</Button>
		</div>
		<div class="live-header-right">
			<section>
				<div class="live-header-right-user-loginbtn">登录/注册</div>
			</section>
		</div>
	</div>
</template>

<script>
export default {
	name: "liveHeader",
	data(){
		return {
			ipcRenderer:{},
			searchInfo:"",
		}
	},
	mounted(){
	},
	methods:{
		gotoIndex(){
			this.$router.push({path:"/index"})
		},
	}
}
</script>

<style lang="less" scoped>
.live-header{
	background: #ffffff;
	min-height: 60px;
	//margin-bottom:10px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 20px;
	box-sizing: border-box;
	position: relative;
	-webkit-app-region: drag;
	&-logo{
		font-size:32px;
		color: @primary-color;
		cursor: pointer;
		display: flex;
		align-items: center;
		-webkit-app-region: no-drag;
		img{
			height: 60px;
			width: 70px;
		}
	}
	&-center{
		color:#666;
		margin-left: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		-webkit-app-region: no-drag;
		&-list{
			display: flex;
			justify-content: center;
			align-items: center;
		}
		&-item{
			margin:10px;
			min-width: 40px;
			cursor: pointer;
			&:hover{
				color: @primary-color;
			}
		}
	}
	&-right{
		margin-left: 20px;
		display: flex;
		color: #666;
		-webkit-app-region: no-drag;
		&-user{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			cursor: pointer;
			&-avatar{
				display: flex;
				align-items: center;
				img{
					height: 26px;
					width: 26px;
					border-radius: 50%;
				}
			}
			&-name{
				margin-left: 10px;
				width: 70px;
				overflow: hidden;
			}
			&-loginbtn{
				width: 100px;
				cursor: pointer;
				&:hover{
					color: @primary-color;
				}
			}
		}
	}
	&-window{
		z-index: 999999;
		position: absolute;
		right: 0;
		top: 0;
		display: flex;
		justify-content: flex-end;
		-webkit-app-region: no-drag;
		&-minibtn{
			text-align: center;
			line-height: 20px;
			width: 30px;
			height: 20px;
			&:hover{
				background: #eeeeee;
			}
		}
		&-maxbtn{
			text-align:center;
			line-height: 20px;
			width:30px;
			height: 20px;
			&:hover{
				background: #eeeeee;
			}
		}
		&-closebtn{
			text-align: center;
			line-height: 20px;
			width:30px;
			height: 20px;
			&:hover{
				color: #fff;
				background: #f00;
			}
		}
	}
}
</style>
