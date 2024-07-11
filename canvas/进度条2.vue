<template>
    <div class="score-chart flex flex-col items-start justify-center px-20px pt-15px pb-20px">
      <div class="flex items-center justify-center w-100% relative">
        <div class="animate-number absolute text-#1586F0 font-700 top-50% left-50%">
          <span class="text-50px">{{ showScoreCount.split('.')[0] }}</span>
          <span class="text-30px">{{ `.${showScoreCount.split('.')[1]}` }}</span>
        </div>
        <canvas id="score" width="360" height="240"></canvas>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  
  const props = defineProps<{
    count: string
    total: number
    diffCount: string
  }>()
  
  enum DiffType {
    Increase,
    Decrease,
    Same
  }
  
  const scoreCount = ref(0.0)
  const startTime = ref()
  
  const showScoreCount = computed(() => {
    return String(scoreCount.value.toFixed(2))
  })
  
  // console.log('scoreCount', scoreCount.value)
  
  // 动画函数
  // const animate = () => {
  //   const t = scoreCount.value / 175.34 // 将当前值映射到0到1之间
  //   const newT = bezier(t, 0.17, 0.17, 0.21, 1.0) // 使用贝塞尔函数计算新的t值
  //   const newValue = newT * 175.34 // 将新的t值映射回0到175.34之间
  
  //   // console.log('newValue', newValue)
  
  //   if (newValue < 175.34) {
  //     // 如果新值小于目标值，则更新状态并请求下一帧
  //     scoreCount.value = Number(newValue.toFixed(2))
  //     animationFrameRef.value = requestAnimationFrame(animate)
  //   } else {
  //     // 如果达到或超过目标值，则停止动画
  //     cancelAnimationFrame(animationFrameRef.current)
  //     scoreCount.value = 175.34
  //   }
  // }
  
  const animate = () => {
    startTime.value = null
    startAnimation()
  }
  const startAnimation = () => {
    if (!startTime.value) {
      startTime.value = Date.now()
    }
  
    const currentTime = Date.now()
    const elapsed = currentTime - startTime.value
  
    if (elapsed >= 2000) {
      scoreCount.value = Number(props.count)
    } else {
      const progress = elapsed / 2000
      const easeProgress = ease(progress)
      scoreCount.value = easeValue(scoreCount.value, props.count, easeProgress)
      requestAnimationFrame(startAnimation)
    }
  }
  
  // 贝塞尔缓动函数
  const ease = t => {
    const c1 = 0.17
    const c2 = 0.17
    const c3 = 0.21
    const c4 = 1.0
  
    return c1 * (1 - t) ** 3 + c2 * 3 * (1 - t) ** 2 * t + c3 * 3 * (1 - t) * t ** 2 + c4 * t ** 3
  }
  // 根据缓动进度计算当前值
  const easeValue = (start, end, progress) => {
    return start + (end - start) * progress
  }
  
  const diffType = computed(() => {
    if (props.diffCount.includes('+')) {
      return DiffType.Increase
    }
    if (props.diffCount.includes('-')) {
      return DiffType.Decrease
    }
  
    return DiffType.Same
  })
  onMounted(() => {
    animate()
  })
  // onBeforeMount(() => {
  //   cancelAnimationFrame(animationFrameRef.value)
  // })
  onMounted(() => {
    const c = document.getElementById('score') as HTMLCanvasElement
    const ctx = c.getContext('2d')!
    // const value = '小时'
  
    const x0 = 180 // 圆心坐标
    const y0 = 110 // 圆心坐标
    const r1 = 82 // 外圆半径
    const startAng = 130 // 起始角度
    const endAng = 50
    const lineWidth = 9
  
    let devicePixelRatio = 2 // 定义一个设备像素倍率变量
    c.width = 360 * devicePixelRatio
    c.height = 240 * devicePixelRatio
    // 再缩放抗锯齿
    ctx.scale(devicePixelRatio, devicePixelRatio)
  
    c.style.width = `360px`
    c.style.height = `240px`
  
    // // 根据半径和角度判断x轴坐标
    function getPointX(r, ao) {
      return x0 - r * Math.cos((ao * Math.PI) / 180)
    }
  
    // // 根据半径和角度判断Y轴坐标
    function getPointY(r, ao) {
      return y0 - r * Math.sin((ao * Math.PI) / 180)
    }
  
    // 外圆弧1
    ctx.beginPath()
    ctx.arc(x0, y0, 94, (Math.PI / 180) * startAng, (Math.PI / 180) * endAng, false)
    const linearGradient1 = ctx.createLinearGradient(x0, y0 - 94, x0, y0 + 94)
    linearGradient1.addColorStop(0, 'rgba(255,255,255, 0.3)') // 起始颜色
    linearGradient1.addColorStop(1, 'rgba(255,255,255,0)') // 结束颜色
    ctx.fillStyle = linearGradient1
    ctx.fill()
  
    // 外圆弧2
    ctx.beginPath()
    ctx.arc(x0, y0, 96, (Math.PI / 180) * startAng, (Math.PI / 180) * endAng, false)
    const linearGradient2 = ctx.createLinearGradient(x0, y0 - 96, x0, y0 + 96)
    linearGradient2.addColorStop(0, 'rgba(255,255,255, 0.8)') // 起始颜色
    linearGradient2.addColorStop(1, 'rgba(255,255,255,0)') // 结束颜色
    ctx.strokeStyle = linearGradient2
    ctx.lineWidth = 1
    ctx.lineCap = 'round' // 线的末端设置
    ctx.stroke()
  
    // 外圆弧3
    ctx.beginPath()
    ctx.arc(x0, y0, 108, (Math.PI / 180) * startAng, (Math.PI / 180) * endAng, false)
    const linearGradient3 = ctx.createLinearGradient(x0, y0 - 108, x0, y0 + 108)
    linearGradient3.addColorStop(0, 'rgba(255,255,255, 0.12)') // 起始颜色
    linearGradient3.addColorStop(1, 'rgba(255,255,255,0)') // 结束颜色
    ctx.fillStyle = linearGradient3
    ctx.fill()
  
    // 外圆弧4
    ctx.beginPath()
    ctx.arc(x0, y0, 110, (Math.PI / 180) * startAng, (Math.PI / 180) * endAng, false)
    const linearGradient4 = ctx.createLinearGradient(x0, y0 - 110, x0, y0 + 110)
    linearGradient4.addColorStop(0, 'rgba(255,255,255, 0.4)') // 起始颜色
    linearGradient4.addColorStop(1, 'rgba(255,255,255,0)') // 结束颜色
    ctx.strokeStyle = linearGradient4
    ctx.lineWidth = 1
    ctx.lineCap = 'round' // 线的末端设置
    ctx.stroke()
  
    // 底层的圆弧
    ctx.beginPath()
    ctx.arc(x0, y0, r1, (Math.PI / 180) * startAng, (Math.PI / 180) * endAng, false)
    ctx.strokeStyle = '#c6e2fa'
    ctx.lineWidth = lineWidth - 1
    ctx.lineCap = 'round' // 线的末端设置
    ctx.stroke()
  
    // canvas中间的文字
    ctx.font = 'normal 50px dinum-medium' // 字体大小，样式
    ctx.fillStyle = '#1586F0' // 颜色
    ctx.textAlign = 'center' // 位置
    ctx.textBaseline = 'middle'
    // ctx.moveTo(100, 80) // 文字填充位置
    // const stringNumber = String(props.count).split('.')[0]
    // if (stringNumber.length === 1) {
    //   ctx.fillText(stringNumber, 170, 110)
    // }
  
    // if (stringNumber.length === 2) {
    //   ctx.fillText(stringNumber, 170, 110)
    // }
  
    // if (stringNumber.length === 3) {
    //   ctx.fillText(stringNumber, 165, 110)
    // }
  
    ctx.font = 'normal 30px dinum-medium' // 字体大小，样式
    ctx.fillStyle = '#1586F0' // 颜色
    ctx.textAlign = 'center' // 位置
    ctx.textBaseline = 'middle'
    // ctx.moveTo(100, 80) // 文字填充位置
    // if (stringNumber.length === 1) {
    //   ctx.fillText(`.${String(props.count).split('.')[1]}`, 195, 115)
    // }
  
    // if (stringNumber.length === 2) {
    //   ctx.fillText(`.${String(props.count).split('.')[1]}`, 205, 115)
    // }
  
    // if (stringNumber.length === 3) {
    //   ctx.fillText(`.${String(props.count).split('.')[1]}`, 210, 115)
    // }
  
    // // canvas中间的文字
    // ctx.font = 'normal 11px PingFangSC-Medium' // 字体大小，样式
    // ctx.fillStyle = '#000' // 颜色
    // // ctx.textAlign = 'center' // 位置
    // // ctx.textBaseline = 'middle'
    // ctx.moveTo(100, 60) // 文字填充位置
    // if (String(props.count).includes('.')) {
    //   ctx.fillText(value, 165, 99)
    // } else {
    //   ctx.fillText(value, 155, 99)
    // }
  
    // 下方0和100的位置
    ctx.font = 'normal 12px PingFangSC-Regular' // 字体大小，样式
    ctx.fillStyle = 'rgb(21,134,240, 0.8)' // 颜色
    ctx.fillText('0.00', 127, 190)
    ctx.fillText('200.00', 233, 190)
  
    // 标签参数
    const rectWidth = 82
    const rectHeight = 20
    const cornerRadius = 6
  
    // 绘制圆角矩形的函数
    function drawRoundedRect(ctx, x, y, width, height, radius, direction: string) {
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      if (direction === 'right') {
        ctx.lineTo(x + width, y + height / 2 - 2)
        ctx.lineTo(x + width + 2, y + height / 2)
        ctx.lineTo(x + width, y + height / 2 + 2)
        ctx.lineTo(x + width, y + height - radius)
      } else {
        ctx.lineTo(x + width, y + height - radius)
      }
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      if (direction === 'bottom') {
        ctx.lineTo(x + width / 2 + 2, y + height)
        ctx.lineTo(x + width / 2, y + height + 2)
        ctx.lineTo(x + width / 2 - 2, y + height)
        ctx.lineTo(x + radius, y + height)
      } else {
        ctx.lineTo(x + radius, y + height)
      }
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      if (direction === 'left') {
        ctx.lineTo(x, y + height / 2 + 2)
        ctx.lineTo(x - 2, y + height / 2)
        ctx.lineTo(x, y + height / 2 - 2)
        ctx.lineTo(x, y + radius)
      } else {
        ctx.lineTo(x, y + radius)
      }
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
    }
  
    // 计算刻度坐标、方向
    const x1 = getPointX(r1, (Number(props.count) / props.total) * 280 - 50)
    const y1 = getPointY(r1, (Number(props.count) / props.total) * 280 - 50)
    let resultX = 0
    let resultY = 0
    let resultDirection = 'left'
    ctx.font = 'normal 10px PingFangSC-Regular' // 字体大小，样式
    // ctx.fillStyle = '#fff' // 颜色
    ctx.fillStyle = '#000' // 颜色
  
    if (Number(props.count) / props.total <= 2 / 5) {
      resultX = Math.round(x1) - rectWidth - 10
      resultY = Math.round(y1) - rectHeight
      resultDirection = 'right'
    } else if (Number(props.count) / props.total > 2 / 5 && Number(props.count) / props.total < 3 / 5) {
      resultX = Math.round(x1) - rectWidth / 2
      resultY = Math.round(y1) - rectHeight - 8
      resultDirection = 'bottom'
    } else if (Number(props.count) / props.total >= 3 / 5) {
      resultX = Math.round(x1) + rectWidth - 65
      resultY = Math.round(y1) - 10
      resultDirection = 'left'
    }
  
    console.log(x1, y1)
  
    // // 填充和描边矩形，
    // drawRoundedRect(ctx, resultX, resultY, rectWidth, rectHeight, cornerRadius, resultDirection)
    // const linearGradientTip = ctx.createLinearGradient(resultX, resultY, resultX + rectWidth, resultY)
    // if (diffType.value === DiffType.Increase) {
    //   linearGradientTip.addColorStop(0, '#52D884')
    //   linearGradientTip.addColorStop(1, '#46CA77')
    // } else if (diffType.value === DiffType.Decrease) {
    //   linearGradientTip.addColorStop(0, '#FF7E3A')
    //   linearGradientTip.addColorStop(1, '#FA6528')
    // }
  
    // if (diffType.value !== DiffType.Same) {
    //   ctx.fillStyle = linearGradientTip // 设置填充颜色
    //   ctx.fill() // 填充矩形
    //   ctx.lineWidth = 0 // 设置描边宽度
    //   ctx.strokeStyle = 'transparent' // 设置描边颜色
    //   ctx.stroke() // 描边矩形
    // }
  
    // ctx.font = 'normal 12px PingFangSC-Regular' // 字体大小，样式
    // ctx.fillStyle = '#fff' // 颜色
  
    // let textX = 0
    // let textY = 0
  
    // const labelInfo = `比昨日${props.diffCount}`
  
    // if (Number(props.count) / props.total <= 2 / 5) {
    //   textX = Math.round(x1) - rectWidth + 10
    //   textY = Math.round(y1) - rectHeight + 2
    //   ctx.fillText(labelInfo, textX + 20, textY + 7)
    // } else if (Number(props.count) / props.total > 2 / 5 && Number(props.count) / props.total < 3 / 5) {
    //   textX = Math.round(x1) - rectWidth / 2 + 20
    //   textY = Math.round(y1) - rectHeight - 8
    //   ctx.fillText(labelInfo, textX + 20, textY + 9)
    // } else if (Number(props.count) / props.total >= 3 / 5) {
    //   textX = Math.round(x1) + rectWidth - 45
    //   textY = Math.round(y1) - 7
    //   ctx.fillText(labelInfo, textX + 20, textY + 7)
    // }
  
    // 画外层的圆弧 有色,可变动
    let blueAng = 0 // 这里的value是可以根据信用分控制的
    if (Number(props.count) === 0) {
      blueAng = -230
    } else {
      blueAng = -230 + (Number(props.count) / props.total) * 280
    }
  
    if (Number(props.count) !== 0) {
      // ctx.beginPath()
      // const linearGradient = ctx.createLinearGradient(x0 - r1, y0, x0, y0 - r1)
      // linearGradient.addColorStop(0, '#45ADFB')
      // linearGradient.addColorStop(1, '#1586F0 ')
      // ctx.strokeStyle = linearGradient
      // ctx.lineWidth = lineWidth
      // ctx.lineCap = 'round' // 线的末端设置
  
      console.log('blueAng', blueAng)
  
      let tempAngle = -230
      // let twoEndAngle = percent * 180 + startAngle // 半圆原本是180，加长后是220
      let step = (blueAng - tempAngle) / 50 // 设置步长速度
  
      const finalOpacity = 1
      let tempOpacity = 0
  
      function animLoop() {
        // 圆弧动画
        if (tempAngle < blueAng) {
          tempAngle = tempAngle + step
          ctx.beginPath()
          const linearGradient = ctx.createLinearGradient(x0 - r1, y0, x0, y0 - r1)
          linearGradient.addColorStop(0, '#45ADFB')
          linearGradient.addColorStop(1, '#1586F0 ')
          ctx.strokeStyle = linearGradient
          ctx.lineWidth = lineWidth
          ctx.lineCap = 'round' // 线的末端设置
          if (tempAngle >= blueAng) {
            ctx.arc(x0, y0, r1, (Math.PI / 180) * startAng, (Math.PI / 180) * blueAng, false)
          } else {
            ctx.arc(x0, y0, r1, (Math.PI / 180) * startAng, (Math.PI / 180) * tempAngle, false)
          }
  
          ctx.stroke()
        }
  
        if (tempAngle < blueAng) {
          window.requestAnimationFrame(animLoop)
        }
      }
      animLoop()
  
      setTimeout(() => {
        function animLoop() {
          // tips动画
          if (tempOpacity < finalOpacity) {
            tempOpacity = tempOpacity + 0.02
            // 填充和描边矩形，
            drawRoundedRect(ctx, resultX, resultY, rectWidth, rectHeight, cornerRadius, resultDirection)
            const linearGradientTip = ctx.createLinearGradient(resultX, resultY, resultX + rectWidth, resultY)
            if (diffType.value === DiffType.Increase) {
              linearGradientTip.addColorStop(
                0,
                tempOpacity >= finalOpacity ? `rgba(82,216,132,1)` : `rgba(82,216,132,${tempOpacity})`
              )
              linearGradientTip.addColorStop(
                1,
                tempOpacity >= finalOpacity ? `rgba(70,202,119,1)` : `rgba(70,202,119,${tempOpacity})`
              )
            } else if (diffType.value === DiffType.Decrease) {
              linearGradientTip.addColorStop(
                0,
                tempOpacity >= finalOpacity ? 'rgba(255,126,58,1)' : `rgba(255,126,58,${tempOpacity})`
              )
              linearGradientTip.addColorStop(
                1,
                tempOpacity >= finalOpacity ? 'rgba(250,101,40,1)' : `rgba(250,101,40,${tempOpacity})`
              )
            }
  
            if (diffType.value !== DiffType.Same) {
              ctx.fillStyle = linearGradientTip // 设置填充颜色
              ctx.fill() // 填充矩形
              ctx.lineWidth = 0 // 设置描边宽度
              ctx.strokeStyle = 'transparent' // 设置描边颜色
              ctx.stroke() // 描边矩形
            }
  
            // 字体动画
            ctx.font = 'normal 12px PingFangSC-Regular' // 字体大小，样式
            ctx.fillStyle = tempOpacity >= finalOpacity ? 'rgba(255,255,255,1)' : `rgba(255,255,255,${tempOpacity})` // 颜色
  
            let textX = 0
            let textY = 0
  
            const labelInfo = `比昨日${props.diffCount}`
  
            if (Number(props.count) / props.total <= 2 / 5) {
              textX = Math.round(x1) - rectWidth + 10
              textY = Math.round(y1) - rectHeight + 2
              ctx.fillText(labelInfo, textX + 20, textY + 7)
            } else if (Number(props.count) / props.total > 2 / 5 && Number(props.count) / props.total < 3 / 5) {
              textX = Math.round(x1) - rectWidth / 2 + 20
              textY = Math.round(y1) - rectHeight - 8
              ctx.fillText(labelInfo, textX + 20, textY + 9)
            } else if (Number(props.count) / props.total >= 3 / 5) {
              textX = Math.round(x1) + rectWidth - 45
              textY = Math.round(y1) - 7
              ctx.fillText(labelInfo, textX + 20, textY + 7)
            }
          }
  
          if (tempOpacity < finalOpacity) {
            window.requestAnimationFrame(animLoop)
          }
        }
        animLoop()
      }, 1000)
  
      // setTimeout(() => {
      //   animLoop()
      // }, 500)
      // ctx.arc(x0, y0, r1, (Math.PI / 180) * startAng, (Math.PI / 180) * blueAng, false)
      // ctx.stroke()
    }
  
    // let tempAngle = startAngle
    // let props.total = 100 // 总进度
    // let percent = this.progress / props.total // 百分⽐
    // let twoEndAngle = percent * 180 + startAngle // 半圆原本是180，加长后是220
    // let step = (twoEndAngle - startAngle) / 100 // 设置步长速度
    // function animLoop() {
    //   if (tempAngle < twoEndAngle) {
    //     tempAngle += step
    //     renderRing(startAngle, tempAngle)
    //     window.requestAnimationFrame(animLoop)
    //   }
    // }
    // animLoop()
  })
  </script>
  
  <style lang="stylus" scoped>
  .animate-number
    font-family  'dinum-medium'
    transform translate(-50%, -70%)
  </style>
  