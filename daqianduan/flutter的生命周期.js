// statefulwidget生命周期

// 1.
createState：该函数为statefulWidget中创建state的方法，当statefulWidget被创建时会立即执行createState。createstate函数执行完毕后表示当前组件已经在widget树中，
此时有一个非常重要的属性mounted被置为true

// 2.
initstate：改函数为state初始化调用，只会被调用一次，因此，通常会在该回调中做一些一次性的操作，如执行state各变量的初始赋值、订阅子树的事件通知、与服务端交互，获取服务端
数据后调用setState来设置state

// 3.
didChangeDependencies：该函数是在该组件依赖的state发生变化时会被调用。这里说的state为全局state，例如系统语言Locale或者应用主题等，flutter框架会通知widget调用
此回调。类似于前端redux存储的state。该方法调用后，组件的状态变为dirty，立即调用build方法

// 4.
build：主要是返回需要渲染的widget，由于build会被调用多次，因此在该函数中只能返回widget相关逻辑，避免因为执行多次而导致状态异常

// 5.
reassemble：主要在开发阶段使用，在debug模式下，每次热重载都会调用该函数，因此在debug阶段可以在此期间增加一些debug代码，来检查代码问题。此回调在release模式下永远不会被
调用

// 6.
didUpdateWidget：该函数主要是在组件重新构建，比如说热重载，父组件发生build的情况下，子组件该方法才会被调用，其次该方法调用之后一定会再调用本组件中的build方法

// 7.
deactivate：在组件被移除节点后会被调用，如果该组件被移除节点，然后未被插入到其他节点时，则会继续调用dispose永久移除

// 8.
dispose：永久移除组件，并释放组件资源。调用完dispose后，mounted属性被设置为false，也代表组件生命周期的结束

// 不是生命周期但是很重要的几个概念

mounted：是state中的一个重要属性，相当于一个标识，用来表示当前组件是否在树中。在createState后initState之前，mounted会被置为true，表示当前组件已经在树中。调用
dispose时，mounted被置气false，表示当前组件不在树中

dirty：表示当前组件为脏状态，下一帧时将会执行build函数，调用setState方法或者执行didUpdateWidget方法后，组件的状态为dirty

clean：与dirty相对应，clean表示组件当前的状态为干净状态，clean状态下组件不会执行build函数


// 大致分为四个阶段
1. 初始化阶段，包括两个生命周期函数createState和initState
2. 组件创建阶段，包括didChangeDependencies和build
3. 触发组件多次build，这个阶段有可能是因为didChangeDependencies、setState或者didUpdateWidget而引发的组件重新build，在组件运行过程中会多次触发，这也是优化过程
中需要着重注意的点
4. 最后组件销毁阶段，deactivate和dispose