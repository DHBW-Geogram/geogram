export function timeConverter(timestamp: any) {
  var a = new Date(timestamp);
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

  var date: any = a.getDate();
  if (date <= 9) {
    date = "0" + date;
  }

  var hour: any = a.getHours();
  if (hour <= 9) {
    hour = "0" + hour;
  }

  var min: any = a.getMinutes();
  if (min <= 9) {
    min = "0" + min;
  }
  // var sec = a.getSeconds();

    time = "- " + date + "." + month + "." + year + " " + hour + ":" + min;


  return time;
}
