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

    <!-- <el-tree class="tree"  :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
    <!-- 添加属性default-expand-all 默认展开所有节点 -->
    <div v-for="tree in treeData" :key="tree.label">
      <vue2-org-tree
        :data="tree"
        collapsable
        @on-expand="onExpand"
        @on-node-click="showPopover"
      />
    </div>

     <el-popover
        ref="popover"
        placement="top-start"
        title=""
        width="160"
        trigger="manual"
        :content="popContent">
    </el-popover>
    <!-- <el-button v-popover:popover>focus 激活</el-button> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  // ↓使用return包裹后数据中变量只在当前组件中生效，不会影响其他组件，防止数据污染
  data () {
    return {
      textarea1: '',
      expandAll: true,

      popShow: false,
      popContent: '',

      regexp: {
        teacher: /^导师：(\S+)$/m,
        stu: /^(\d+级)(本科|硕士|博士)生：(\S+)/mg,
        job: /\n\n(\S+)：(\S+)/mg
      },

      // 调试用数据
      treeData0: [{
        id: 0,
        label: '一级 1',
        children: [{
          id: 1,
          label: '二级 1-1',
          children: [{
            id: 2,
            label: '三级 1-1-1'
          }]
        }]
      }, {
        id: 5,
        label: '一级 2',
        children: [{
          id: 4,
          label: '二级 2-1',
          children: [{
            id: 3,
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

      treeData: [{
        label: '张三',
        children: [{
          label: '2021级',
          children: [{
            label: '本科',
            children: [{
              label: 'sb'
            }, {
              label: '哈批'
            }]
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
  mounted () {
    document.addEventListener('click', this.closePopover)
  },
  methods: {
    // 处理原始数据并生成树
    generateTree () {
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
          for (const name of tmp[3].split('、')) {
            edu.children.push({ label: name }) // 四级，姓名
          }
          grade.children.push(edu)
          this.mergerTree(teacher.children, grade)
        }

        console.log(Array.from(s.matchAll(this.regexp.job)))

        this.mergerTree(this.treeData, teacher)
      }
      this.textarea1 = ''
    },
    // arr每个元素都与obj同类，都是{label: xx, children: [{}, ]}的嵌套对像
    // 若其中存在一个元素其label属性与obj的label相同则执行合并，否则obj推入arr中
    mergerTree (arr, obj) {
      const tmp = arr.find(item => item.label === obj.label)
      if (tmp === undefined) {
        arr.push(obj)
        return
      }
      for (const c of obj.children || []) {
        this.mergerTree(tmp.children, c)
      }
      // 替换策略：不同label直接push，否则递归合并children；最终由于学生姓名处无children属性只比较label将脱离递归
    },

    // 递归获取元素相对浏览器的绝对坐标
    getAbsolutePos (element) {
      var pos = { top: 0, left: 0 }
      while (element.offsetParent) {
        pos.top += element.offsetTop
        pos.left += element.offsetLeft
        element = element.offsetParent
      }
      return pos
    },

    showPopover (e, data) {
      // console.log(e, data)
      // e为点击事件，data为被点击的节点数据
      e.stopPropagation()
      // 避免同时触发document上的close
      const leaf = e.target
      if (leaf.parentElement.parentElement.className !== 'org-tree-node is-leaf') {
        return
      }
      this.popContent = data.label
      this.$refs.popover.doShow()
      const popNode = document.getElementById(this.$refs.popover.tooltipId)
      const pos = this.getAbsolutePos(leaf)
      popNode.style.left = pos.left + 'px'
      popNode.style.top = pos.top + leaf.getBoundingClientRect().height + 10 + 'px'
    },
    closePopover () {
      this.$refs.popover.doClose()
    },
    // 展开或闭合节点
    onExpand (e, data) {
      if ('expand' in data) {
        data.expand = !data.expand
        if (!data.expand && data.children) {
          this.collapse(data.children)
        }
      // eslint-disable-next-line brace-style
      }
      else {
        this.$set(data, 'expand', true)
      }
    },
    // 递归处理该节点的子节点
    collapse (arr) {
      var _this = this
      arr.forEach(function (child) {
        if (child.expand) {
          child.expand = false
        }
        child.children && _this.collapse(child.children)
      })
    },

    // 整棵树的展开与闭合
    expandChange () {
      this.toggleExpand(this.treeData, this.expandAll)
    },
    // 展开闭合状态的切换
    toggleExpand (data, val) {
      var _this = this
      if (Array.isArray(data)) {
        data.forEach(function (item) {
          _this.$set(item, 'expand', val)
          if (item.children) {
            _this.toggleExpand(item.children, val)
          }
        })
      // eslint-disable-next-line brace-style
      }
      else {
        this.$set(data, 'expand', val)
        if (data.children) {
          _this.toggleExpand(data.children, val)
        }
      }
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
  margin: 60px auto 200px;
  width: 800px;

  .tree {
    margin: 20px 0;
  }
}
</style>
