import Vue from 'vue'
import { mount } from '@vue/test-utils'
import App from '../../src/App.vue'
import ElementUI from 'element-ui'
import Vue2OrgTree from 'vue2-org-tree'

Vue.use(ElementUI)
Vue.use(Vue2OrgTree)

describe('测试生成树及其他函数', () => {
  const wrapper = mount(App, {
    data () {
      return {
        textarea1: '',
        expandAll: true,
        regexp: {
          teacher: /^导师：(\S+)$/m,
          stu: /^(\d+级)(本科|硕士|博士)生：(\S+)/mg,
          tag: /\n\n(\S+)：(\S+)/mg
        },
        treeData: [],
        nodeData: {}
      }
    }
  })

  wrapper.vm.textarea1 = `
导师：张三
2016级硕士生：刘一

刘一：什么都不会


导师：张二
2022级本科生：刘六

刘六：字节跳动、京东云
  `
  // 就因为输入字符串每行前面多了空格就一直测试不过...
  const button = wrapper.findComponent({ name: 'el-button' })
  button.trigger('click')

  it('generateTree(treeData)', () => {
    const tData = [{ label: '张三', tag: '导师', isTeacher: true, children: [{ label: '2016级', children: [{ label: '硕士', children: [{ label: '刘一', tag: '什么都不会', isTeacher: false, expand: true }], expand: true }], expand: true }], expand: true }, { label: '张二', tag: '导师', isTeacher: true, children: [{ label: '2022级', children: [{ label: '本科', children: [{ label: '刘六', tag: '字节跳动、京东云', isTeacher: false, expand: true }], expand: true }], expand: true }], expand: true }]
    expect(wrapper.vm.treeData).toEqual(tData)
  })

  it('generateTree(nodeData)', () => {
    const nData = { 张三: { isTeacher: true, node: { label: '张三', tag: '导师', isTeacher: true, children: [{ label: '2016级', children: [{ label: '硕士', children: [{ label: '刘一', tag: '什么都不会', isTeacher: false, expand: true }], expand: true }], expand: true }], expand: true } }, 刘一: { isTeacher: false, node: { label: '刘一', tag: '什么都不会', isTeacher: false, expand: true } }, 张二: { isTeacher: true, node: { label: '张二', tag: '导师', isTeacher: true, children: [{ label: '2022级', children: [{ label: '本科', children: [{ label: '刘六', tag: '字节跳动、京东云', isTeacher: false, expand: true }], expand: true }], expand: true }], expand: true } }, 刘六: { isTeacher: false, node: { label: '刘六', tag: '字节跳动、京东云', isTeacher: false, expand: true } } }
    expect(wrapper.vm.nodeData).toEqual(nData)
  })

  it('showPopover(tooltip)', () => {
    const fisrtStu = wrapper.findAll('.org-tree-node-label-inner.tree-student').at(0)
    fisrtStu.trigger('click')
    const tooltip = wrapper.findComponent({ name: 'el-popover' })
    expect(tooltip.text()).toBe('')
    expect(wrapper.vm.popContent).toEqual('什么都不会')
  })
})
