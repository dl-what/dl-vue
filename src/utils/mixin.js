export default {
  data() {
   return {
    name: 'mixin'
   }
  },
  watch: {
    resourceData: {
      handler(newValue, oldValue) {
        let res = JSON.parse(JSON.stringify(newValue));
        let params = []
        res.forEach((item)=>{
          // 保留你需要的参数
          let param = (({type, name, model, number}) =>({type, name, model, number}))(item);
          params.push(param)
        })
        console.log('params', params)
      },
      // 深度监听 监听对象，数组的变化
      deep: true
    },
  },
  created() {
   console.log('mixin...', this.name);
  },
  mounted() {},
  methods: {
    deleteResource(index) {
      this.resourceData.splice(index, 1);
    },
    addResource() {
      let obj = {
        title:'资源类型',
        type:'',model:'',
        name:'',number:'',
        optionsType:typeData,
        optionsName:nameData,
        optionsModel:modelData,
      }
      this.$set(this.resourceData, this.resourceData.length, obj);
    },
  }
 }