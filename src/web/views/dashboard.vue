<template>
    <div class="v-dashboard">
       
         <u-player :src="video_url"></u-player>
     
    </div>
</template>

<style lang="less">
    @import "./dashboard.less";
</style>

<script lang="ts">
import { component, watch, View } from "flagwind-web";

import Player from "components/player";

/**
 * 工作台视图。
 * @class
 * @version 1.0.0
 */
@component
({
    components:
    {
        "u-player": Player
    }
})
export default class Dashboard extends View
{
   //  console.log(this.$route.query.id)
    // id = this.$route.query.id;
     name = 'ranmufei'
     video_url = ''
     hello(){
        alert('hi feifei');
     }

     created(){
          //alert(this.$route.query);
         
          this.video_url=this.getQueryString('rtsp_path')
     }

    mounted () {
     // alert('hi mounted');
    }
    // 获取URL 参数
    getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var q = window.location.pathname.substr(1).match(reg_rewrite);
        if(r != null){
            return unescape(r[2]);
        }else if(q != null){
            return unescape(q[2]);
        }else{
            return null;
        }
    }

}
</script>
