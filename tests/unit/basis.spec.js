import Vue from 'vue'
import { mount } from '@vue/test-utils'
import App from '../../src/App.vue'
import ElementUI from 'element-ui'
import Vue2OrgTree from 'vue2-org-tree'

Vue.use(ElementUI)
Vue.use(Vue2OrgTree)

// describe: 用于创建一个测试集，也可以在外面直接用it
// 与it一样，第一个参数为测试集描述，第二个是测试代码
describe('假定生成正确的页面展示', () => {
  // it: 断言，第一个参数应该是测试描述，第二个是真正运行的测试代码
  // test: 在Jest中与it一样
  const wrapper = mount(App, {
    data () {
      return {
        expandAll: true,
        treeData: [{ label: '张三', tag: '导师', isTeacher: true, children: [{ label: '2016级', children: [{ label: '硕士', children: [{ label: '刘一', tag: '什么都不会', isTeacher: false, expand: true }], expand: true }], expand: true }], expand: true }, { label: '张二', tag: '导师', isTeacher: true, children: [{ label: '2022级', children: [{ label: '本科', children: [{ label: '刘六', tag: '字节跳动、京东云', isTeacher: false, expand: true }], expand: true }], expand: true }], expand: true }],
        nodeData: { 张三: { isTeacher: true, node: { label: '张三', tag: '导师', isTeacher: true, children: [{ label: '2016级', children: [{ label: '硕士', children: [{ label: '刘一', tag: '什么都不会', isTeacher: false, expand: true }], expand: true }], expand: true }], expand: true } }, 刘一: { isTeacher: false, node: { label: '刘一', tag: '什么都不会', isTeacher: false, expand: true } }, 张二: { isTeacher: true, node: { label: '张二', tag: '导师', isTeacher: true, children: [{ label: '2022级', children: [{ label: '本科', children: [{ label: '刘六', tag: '字节跳动、京东云', isTeacher: false, expand: true }], expand: true }], expand: true }], expand: true } }, 刘六: { isTeacher: false, node: { label: '刘六', tag: '字节跳动、京东云', isTeacher: false, expand: true } } }
      }
    }
  })

  it('验证输入框', () => {
    expect(wrapper.get('.el-textarea__inner'))
  })

  it('验证生成按钮', () => {
    const button = wrapper.findComponent({ name: 'el-button' })
    expect(button.text()).toBe('生成')
  })

  it('验证生成的树数量', () => {
    expect(wrapper.findAllComponents(Vue2OrgTree).length).toBe(2)
  })

  it('验证树节点信息', () => {
    expect(wrapper.findAll('.org-tree-node-label-inner.tree-teacher').at(1).text()).toEqual('张二')
  })
})
