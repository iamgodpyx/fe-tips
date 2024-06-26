<template>
    <div class="half-circle flex flex-col items-start justify-center px-20px pt-15px pb-20px">
      <div class="text-16px mb-10px font-500 line-height-22px">
        {{ `上一出车日峰期在线时长（${formatDateWithRegex(time)}）` }}
      </div>
      <div class="flex items-center justify-center w-100%">
        <canvas id="score" width="300" height="150"></canvas>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue'
  import { formatDateWithRegex } from '@/common/utils'
  
  const props = defineProps<{
    count: number
    total: number
    time: string
  }>()
  
  onMounted(() => {
    const c = document.getElementById('score') as HTMLCanvasElement
    const ctx = c.getContext('2d')!
    const value = '小时'
  
    const x0 = 150 // 圆心坐标
    const y0 = 110 // 圆心坐标
    const r1 = 72 // 外圆半径
    const startAng = 180 // 起始角度
    const endAng = 0
    const lineWidth = 12
  
    let devicePixelRatio = 4 // 定义一个设备像素倍率变量
    c.height = 150 * devicePixelRatio
    c.width = 300 * devicePixelRatio
    // 再缩放抗锯齿
    ctx.scale(devicePixelRatio, devicePixelRatio)
  
    c.style.width = `300px`
    c.style.height = `150px`
  
    // // 根据半径和角度判断x轴坐标
    function getPointX(r, ao) {
      return x0 - r * Math.cos((ao * Math.PI) / 180)
    }
  
    // // 根据半径和角度判断Y轴坐标
    function getPointY(r, ao) {
      return y0 - r * Math.sin((ao * Math.PI) / 180)
    }
  
    // y0 + 5使整体半圆向下移动5px
    ctx.beginPath()
    ctx.arc(x0, y0 + 5, 59, (Math.PI / 180) * startAng, (Math.PI / 180) * endAng, false)
    const linearGradient1 = ctx.createLinearGradient(x0, y0 + 5 - 59, x0, y0 + 5)
    linearGradient1.addColorStop(0, '#FFFFFF') // 起始颜色
    linearGradient1.addColorStop(0.68, 'rgba(255,255,255,0.00)')
    linearGradient1.addColorStop(1, 'rgba(255,255,255,0.00)') // 结束颜色
    ctx.fillStyle = linearGradient1
    ctx.fill()
  
    ctx.beginPath()
    ctx.arc(x0, y0 + 5, 45, (Math.PI / 180) * startAng, (Math.PI / 180) * endAng, false)
    const linearGradient2 = ctx.createLinearGradient(x0, y0 + 5 - 45, x0, y0 + 5)
    linearGradient2.addColorStop(0, '#fff') // 起始颜色
    linearGradient2.addColorStop(0.74, '#FFFEFE')
    linearGradient2.addColorStop(1, '#FFF7F1') // 结束颜色
    ctx.fillStyle = linearGradient2
    ctx.fill()
  
    // 底层的圆弧 无色
    ctx.beginPath()
    ctx.arc(x0, y0, r1, (Math.PI / 180) * startAng, (Math.PI / 180) * endAng, false)
    ctx.strokeStyle = '#ffdcc5'
    ctx.lineWidth = lineWidth - 1
    ctx.lineCap = 'round' // 线的末端设置
    ctx.stroke()
  
    // canvas中间的文字
    ctx.font = 'normal 26px dinum-medium' // 字体大小，样式
    ctx.fillStyle = '#000' // 颜色
    ctx.textAlign = 'center' // 位置
    ctx.textBaseline = 'middle'
    ctx.moveTo(100, 80) // 文字填充位置
    if (String(props.count).includes('.')) {
      ctx.fillText(props.count, 136, 96)
    } else {
      ctx.fillText(props.count, 136, 96)
    }
  
    // canvas中间的文字
    ctx.font = 'normal 11px PingFangSC-Medium' // 字体大小，样式
    ctx.fillStyle = '#000' // 颜色
    // ctx.textAlign = 'center' // 位置
    // ctx.textBaseline = 'middle'
    ctx.moveTo(100, 60) // 文字填充位置
    if (String(props.count).includes('.')) {
      ctx.fillText(value, 165, 99)
    } else {
      ctx.fillText(value, 155, 99)
    }
  
    // 下方0和100的位置
    ctx.font = 'normal 12px PingFangSC-Regular' // 字体大小，样式
    ctx.fillStyle = '#666' // 颜色
    ctx.fillText(`${props.count}小时`, 80, 130)
    ctx.fillText(`${props.total}小时`, 220, 130)
  
    // 标签参数
    const rectWidth = 40
    const rectHeight = 15
    const cornerRadius = 5
  
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
    const x1 = getPointX(r1, (props.count / props.total) * 180)
    const y1 = getPointY(r1, (props.count / props.total) * 180)
    let resultX = 0
    let resultY = 0
    let resultDirection = 'left'
    ctx.font = 'normal 10px PingFangSC-Regular' // 字体大小，样式
    // ctx.fillStyle = '#fff' // 颜色
    ctx.fillStyle = '#000' // 颜色
  
    if (props.count / props.total <= 1 / 3) {
      resultX = Math.round(x1) - rectWidth - 15
      resultY = Math.round(y1) - rectHeight - 5
      resultDirection = 'right'
    } else if (props.count / props.total > 1 / 3 && props.count / props.total < 2 / 3) {
      resultX = Math.round(x1) - rectWidth / 2
      resultY = Math.round(y1) - rectHeight - 13
      resultDirection = 'bottom'
    } else if (props.count / props.total >= 2 / 3) {
      resultX = Math.round(x1) + rectWidth - 15
      resultY = Math.round(y1) - 10
      resultDirection = 'left'
    }
  
    console.log(x1, y1)
  
    // 填充和描边矩形，
    drawRoundedRect(ctx, resultX, resultY, rectWidth, rectHeight, cornerRadius, resultDirection)
    const linearGradient3 = ctx.createLinearGradient(resultX, resultY, resultX + resultX, resultY)
    if (props.count !== props.total) {
      linearGradient3.addColorStop(0, '#a1a1a1')
      linearGradient3.addColorStop(1, '#808080')
    } else {
      linearGradient3.addColorStop(0, '#FF935A')
      linearGradient3.addColorStop(1, '#FE6721')
    }
    ctx.fillStyle = linearGradient3 // 设置填充颜色
    ctx.fill() // 填充矩形
    ctx.lineWidth = 0 // 设置描边宽度
    ctx.strokeStyle = 'transparent' // 设置描边颜色
    ctx.stroke() // 描边矩形
  
    ctx.font = 'normal 10px PingFangSC-Regular' // 字体大小，样式
    ctx.fillStyle = '#fff' // 颜色
  
    let textX = 0
    let textY = 0
    if (props.count / props.total <= 1 / 3) {
      textX = Math.round(x1) - rectWidth - 15
      textY = Math.round(y1) - rectHeight - 5
      ctx.fillText('未达标', textX + 20, textY + 7)
    } else if (props.count / props.total > 1 / 3 && props.count / props.total < 2 / 3) {
      textX = Math.round(x1) - rectWidth / 2
      textY = Math.round(y1) - rectHeight - 15
      ctx.fillText('未达标', textX + 20, textY + 9)
    } else if (props.count / props.total >= 2 / 3 && props.count !== props.total) {
      textX = Math.round(x1) + rectWidth - 15
      textY = Math.round(y1) - 10
      ctx.fillText('未达标', textX + 20, textY + 7)
    } else if (props.count === props.total) {
      textX = Math.round(x1) + rectWidth - 15
      textY = Math.round(y1) - 10
      ctx.fillText('已达标', textX + 20, textY + 7)
    }
  
    // 画外层的圆弧 有色,可变动
    // const blueAng = 145 + (250 / 100) * value // 这里的value是可以根据信用分控制的
    let blueAng = 0 // 这里的value是可以根据信用分控制的
    if (props.count === 0) {
      blueAng = 180
    } else {
      blueAng = -((props.total - props.count) / props.total) * 180
    }
  
    if (props.count !== 0) {
      ctx.beginPath()
      const linearGradient = ctx.createLinearGradient(x0 - r1, y0, x0, y0 - r1)
      linearGradient.addColorStop(0, '#FF935A')
      linearGradient.addColorStop(1, '#FF7E23 ')
      ctx.strokeStyle = linearGradient
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round' // 线的末端设置
  
      console.log('blueAng', blueAng)
  
      let tempAngle = -180
      // let twoEndAngle = percent * 180 + startAngle // 半圆原本是180，加长后是220
      let step = (blueAng - tempAngle) / 50 // 设置步长速度
      // let step = 4 // 设置步长速度
  
      function animLoop() {
        if (tempAngle < blueAng) {
          tempAngle = tempAngle + step
          ctx.beginPath()
          if (tempAngle >= blueAng) {
            ctx.arc(x0, y0, r1, (Math.PI / 180) * startAng, (Math.PI / 180) * blueAng, false)
          } else {
            ctx.arc(x0, y0, r1, (Math.PI / 180) * startAng, (Math.PI / 180) * tempAngle, false)
          }
          ctx.stroke()
          window.requestAnimationFrame(animLoop)
        }
      }
      animLoop()
  
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
  .half-circle
    background-image linear-gradient(180deg, #fff5ee 0%, #fff6ee 49%, rgba(255,247,238,0) 100%)
    background-size 100% 310px
  </style>
  