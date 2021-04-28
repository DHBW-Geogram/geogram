
export async function timeConverter(timestamp: any): Promise<string>{  
    
    var a = new Date(await timestamp);
    
    // var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var monthsNummeric = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    var year = a.getFullYear();
    var month = monthsNummeric[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    // var sec = a.getSeconds();

    var time = "- "+ date + '.' + month + '.' + year + ' ' + hour + ':' + min;

    console.log("Time", time);

    return time;
}