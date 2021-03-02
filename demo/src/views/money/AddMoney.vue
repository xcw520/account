<template>
    <div id="AddMoney">
        <div id="sort">
            <div class="nav"></div>
            <router-link class="nav" tag="div" to="/addmoney/expense">支出</router-link>
            <router-link class="nav" tag="div" to="/addmoney/income">收入</router-link>
            <div class="nav">
                <div class="cancel">
                    <router-link to="/" tag="span">
                        取消
                    </router-link>
                </div>
            </div>
        </div>
       
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>


<style lang="less" scoped>
    #AddMoney{
        width: 100vw;
        height: 100vh;
        text-align: center;
       #sort{
           display: flex;
           width: 100vw;
           height: 12vh;
           background-image: linear-gradient(#fab371, #f59445);
           .nav {
                height: 12vh;
                line-height: 17vh;
                flex: 1;
                font-size: 1.2rem;
                .cancel {
                    float: right;
                    width: 12vw;
                    height: 12vh;
                    line-height: 17vh;
                    margin-right: 2vw;
                    font-size: 1rem;
                }
            }
            .router-link-exact-active {
                border-bottom: 2px solid #000;
            }
       }
    }

</style>