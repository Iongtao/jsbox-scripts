let day = $cache.get('day') || 0
const d = new Date()
const fullYear = d.getFullYear()
const month = fillZero(d.getMonth() + 1)
const date = fillZero(d.getDate() + 1)
const startTime = new Date('2021-04-03').setHours(0, 0, 0, 0)
const nowTime = new Date(`${fullYear}-${month}-${date}`).setHours(0, 0, 0, 0)
const timeSpace = nowTime - startTime
const aDayTime = 3600 * 1000 * 24

if (timeSpace > 0) {
  day = Math.floor(timeSpace / aDayTime)
  $cache.set('day', day)
}

function fillZero (num) {
  return num >= 10 ? String(num) : '0' + num
}





$widget.setTimeline(ctx => {
  return {
    type: 'vstack',
    props: {
      background: $color('#f3f3f3'),
      padding: $insets(16, 10, 16, 10),
      frame: {
        maxWidth: Infinity,
        maxHeight: Infinity,
        alignment: $widget.alignment.top
      },
    },
    views: [
      {
        type: 'hstack',
        props: {
          spacing: 0,
          frame: {
            height: 40
          },
          cornerRadius: {
            value: 8,
            style: 0 // 0: circular, 1: continuous
          }
        },
        views: [
          {
            type: 'text',
            props: {
              background: $color('white'),
              padding: $insets(0, 6, 0, 6),
              frame: {
                maxWidth: Infinity,
                maxHeight: Infinity
              },
              text: '恋爱纪念日',
              minimumScaleFactor: 0.5,
              lineLimit: 1
            }
          },
          {
            type: 'text',
            props: {
              text: day + '天',
              bold: true,
              font: {
                size: 18
              },
              frame: {
                maxHeight: Infinity
              },
              minimumScaleFactor: 0.5,
              lineLimit: 1,
              padding: $insets(4, 4, 4, 4),
              color: $color('#fff'),
              background: $color('#5192ff'),
            }
          }
        ]
      }
    ]
  }
})