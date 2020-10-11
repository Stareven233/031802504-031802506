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
      <!-- 至少在同棵树里面，label应当唯一，除非一个人在一棵树中同时出现在导师与学生的位置 -->
      <vue2-org-tree
        :data="tree"
        collapsable
        :labelClassName="classOfPopover"
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
        tag: /\n\n(\S+)：(\S+)/mg
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
            id: 6,
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1',
          children: [{
            id: 8,
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            id: 9,
            label: '三级 3-2-1'
          }]
        }]
      }],
      treeData: [],
      // 记录师生节点信息，用于树的合并，{ name: { isTeacher:true, node:对应节点数据的引用 } }
      nodeData: {},

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
        const t = s.match(this.regexp.teacher)
        if (t === null) {
          return false
        }

        teacher.label = t[1] // 一级，导师
        teacher.tag = '导师'
        teacher.isTeacher = true
        // 其他节点没有isTeacher也可，调用时返回undefined
        this.nodeData[t[1]] = { isTeacher: true, node: teacher }

        const tags = {}
        // 为了下面处理学生节点时能写入tag，必须先行处理
        for (const t of s.matchAll(this.regexp.tag)) {
          tags[t[1]] = t[2] // t: name, tag
        }
        // 记录每个学生信息，学生名为键，同名将被覆盖

        teacher.children = []
        for (const stu of s.matchAll(this.regexp.stu)) {
          const grade = {}
          grade.label = stu[1] // 二级，年份
          grade.children = []
          const edu = {}
          edu.label = stu[2] // 三级，学历
          edu.children = []
          for (const name of stu[3].split('、')) {
            const stu = { label: name, tag: tags[name], isTeacher: false }
            edu.children.push(stu) // 四级，姓名

            // console.log(this.nodeData)

            if (this.nodeData[name] && this.nodeData[name].isTeacher) {
              // 在此处合并导师节点到新来的叶节点上，nodeData的isTeacher仍为true
              // 恐怕第二次出现在叶节点要求合并时会出问题，这时该节点相当于同属两个根节点
              stu.children = this.nodeData[name].node.children
              stu.isTeacher = true
              this.nodeData[name].node = { isTeacher: true, node: stu }

              const idx = this.treeData.findIndex(item => item.label === name)
              this.treeData.splice(idx, 1)
              // 合并完删除原来的树
              continue
            }
            this.nodeData[name] = { isTeacher: false, node: stu }
            // 若一个人同为两棵树的叶节点(若其中一个为根节点则会合并)，则nodeData只会保存一份引用
            // 影响在于没有实现两棵树叶节点关联，而且之后若这个人为导师只会接到最新的叶节点上
          }
          grade.children.push(edu)
          this.mergerTree(teacher.children, grade)
        }
        this.mergerTree(this.treeData, teacher)
      }
      this.textarea1 = ''
      this.expandChange()
      // 默认展开这棵树
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
      const node = e.target
      if (node.className.indexOf('tree-teacher') + node.className.indexOf('tree-student') === -2) {
        // 两个都找不到时返回值(每个为-1)加起来为-2
        return
      }
      this.popContent = data.tag || '暂无tag'
      const popNode = document.getElementById(this.$refs.popover.tooltipId)
      const pos = this.getAbsolutePos(node)
      popNode.style.left = pos.left + 'px'
      popNode.style.top = pos.top + node.getBoundingClientRect().height + 10 + 'px'
      // 很坑，left与top必须用绝对坐标，而且popover show之前无法获取坐标等信息
      this.$refs.popover.doShow()
    },
    closePopover () {
      if (typeof this.$refs.popover === 'object') {
        this.$refs.popover.doClose()
      }
    },
    classOfPopover (node) {
      // console.log('from classsOfPopover: ', node)
      if (node.isTeacher) {
        return 'tree-teacher'
      // eslint-disable-next-line brace-style
      }
      else if (node.isTeacher === false) {
        return 'tree-student'
      }
      // node.isTeacher === undefined 说明为中间的年级学历节点
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

  .org-tree-container {
    .tree-teacher {
      color: #ffffff;
      background-color: #ffc082;
    }
  }
}
</style>
