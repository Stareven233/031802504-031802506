# 031802504-031802506

## 连接
- [作业发布页](https://edu.cnblogs.com/campus/fzu/SE2020/homework/11277)
- [对应博客园随笔](https://www.cnblogs.com/Stareven233/p/13797157.html)

## 任务
### 输入:
学术家族树以文本形式输入，web页面需要提供一个文本框；考虑学术家族树的文本格式是这样的：
导师：张三
2016级博士生：天一、王二、吴五
2015级硕士生：李四、王五、许六
2016级硕士生：刘一、李二、李三
2017级本科生：刘六、琪七、司四

刘六：JAVA、数学建模

李二：字节跳动、京东云

……

其中，"导师："，"级博士生："，"级硕士生："，"级本科生："和"、"当做关键词处理；若有多组输入，中间空一行。上半部分是人员信息，下半部分是技能树或所在公司历程。

### 输出:
文本的呈现方式没有强制要求，可以自定义为普通格式或XML格式；树的节点，鼠标点击后是可以缩放的。同时，支持呈现多棵树并存、两棵关联树共存等形式。点击某个叶节点，呈现该节点的技能及经历。

## 使用

### npm
- [安装nodejs](https://nodejs.org/)  
注：本仓库使用的是v14.13.1

- 安装vue  
`npm install -g @vue/cli`

- clone该仓库  
`$ git clone https://github.com/Stareven233/031802504-031802506`  

- 安装依赖  
`cd 031802504-031802506`  
`npm install`  

- 编译&运行  
`npm run serve`  

- 编译&运行(生产环境)  
`npm run build`

### dist
- clone该仓库  
`$ git clone https://github.com/Stareven233/031802504-031802506`  

- 服务器打开`031802504-031802506/dist/index.html`  
使用vs code安装live server插件，点击右下方Go live  
或nginx、apache  
或node、python等语言的开发用服务器  

## 运行单元测试  
`npm run test`

