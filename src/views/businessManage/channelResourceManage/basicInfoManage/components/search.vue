<template>
  <div class="search-bar-comp">
    <el-form :inline="true" :model="form" :label-width="labelWidth">
      <span class="form-item-line">
        <el-form-item label="物品类别">
        <el-select v-model="form.modelType" @change="selectGoodsType" placeholder="请选择物品类别" class="device-item">
          <el-option
            v-for="(list, index) in optionsType"
            :key="index"
            :label="list.label"
            :value="list.value">
          </el-option>
        </el-select>
        </el-form-item>
      </span>
      <span class="form-item-line">
        <el-form-item label="物品名称">
        <el-select v-model="form.goodsId" placeholder="请选择物品名称" class="device-item">
          <el-option
            v-for="(list,index) in optionsName"
            :key="index"
            @click.native="selectGoodsName(index)"
            :label="list.label"
            :value="list.value">
          </el-option>
        </el-select>
        </el-form-item>
      </span>
      <span class="form-item-line">
        <el-form-item label="物品型号">
        <el-select v-model="form.modelId" @change="selectGoodsModel" placeholder="请选择物品型号" class="device-item">
          <el-option
            v-for="(list, index) in optionsModel"
            :key="index"
            :label="list.label"
            :value="list.value">
          </el-option>
        </el-select>
        </el-form-item>
      </span>
      <span class="form-item-line">
        <el-form-item label="物品状态">
          <el-select v-model="form.status" placeholder="请选择物品状态">
            <el-option :label="optionItem.label" :value="optionItem.value" v-for="(optionItem, optionIndex) in options" :key="optionIndex"></el-option>
          </el-select>
        </el-form-item>
      </span>
      <el-form-item class="btn-wrap">
        <el-button size="small" type="primary" @click="onSubmit" icon="el-icon-search">查询</el-button>
        <el-button size="small" @click="reset">重置</el-button>
        <el-button size="small" type="text" @click="onDrop" v-if="options.length > 2">
          {{collapse ? '展开' : '收起'}}
          <i :class="[collapse ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"></i>
        </el-button>
      </el-form-item>
    </el-form>
    <!--拓展插槽-->
    <slot name="extend-bar"></slot>
    <p class="tips-item" v-if="visiableTotal.show">
      <i class="el-alert__icon el-icon-info"></i>
      <span>
        共搜索到<em>{{visiableTotal.total}}</em>条数据
      </span>
    </p>
  </div>
</template>

<script>
  export default {
    name: 'searchBar',
    props: {
      labelWidth: {
        default: '70px'
      },
      // 搜索结果条数
      total: {
        default: 0
      },
    },
    data() {
      return {
        form: {
          modelType: '',
          goodsId: '',
          modelId: '',
          status: ''
        },
        optionsType: [
          {label:'设备',value:1},
          {label:'配件',value:2},
        ],
        optionsName: [],
        optionsModel: [],
        resourceDatas: [],
        options: [
          {label:'开',value: 1},
          {label:'关',value: 2},
        ],
        visiableTotal: {
          show: false,
          total: 0,
        },
        collapse: true,
      };
    },
    watch: {
      'total': {
        handler (newVal, oldVal) {
          console.log(newVal);
          Object.assign(this.visiableTotal, newVal);
        },
        deep: true,
        immediate: true
      },
    },
    created() {
      
    },
    methods: {
    // 根据资源类型获取资源名称
    getModelTrees(data) {
      const self = this;
      // 重置后面下拉框的数据 清空 
      self.optionsModel =[];
      self.optionsName = [];
      self.form.goodsId = '';
      self.form.modelId = '';
      
      (async (data)=>{
				let res = await self.$api.getSearchName({data})
				if(res && res.code == 0) {
          this.resourceDatas = res.data;
          res.data.forEach((item, index)=>{
            let obj = {};
            obj.label = item.goodsName;
            obj.value = item.id;
            self.optionsName.push(obj)
          })
          
				}
      })(data)
    },
      // 选择物品类型
      selectGoodsType() {
        // console.log('选择的资源index', )
        
        let data = {
          goodsType: this.form.modelType
        };
        this.getModelTrees(data)
      },
      // 选择物品名称
      selectGoodsName(index) {
        // console.log(index,this.resourceDatas[index])
        // 重置后面下拉框的数据 清空
        const self = this;
        this.form.modelId = '';
        this.optionsModel = []
        this.resourceDatas[index].modelInfoVoList.forEach((item)=>{
          let obj = {};
          obj.label = item.deviceModel
          obj.value = item.modelId
          self.optionsModel.push(obj)
        })
    
      },
      // 选择设备类型
      selectGoodsModel(val) {
        // 重置后面输入框的数据 清空
        // this.$set(this.resourceData[0], 'num', '');
        // console.log('设备型号', val)
      },
      search(){
        console.log('model',data)
        if(data.id&&this.param.id!=data.id) {
          this.$set(this.modelInfoOptions[3], 'value', '')
          this.modelDatas.forEach((item)=>{
            if(item.id == data.id) {
              let array = []
              item.modelInfoVoList.forEach(list=>{
                let obj = {};
                obj.label = list.deviceModel
                obj.value = list.modelId
                array.push(obj)
              })
              this.$set(this.modelInfoOptions[2], 'options', array)
            }
          })
        }
        if(data.goodsType&&this.param.goodsType!=data.goodsType){
          let param = {goodsType:data.goodsType}
          this.getSelectOption(param)
        }
      },
      onSubmit() {
        let formData = {};
        for (let key in this.form) {
          if (this.form[key] !== '') formData[key] = this.form[key];
        }
        this.$emit('search', formData)
      },
      onDrop() {
        this.collapse = !this.collapse;
        if (!this.collapse) {
          this._options = this.options;
        } else {
          this._options = this.options.slice(0, 2);
        }
      },
      reset() {
        for (let key in this.form) {
          this.form[key] = '';
        }
      }
    }
  }
</script>

<style lang="less">
  .search-bar-comp{
    padding: 15px 0;
    .el-form{
      background-color: #fff;
      .el-button--text:hover {
        background-color: transparent;
        color: #57a3f3;
        border-color: transparent;
      }
      .el-button--text:focus {
        background-color: transparent;
        color: #57a3f3;
        border-color: transparent;
      }
    }
    .btn-wrap{
      padding-left: 30px;
      margin-bottom: 10px;
    }
    .el-button{
      margin: 0 8px 0 0;
    }
    .tips-item{
      height: 34px;
      line-height: 34px;
      background-color: #f0faff;
      border: 1px solid #abdcff;
      font-size: 12px;
      color: #515a6e;
      border-radius: 4px;
      padding: 0 10px;
      margin: 10px 0 0;
      display: flex;
      align-items: center;
      em{
        color: #2d8cf0;
        font-style: normal;
        padding: 0 3px;
      }
      i{
        vertical-align: middle;
        color: #2d8cf0;
        margin-right: 5px;
      }
    }
    .form-item-line{
      display: inline-block;
      vertical-align: top;
      .el-form-item{
        margin-bottom: 10px;
      }
      *{
        font-size: 12px;
      }
    }
    .el-input__inner{
      width: 240px;
      height: 34px;
    }
    .el-input{
      width: auto;
    }
  }
</style>
