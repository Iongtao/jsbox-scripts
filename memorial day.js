function fillZero(num) {
  return num >= 10 ? String(num) : "0" + num;
}

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
function getMemorialDay(time) {
  let day = 0;
  if (!time) return day;
  const d = new Date();
  const fullYear = d.getFullYear();
  const month = fillZero(d.getMonth() + 1);
  const date = fillZero(d.getDate() + 1);
  const startTime = new Date(time).setHours(0, 0, 0, 0);
  const nowTime = new Date(`${fullYear}-${month}-${date}`).setHours(0, 0, 0, 0);
  const timeSpace = nowTime - startTime;

  if (timeSpace > 0) {
    day = Math.floor(timeSpace / aDayTime);
  }
  return day;
}

// 获取倒数日时长
function getCountdownDay(time) {
  let day = 0;
  if (!time) return day;
  const startTime = new Date(time);
  const month = fillZero(startTime.getMonth());
  const date = fillZero(startTime.getDate());
  // 获取目标日期
  const targetTime = (function () {
    const d = new Date();
    d.setMonth(month);
    d.setDate(date);
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  // 获取当天
  const nowTime = (function () {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  // 计算当天与目标日期差值
  let value = new Date(nowTime).getTime() - new Date(targetTime).getTime();

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
      (targetTime.setFullYear(new Date().getFullYear() + 1) -
        new Date(nowTime).getTime()) /
        aDayTime
    );
  }

  return day;
}

// 渲染天数
function renderDay(day) {
  if (day.type === "memorial_day") {
    return String(getMemorialDay(day.targetTime));
  } else if (day.type === "countdown_day") {
    return String(getCountdownDay(day.targetTime));
  }
}

// 渲染视图
function renderViews(list) {
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

$widget.setTimeline((ctx) => {
  return {
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
  };
});
