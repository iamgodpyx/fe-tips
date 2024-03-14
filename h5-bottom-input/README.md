# 吸底输入 BottomInput

### 通用

使用场景：

1. 拉起键盘后出现输入栏，并且**吸附在键盘上方**
2. 输入栏常驻在屏幕最下方，点击输入后，键盘弹起，输入栏**吸附在键盘上方**

详见：[技术方案](https://bytedance.feishu.cn/wiki/wikcnAfixAtUI3oPkZr8BFqs6Fh)

**features:** 兼容 IOS & 安卓键盘弹起问题；

使用方式：

（1）组件初始化：调用 `init` 方法，传入环境相关参数/方法
（2）引入组件

========

> 初始化(`init` 函数)/initialize(`init` function)

| 参数           | 描述                 | 类型                                                                  | 是否必须 | 默认值 |
| -------------- | -------------------- | --------------------------------------------------------------------- | -------- | ------ |
| isIOS          | 是否是 IOS 环境      | () => boolean                                                         | ❌       |        |
| px2rem         | px to rem            | (px: number) => number                                                | ❌       |        |
| getPX          | 设计稿 px to 屏幕 px | (px: number) => number                                                | ❌       |        |
| onKeyboardShow | 键盘出现事件监听器   | (callback: (\_: { keyboard_height: number }) => void) => Subscription | ❌       |        |
| onKeyboardHide | 键盘消失事件监听器   | (callback: (\_: { keyboard_height: number }) => void) => Subscription | ❌       |        |

> 属性/Props

| 参数              | 描述                               | 类型                                      | 是否必须 | 默认值 |
| ----------------- | ---------------------------------- | ----------------------------------------- | -------- | ------ |
| maxLength         | 限制输入字符数                     | number                                    | ❌       |        |
| permanent         | 是否常驻页面底部                   | boolean                                   | ❌       | false  |
| placeholder       | placeholder                        | string                                    | ❌       |        |
| disabled          | 禁用输入框                         | boolean                                   | ❌       |        |
| value             | 受控 value                         | string                                    | ❌       |
| onChange          | 修改输入回调                       | (value: string) => void                   | ❌       |        |
| onSubmit          | 提交时回调                         | `(value: string) => void / Promise<void>` | ❌       |        |
| onCancel          | 未提交时回调                       | () => void;                               | ❌       |        |
| onError           | 提交报错时回调                     | (e: any) => void;                         | ❌       |        |
| onExceedMaxLength | 达到最大字符数时回调               | (value: string) => void;                  | ❌       |        |
| inputExtra        | 提交按钮右侧的额外渲染元素         | React.ReactNode                           | ❌       |        |
| showInputExtra    | 是否展示 inputExtra 区域           | boolean                                   | ❌       |        |
| showSubmitBtn     | 是否展示提交按钮                   | boolean                                   | ❌       |        |
| onKeyboardReady   | 键盘挂载完的回调，用于绑定一些监听 | (kb: SerialMobileBottomInput) => void;    | ❌       |        |
| customStyle       | background?: string; 自定义背景    | null                                      | ❌       |        |

> SerialI18nBottomInputRef ref 属性/ ref methods

| 名称      | 描述              | 类型                    |
| --------- | ----------------- | ----------------------- |
| keyboard  | 键盘对象实例      | SerialMobileBottomInput |
| container | 组件容器实例      | HTMLDivElement          |
| content   | 内容 div 对象实例 | HTMLDivElement          |
| input     | 键盘对象实例      | HTMLTextAreaElement     |

> BottomInputEvent 事件 监听键盘生命周期操作

| 事件名称      | 描述                |
| ------------- | ------------------- |
| trigger       | 点击/触摸输入框容器 |
| focus         | 聚焦                |
| blur          | 失焦                |
| show          | 输入框可见          |
| hide          | 输入框隐藏          |
| loadingChange | loading 状态改变    |
