<template>
  <div id="app">
    <el-input
      class="input-area"
      type="textarea"
      :autosize="{ minRows: 4, maxRows: 12 }"
      resize="none"
      clearable
      placeholder="请输入内容"
      v-model="textarea1">
    </el-input>
     <el-button @click="generateTree">生成</el-button>

    <el-tree class="tree"  :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    <!-- 添加属性default-expand-all 默认展开所有节点 -->

    <span>{{testText}}</span>
  </div>
</template>

<script>
export default {
  name: 'App',
  // ↓使用return包裹后数据中变量只在当前组件中生效，不会影响其他组件，防止数据污染
  data () {
    return {
      textarea1: '',
      testText: 'testText',

      regexp: {
        teacher: /^导师：(\S+)$/m,
        stu: /^(\d+级)(本科|硕士|博士)生：(\S+)/mg,
        job: /\n\n(\S+)：(\S+)/mg
      },

      oneData: {
        label: '9级 1',
        children: [{
          label: '9级 1-1'
        }]
      },

      treeData: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],

      defaultProps: {
        children: 'children',
        label: 'label'
        // 定义上述要生成节点的对象列表中所采用的属性名
      }
    }
  },
  methods: {
    handleNodeClick (data) {
      console.log(data)
    },
    generateTree (e) {
      if (!this.textarea1) {
        return false
      }
      for (const s of this.textarea1.split('\n\n\n')) {
        const teacher = {}
        let tmp = s.match(this.regexp.teacher)
        if (tmp === null) {
          return false
        }
        teacher.label = tmp[1] // 一级，导师

        teacher.children = []
        for (tmp of s.matchAll(this.regexp.stu)) {
          const grade = {}
          grade.label = tmp[1] // 二级，年份，todo 重复的应覆盖
          grade.children = []
          const edu = {}
          edu.label = tmp[2] // 三级，学历
          edu.children = []
          for (const n of tmp[3].split('、')) {
            edu.children.push({ label: n }) // 四级，姓名
          }
          grade.children.push(edu)
          teacher.children.push(grade)
        }

        console.log(Array.from(s.matchAll(this.regexp.job)))

        this.treeData.push(teacher)
      }

      this.testText = this.textarea1
      this.textarea1 = ''
      // this.treeData.push(this.oneData)
    }
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto 0;
  width: 800px;

  .tree {
    margin: 20px 0;
  }
}
</style>
