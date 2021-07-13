const moment = require('moment')

const aDayTime = 3600 * 1000 * 24;
const date_cycle_map = new Map([
  [0, "天"],
  [1, "周"],
  [2, "月"],
  [3, "年"],
]);

const list = [
  {
    type: "memorial_day",
    targetTime: "2021-04-03",
    title: "恋爱纪念日",
  },
  {
    type: "countdown_day",
    targetTime: "1995-09-24",
    title: "我的生日",
    cycle: 3,
  },
  {
    type: "countdown_day",
    targetTime: "2000-08-29",
    title: "畑卉的诞辰",
    cycle: 3,
  },
];

// 获取纪念日时长
function getMemorialDay (time) {
  let day = 0;
  if (!time) return day;
  const startTime = moment(time);
  // 纪念日应当算上当天
  const nowTime = moment().add(1, 'days').startOf('day')
  const timeSpace = nowTime - startTime;

  if (timeSpace > 0) {
    day = Math.floor(timeSpace / aDayTime);
  }
  return day;
}

// 获取倒数日时长
function getCountdownDay (time) {
  let day = 0;
  if (!time) return day;
  const startTime = moment(time);
  const month = startTime.month();
  const date = startTime.date();
  // 获取目标日期
  const targetTime = moment().set({ 'month': month, 'date': date }).startOf('day')
  // 获取当天
  const nowTime = moment().startOf('day')
  // 计算当天与目标日期差值
  let value = nowTime - targetTime;
  if (value <= 0) {
    // 今年的倒数日还没有过
    value = Math.abs(value);

    day = Math.ceil(value / aDayTime);
    if (day === 0) {
      day = "今天";
    }
  } else {
    // 今年的已经过去了
    // 算明年的
    day = Math.ceil(
      (targetTime.add(1, 'years') -
        nowTime) /
      aDayTime
    );
  }

  return day;
}

// 渲染天数
function renderDay (day) {
  if (day.type === "memorial_day") {
    return String(getMemorialDay(day.targetTime));
  } else if (day.type === "countdown_day") {
    return String(getCountdownDay(day.targetTime));
  }
}

// 渲染视图
function renderViews (list) {
  return list.map((v) => ({
    type: "hstack",
    props: {
      spacing: 0,
      frame: {
        height: 40,
      },
      cornerRadius: {
        value: 8,
        style: 0, // 0: circular, 1: continuous
      },
    },
    views: [
      {
        type: "text",
        props: {
          background: $color("white"),
          padding: $insets(0, 6, 0, 6),
          frame: {
            maxWidth: Infinity,
            maxHeight: Infinity,
          },
          text: v.title,
          minimumScaleFactor: 0.5,
          lineLimit: 1,
        },
      },
      {
        type: "text",
        props: {
          text: renderDay(v),
          bold: true,
          font: {
            size: 24,
          },
          frame: {
            width: 40,
            maxHeight: Infinity,
          },
          minimumScaleFactor: 0.5,
          lineLimit: 1,
          padding: $insets(4, 4, 4, 4),
          color: $color("#fff"),
          background: $color("#5192ff"),
        },
      },
    ],
  }));
}


function render () {
  $widget.setTimeline({
    policy: {
      afterDate: moment().add(1, 'days').startOf('day')
    },
    render: (ctx) => ({
      type: "vstack",
      props: {
        background: $color("#f3f3f3"),
        padding: $insets(16, 10, 16, 10),
        spacing: 8,
        frame: {
          maxWidth: Infinity,
          maxHeight: Infinity,
          alignment: $widget.alignment.top,
        },
      },
      views: renderViews(list),
    })
  });
}


module.exports = {
  render
}