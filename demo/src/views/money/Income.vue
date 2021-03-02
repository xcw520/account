<template>
    <div id="Income">
        <a class="income-type" @click="drawer = true;gettype(item)" v-for="(item, index) in type" :key="index">
            <i><img src="../../assets/account-type.png"></i>
            <span>{{item}}</span>
        </a>
        <a class="income-type"  @click="showPopup">
            <i><img src="../../assets/account-type.png"></i>
            <span>添加</span>
        </a>
        <a class="income-type"  @click="showPopup2">
            <i><img src="../../assets/account-type.png"></i>
            <span>删除</span>
        </a>
         <div>
            <van-popup v-model="show2" round position="bottom" :style="{ height: '30%' }">
                <div class="typemsg2">
                    <van-field v-model="typename" label="类别" placeholder="请输入类别" />
                </div>
                <el-button type="warning" @click="add2">添加</el-button>
            </van-popup>
        </div>
        <div>
            <van-popup v-model="show22" round position="bottom" :style="{ height: '30%' }" >
                <div class="typemsg22">
                    <van-field v-model="typename" label="类别" placeholder="请输入要删除的类别名称" />
                </div>
                <el-button type="warning" @click="del2">删除</el-button>
            </van-popup>
        </div>
        <div>
            <el-drawer size='70vh'  :visible.sync="drawer" direction="btt">
                <div  id="expense-money" >
                    <van-field
                        readonly
                        clickable
                        :value="value"
                        @click="show = true"
                        style="height: 18vh; font-size:3rem; margin-top: -30px;"
                    />

                    <div id="income-info">
                        <div id="income-remark">
                            <el-input
                                placeholder="请输入备注"
                                prefix-icon="el-icon-s-order"
                                v-model="remark"
                                >
                            </el-input>
                        </div>
                        <div id="income-date">
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
        show2:false,
        show22:false,
        value:'',
        typename:'',
        type:['工资','兼职','理财','礼金','其他'],
        selecttype:'',
        remark: '',
        showwirte: true,
        keywordflag: false,
        accountday:'',
        showCalendar: false,
        minDate: new Date(new Date().getFullYear()-15, 0, 1),
        maxDate: new Date(2200, 0, 31),
        currentDate: new Date(),
      };
    },
    methods: {
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
                    tid:'2'
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
            }        
        },
        gettype(item){
           
            this.selecttype = item;
        },
        showPopup(){
            this.show2 = true;
        },
        showPopup2(){
            this.show22 = true;
        },
        add2(){
            let tid = '2';//收入 
            this.$http(`money/add?tid=${tid}&typename=${this.typename}`,'GET')
                .then(
                    res=>{
                        if(res.code == 200) {                           
                            window.location.reload();
                        }
                    }
                )
        },
        del2(){
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
        let tid = '2';//收入 
        this.$http(`money/type?tid=${tid}`,'GET')
            .then(
                res=>{
             
                    this.type = res.data.type;//类型
                }
            )
    }
    
    
}
</script>
<style lang="less" scoped>
    #Income {
        display: flex;
        flex-wrap: wrap;
        width: 100vw;
        height: auto;
        max-height: 70vh;
        overflow: hidden;
        overflow-y: visible;
        .income-type {
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
        #income-info {
            width: 100vw;
            height: 6vh;
            #income-remark {
                width: 70vw;
                height: 6vh;
                float: left;
                
            }
            #income-date {
                width: 28vw;
                height: 6vh;
                float: left;
            }
        }
        .typemsg2 {
            margin-top: 5vh;
            margin-bottom: 5vh;
        }
        .typemsg22 {
            margin-top: 5vh;
            margin-bottom: 5vh;
        }
    }
</style>