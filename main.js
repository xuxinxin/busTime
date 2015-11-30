/**
 * Created by star on 15/11/19.
 */
(function(){
    console.log('hello');
    var DayTransform = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
    var busTime = [
        {time:"8:20", number:"2"},
        {time:"8:40", number:"2"},
        {time:"8:55", number:"2"},
        {time:"9:20", number:"2"},
        {time:"9:55", number:"1"},
        {time:"11:00",number:"2"},
        {time:"11:30",number:"4"},
        {time:"12:20",number:"2"},
        {time:"13:30",number:"2"},
        {time:"13:40",number:"1"},
        {time:"14:00",number:"2"},
        {time:"15:20",number:"1"},
        {time:"16:30",number:"2"},
        {time:"17:10",number:"3"},
        {time:"18:00",number:"2"},
        {time:"18:20",number:"1"},
        {time:"20:50",number:"1"},
        {time:"21:50",number:"循环"},
        {time:"22:40",number:"终止"}
    ];
    var backBusTime = busTime.map(function(item){
        var newItem = {};
        var timeArray = item.time.split(":");
        if(parseInt(timeArray[1])+10 >= 60){

            var left = parseInt(timeArray[0])+1;
            var right = (parseInt(timeArray[1])+10)%60;
            if(right < 10){
                right = '0'+ right;
            }

        }else{
            left = parseInt(timeArray[0]);
            right = parseInt(timeArray[1])+10;
            if(left == 15){
                right += 5;
            }
        }
        newItem.time = left+":"+right;
        newItem.number = item.number;
        return newItem;
    });
    window.b = backBusTime;
    $ = document.querySelector;

    function getNextBusTime(busTime){

        var nextBusIndex = getNextBusIndex(busTime);

        if(nextBusIndex){
            return {
                hour: +busTime[nextBusIndex].time.split(":")[0],
                min: +busTime[nextBusIndex].time.split(":")[1]
            };
        }else{
            return null;
        }
    }

    function getNextBusIndex(busTime) {
        var now ={
            hour: (new Date()).getHours(),
            min: (new Date()).getMinutes()
        };
        for(var i = 0 ; i<busTime.length;i++){
            var time = {
                hour: +busTime[i].time.split(":")[0],
                min: +busTime[i].time.split(":")[1]
            };

            if(time.hour > now.hour || (time.hour === now.hour && time.min > now.min)){
                return i;
            }

        }
        return null;
    }

    function getRemainderTime(busTime){
        var now ={
            hour: (new Date()).getHours(),
            min: (new Date()).getMinutes(),
            sec: (new Date()).getSeconds()
        };
        var nextTime = getNextBusTime(busTime);
        var remainderTime = {
            min: 0,
            sec: 0
        };
        if(nextTime){
            if( parseInt(nextTime.hour) > now.hour){
                nextTime.min += 60;
            }

            remainderTime.min = nextTime.min - now.min -1;
            remainderTime.sec = 60 - now.sec;
            if(now.sec === 0){
                remainderTime.min = nextTime.min - now.min ;
                remainderTime.sec = 0;
            }

            return remainderTime;
        }else{
            return null;
        }
    }



    var $today = document.querySelector(".today");
    var $month = document.querySelector(".month");
    var $date  = document.querySelector(".date");
    var $time  = document.querySelector(".time");
    var $remainderTime = document.querySelector(".remainder-time");
    var $remainderMinute = document.querySelector(".reserve-minute");
    var $remainderSecond = document.querySelector(".reserve-second");
    var $line = {};
    var $nextBusTime = document.querySelector(".next-bus");
    var $table = document.querySelector("table");
    var today = new Date();
    $today.innerHTML = DayTransform[parseInt(today.getDay())];

    var realBusTime = busTime;
    setTime();
    setInterval(setTime,1000);
    setNextTime();
    setTable(realBusTime);

    function setTime(){
        today = new Date();
        var todayArray = today.toString().split(' ');
        $month.innerHTML = parseInt(today.getMonth())+1;
        $date.innerHTML = todayArray[2];
        $time.innerHTML = todayArray[4];

        var now ={
            hour: today.getHours(),
            min: today.getMinutes(),
            sec: today.getSeconds()
        };
        setRemainderTime();
    }
    //setTable(backBusTime);

    function setTable(data){
        data.forEach(function(item,index){
            var className = "line line"+index;
            if(index < getNextBusIndex(busTime)){
                className += " past";
            }else if(index == getNextBusIndex(busTime)){
                className += " next";
            }
            var line = "<tr class='"+className+"'><td>"+item.time+"</td><td>"+item.number+"</td></tr>";
            console.log(line);
            $table.innerHTML += line;
        });
        $lines = document.querySelectorAll('.line');
    }



    function setNextTime(){
        var nextTime = getNextBusTime(realBusTime);
        console.log(nextTime)
        if(nextTime){
            $nextBusTime.innerText = "下一班车是"+nextTime.hour+":"+nextTime.min;
        }else{
            $nextBusTime.innerText = "今天没有班车了"
        }

    }

    function setRemainderTime(){
        var remainderTime = getRemainderTime(realBusTime);
        if(remainderTime){
            $remainderTime.display = "inline";
            $remainderMinute.innerText = remainderTime.min;
            $remainderSecond.innerText = remainderTime.sec;
        }else{
            $remainderTime.display = "none";
        }

    }


    window.today = today;
})();