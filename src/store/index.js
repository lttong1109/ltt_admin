import VueX from "vuex";
import Vue from 'vue';
import axios from '@/axios';
import { url } from '@/axios';

Vue.use(VueX);

export default new VueX.Store({
    state:{
        msg:"Hello VueX",
        isCollapse:false,
        user:{
            username:"",
            avator:"",
            email:'',
            gender:'',
            phone:''
        },
        // chapter:{
        //     id:"",
        //     name:"",
        //     create_time:"",
        //     update_time:""
        // },
        token:"",    //token在硬盘中存储  vuex在内存条存储
    },
    mutations:{
        removeToken(state){
            state.token = "";
        },
        saveToken(state,token){  //保存token
            state.token = token;
        },
        // changeMsg(state,value){
        //     // state.msg = 20000;
        //     state.msg = value;
        // },
        changeIsCollapse(state){
            state.isCollapse = !state.isCollapse;
        },
        saveUserProfile(state,payload){
            state.user.username = payload.username;
            state.user.avator = payload.avator;
            state.user.phone = payload.phone;
            state.user.email = payload.email;
            if(payload.gender == 1){
                state.user.gender = '男';
            }else{
                state.user.avator = '女';
            }
        },
        // saveTitle(state,payload){
        //     state.chapter.id = payload.id;
        //     state.chapter.name = payload.name;
        //     state.chapter.create_time = payload.create_time;
        //     state.chapter.update_time = payload.update_time;
        // }    
    },
    actions:{
        getUserProfile({ commit }){  //发请求
            return new Promise((resolve,reject) => {
                axios({
                    url:"api/superprofile",
                    data:``
                }).then(res => {
                    if(!res.data.status){
                        // 成功拿到信息了，接下来存储vuex
                        res.data.avator = `${url}${res.data.avator}`;
                        commit('saveUserProfile',res.data);
                        resolve(res.data);
                    }else{
                        reject(res.data);
                    }
                }).catch(error => {
                    reject(error);
                })
            })
        },
        // getTitle({ commit }){  //发请求
        //     return new Promise((resolve,reject) => {
        //         axios({
        //             url:"api/classify",
        //             data:``
        //         }).then(res => {
        //             if(!res.data.status){
        //                 // 成功拿到信息了，接下来存储vuex
        //                 res.chapter.id = `${url}${res.data.id}`;
        //                 res.chapter.name = `${url}${res.data.name}`;
        //                 res.chapter.create_time = `${url}${res.data.create_time}`;
        //                 res.chapter.update_time = `${url}${res.data.update_time}`;
        //                 commit('saveTitle',res.data);
        //                 resolve(res.data);
        //                 console.log(res.data)
        //             }else{
        //                 reject(res.data);
        //             }
        //         }).catch(error => {
        //             reject(error);
        //         })
        //     })
        // },
    },
})
// actions 存放异步操作
// mutations 存放同步操作