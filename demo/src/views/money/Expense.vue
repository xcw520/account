<template>
    <div id="Expense">
        <a class="expense-type"  @click="drawer = true;gettype(item);" v-for="(item, index) in type" :key="index">
            <i ><img src="../../assets/account-type.png"></i>
            <span>{{item}}</span>
        </a>
        <a class="expense-type"  @click="showPopup">
            <i><img src="../../assets/account-type.png"></i>
            <span>添加</span>
        </a>
        <a class="expense-type"  @click="showPopup2">
            <i><img src="../../assets/account-type.png"></i>
            <span>删除</span>
        </a>
        <div>
            <van-popup v-model="show1" round position="bottom" :style="{ height: '30%' }">
                <div class="typemsg1">
                    <van-field v-model="typename" label="类别" placeholder="请输入类别" />
                </div>
                <el-button type="warning" @click="add">添加</el-button>
            </van-popup>
        </div>
        <div>
            <van-popup v-model="show11" round position="bottom" :style="{ height: '30%' }" @click="remove">
                <div class="typemsg11">
                    <van-field v-model="typename" label="类别" placeholder="请输入要删除的类别名称" />
                </div>
                <el-button type="warning" @click="del">删除</el-button>
            </van-popup>
        </div>
        
        <div>
            <el-drawer size='70vh'  :visible.sync="drawer" direction="btt" @close="clo()">
                <div  id="expense-money" >
                    <van-field
                        readonly
                        clickable
                        :value="value"
                        @click="show = true"
                        style="height: 18vh; font-size:3rem; margin-top: -30px;"
                    />

                    <div id="expense-info">
                        <div id="expense-remark">
                            <el-input
                                placeholder="请输入备注"
                                prefix-icon="el-icon-s-order"
                                v-model="remark"
                                >
                            </el-input>
                        </div>
                        <div id="expense-date">
                           <van-field
                                readonly
                                clickable
                                :min-date="minDate"
                                :max-date="maxDate"
                                name="datetimePicker"
                                :value="accountday"
                                placeholder="点击选择日期"
                                @click="showCalendar = true"
                                
                            />
                            <van-popup v-model="showCalendar" position="bottom">
                                <van-datetime-picker
                                type="date"
                                @confirm="onConfirm"
                                @cancel="showCalendar = false"
                                v-model="currentDate"
                                :min-date="minDate"
                                :max-date="maxDate"
                                />
                            </van-popup>
                        </div>
                    </div>

                    <van-number-keyboard
                        v-model="value"
                        theme="custom"
                        extra-key="."
                        close-button-text="完成"
                        :show="show"
                        :maxlength="6"
                        @blur="drawer = false"
                        @close = "finish"
                        :hide-on-click-outside="keywordflag"
                    />
                </div>
            </el-drawer>
        </div>
    </div>
</template>

<script>
export default {
    data() {
      return {
        drawer: false,
        direction: 'btt',
        show: true,
        show1:false,
        show11:false,
        value:'',
        typename:'',
        type:[''],
        remark: '',
        selecttype:'',
        showwirte: true,
        keywordflag: false,
        accountday: '',
        showCalendar: false,
        minDate: new Date(new Date().getFullYear()-15, 0, 1),
        maxDate: new Date(2200, 0, 31),
        currentDate: new Date(),
      };
    },
    methods: {
        remove(){
            console.log(222);
            this.typename = "";
        },
        onConfirm(date) {
            this.accountday= `${date.getFullYear()}-${
                date.getMonth() + 1
            }-${date.getDate()}`;
            this.showCalendar = false;
        },
        finish(){
            if(localStorage.flag){
                this.$http('money/setmoney', 'POST', {
                    money:this.value,
                    remark:this.remark,
                    date:this.accountday,
                    type:this.selecttype,
                    tid:'1'
                })
                    .then(
                        res=>{
                            if(res.code == 200){
                                this.$toast('成功记账一笔');
                                this.value = '';
                                this.remark = '';
                                this.accountday = '';
                            } else {
                                this.$toast(res.msg);
                                this.value = '';
                                this.remark = '';
                                this.accountday = '';
                            }
                        }
                    )
            } else {
                this.$toast('请登录');
            }
            
        },
        clo(){
            this.value="";
        },
        gettype(item){
            this.selecttype = item;
        },
        showPopup(){
            this.show1 = true;
        },
        showPopup2(){
            this.show11 = true;
        },
        add(){
            let tid = '1';//支出 
            this.$http(`money/add?tid=${tid}&typename=${this.typename}`,'GET')
                .then(
                    res=>{
                        if(res.code == 200) {
                            this.typename = '';
                            window.location.reload();
                        } else {
                            this.$toast(res.msg);
                        }
                    }
                )
        },
        del(){
            let tid = '1';//支出 
            this.$http(`money/delType?tid=${tid}&typename=${this.typename}`,'GET')
                .then(
                    res=>{
                        if(res.code == 200) {
                            this.typename = '';
                            window.location.reload();
                        }else {
                            this.$toast(res.msg);
                        }
                    }
                )
        }
    },
    mounted(){
        let tid = '1';//支出 
        this.$http(`money/type?tid=${tid}`,'GET')
            .then(
                res=>{
               
                    if (res.code == 200) {
                        this.type = res.data.type;//类型
                    }else {
                        this.$toast(res.msg);
                    }
                }
            )
    },
    
}
</script>

<style lang="less" scoped>
    #Expense {
        display: flex;
        flex-wrap: wrap;
        width: 100vw;
        height: auto;
        max-height: 70vh;
        overflow: hidden;
        overflow-y: visible;
        .expense-type {
            display: block;
            justify-content: center;
            width: 20vw;
            height: 12vh;
            margin-top: 1.5vh;
            margin-left: 3.7vw;
            i {
                display: block;
                margin: 0 auto;
                margin-top: 1vh;
                width: 12vw;
                height: 12vw;
                border-radius: 50%;
                background-color: #f5f5f5;
                img {
                    width: 10vw;
                    height: 10vw;
                    margin-top: 0.5vh;
                }
            }
            span {
                display: block;
                margin-top: 0.5vh;
                height: 2vh;
                font-size: 0.8rem;
            }
        }
        #expense-info {
            width: 100vw;
            height: 6vh;
            #expense-remark {
                width: 70vw;
                height: 6vh;
                float: left;
                
            }
            #expense-date {
                width: 28vw;
                height: 6vh;
                float: left;
            }
        }
        .typemsg1 {
            margin-top: 5vh;
            margin-bottom: 5vh;
        }
         .typemsg11 {
            margin-top: 5vh;
            margin-bottom: 5vh;
        }
    }
    
</style>


