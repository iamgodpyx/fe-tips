1. 元素定宽
渲染双倍元素组，动画的一个循环距离为元素组的总宽度（包含子元素width和子元素margin）
 @keyframes first {
      0% {
        transform: translateX(0);
      }

      100% {
        // 170px及为元素组的一个元素所暂居的总宽度（width + margin）
        transform: translateX(calc(-170px * 9)); 
      }
    }
2. 不定宽
终极解法，可以无脑用，下面代码只用修改time变量即可
原理：渲染双倍元素组，通过animation delay + 移动距离恰好错开
      @time: 10s; // 统一动画周期
      &.first {
        animation: animate @time linear infinite;
        animation-delay: calc(@time * -1); // 时间
      }

      &.second {
        animation: animate2 @time linear infinite;
        animation-delay: calc(@time / -2); // 时间
      }

      @keyframes animate {
        0% {
          transform: translateX(100%); //距离
        }

        100% {
          transform: translateX(-100%); // 距离
        }
      }

      @keyframes animate2 {
        0% {
          transform: translateX(0); // 距离
        }

        100% {
          transform: translateX(-200%); // 距离
        }
      }
codesandbox：
https://codesandbox.io/p/sandbox/infinite-scrolling-animation-hmyxxq?file=%2Fsrc%2Fstyles.less%3A12%2C23
