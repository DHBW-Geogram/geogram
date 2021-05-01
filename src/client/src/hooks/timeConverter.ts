export function timeConverter(timestamp: any) {
  var a = new Date(timestamp);
  var b = "";
  var time = "";

  // var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var monthsNummeric = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  var year = a.getFullYear();
  var month = monthsNummeric[a.getMonth()];

  var date = a.getDate();
  if (date <= 9) {
    b = "0" + date;
  }

  var hour = a.getHours();
  var min = a.getMinutes();
  // var sec = a.getSeconds();

  if (date > 9) {
    time = "- " + date + "." + month + "." + year + " " + hour + ":" + min;
  } else {
    time = "- " + b + "." + month + "." + year + " " + hour + ":" + min;
  }

  return time;
}
