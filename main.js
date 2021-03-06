/**
 * Created by star on 15/11/19.
 */
(function(){
    'use strict';
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
    var weekendBusTime = [
        {time:"8:30" ,number:"1"},
        {time:"8:50" ,number:"1"},
        {time:"9:20" ,number:"2"},
        {time:"11:20",number:"2"},
        {time:"13:30",number:"1"},
        {time:"14:00",number:"1"},
        {time:"15:00",number:"1"},
        {time:"16:30",number:"2"},
        {time:"17:20",number:"1"},
        {time:"17:40",number:"1"},
        {time:"18:50",number:"1"},
        {time:"20:30",number:"1"},
        {time:"21:50",number:"循环"},
        {time:"22:40",number:"终止"}
    ];

    var backBusTime = getBackTime(busTime);
    var weekendBackBusTime = getBackTime(weekendBusTime);
    var next ={};



    function getBackTime(busTime){
       return busTime.map(function(item){
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
                if(left == 15 && right == 30){
                    right += 5;
                }
            }
            newItem.time = left+":"+right;
            newItem.number = item.number;
            return newItem;
        });
    }

    function getNextBusTime(busTime){
        busTime = busTime || realBusTime;
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

            nextTime.min += (parseInt(nextTime.hour)-now.hour)*60;


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
    var $direction = document.querySelector(".direction");
    var $nextBusTime = document.querySelector(".next-bus");
    var $table = document.querySelector("table");
    var today = new Date();
    $today.innerHTML = DayTransform[parseInt(today.getDay())];


    var realBusTime = busTime;
    if(isWeekendNow()){
        realBusTime = weekendBusTime;
    }
    isNearSchool();
    setTime();
    setInterval(setTime,1000);
    next = getNextBusTime();
    setNextTime();
    setTable(realBusTime);

    function setTime(){
        today = new Date();
        var todayArray = today.toString().split(' ');
        $month.innerHTML = String(today.getMonth()+1);
        $date.innerHTML = todayArray[2];
        $time.innerHTML = todayArray[4];

        var now ={
            hour: today.getHours(),
            min: today.getMinutes(),
            sec: today.getSeconds()
        };

        setRemainderTime();
        if(next.min == now.min && next.hour == now.hour){
            $remainderTime.style.visibility = 'hidden'
        }

        if(next && (next.hour < now.hour || (next.min < now.min && next.hour == now.hour))){
            Event.trigger('tiktok');
            $remainderTime.style.visibility = 'visible';
        }

        if(isWeekendNow()){
            if(realBusTime !== weekendBackBusTime && realBusTime !== weekendBusTime){
                Event.trigger('tiktok');
            }
        }else{
            if(realBusTime !== busTime && realBusTime !== backBusTime){
                Event.trigger('tiktok');
            }
        }

    }
    //setTable(backBusTime);

    function setTable(data){
        var direction ="";
        if(realBusTime == busTime || realBusTime == weekendBusTime){
            direction = "(去谷里)"
        }else{
            direction = "(回学校)"
        }
        $table.innerHTML = '<caption>今天的班车时刻表 <span class="direction">'+direction+'</span></caption>';

        data.forEach(function(item,index){
            var className = "line line"+index;
            if(index < getNextBusIndex(realBusTime)){
                className += " past";
            }else if(index == getNextBusIndex(realBusTime)){
                className += " next";
            }


            $table.innerHTML += "<tr class='"+className+"'><td>"+item.time+"</td><td>"+item.number+"</td></tr>";
        });

        $direction = document.querySelector(".direction");
        $direction.addEventListener('click', function(){
            switch (realBusTime) {
                case busTime:
                    Event.trigger('backFromCnvWeekday');
                    break;
                case backBusTime:
                    Event.trigger('goToCnvWeekday');
                    break;
                case weekendBusTime:
                    Event.trigger('backFromCnvWeekend');
                    break;
                case weekendBackBusTime:
                    Event.trigger('goToCnvWeekend');
                    break;
                default :
                    console.log("wrong");
            }
        })
    }

    function setNextTime(){
        var nextTime = getNextBusTime(realBusTime);
        if(nextTime){
            var minute = nextTime.min < 10 ? '0'+ nextTime.min : nextTime.min;
            $nextBusTime.innerText = "下一班车是"+nextTime.hour+":"+minute;
        }else{
            $nextBusTime.innerText = "今天没有班车了"
        }

    }

    function setRemainderTime(){
        var remainderTime = getRemainderTime(realBusTime);
        if(remainderTime){
            $remainderTime.style.display = "inline";
            $remainderMinute.innerText = ''+ remainderTime.min;
            $remainderSecond.innerText = ''+remainderTime.sec;
        }else{
            console.log("no remainder");
            $remainderTime.style.display = "none";
        }

    }

    function isWeekendNow(){
        var now = new Date();
        return now.getDay() == 6 || now.getDay() == 0;
        //return true;
    }

    Event.add('goToCnvWeekday');
    Event.add('backFromCnvWeekday');
    Event.add('goToCnvWeekend');
    Event.add('backFromCnvWeekend');
    Event.add('changeBustime');
    Event.add('tiktok');

    Event.listen('goToCnvWeekday', function(){
        realBusTime = busTime;
        Event.trigger('changeBustime');
    });
    Event.listen('backFromCnvWeekday', function(){
        realBusTime = backBusTime;
        Event.trigger('changeBustime');
    });
    Event.listen('goToCnvWeekend', function(){
        realBusTime = weekendBusTime;
        Event.trigger('changeBustime');
    });
    Event.listen('backFromCnvWeekend', function(){
        realBusTime = weekendBackBusTime;
        Event.trigger('changeBustime');
    });
    Event.listen('changeBustime', function(){
        //console.log("trigger changeBustime");
        setTable(realBusTime);
        setNextTime();
        setRemainderTime();
        switch (realBusTime) {
            case busTime:
                $direction.innerText = "(去谷里)";
                break;
            case backBusTime:
                $direction.innerText = "(回学校)";
                break;
            case weekendBusTime:
                $direction.innerText = "(去谷里)";
                break;
            case weekendBackBusTime:
                $direction.innerText = "(回学校)";
                break;
            default :
                console.log("wrong");
        }
    });
    Event.listen('tiktok', function(){
        setTable(realBusTime);
        setNextTime();
        next = getNextBusTime();
        setRemainderTime();
    });


    function isNearSchool(){
        if ("geolocation" in navigator) {

            //  公司的纬度 31.870075, 经度 118.8219623
            navigator.geolocation.getCurrentPosition(function(position){

                var latitude = parseInt(position.coords.latitude * 1000);
                if(latitude < 31885){
                    if(realBusTime !== backBusTime && realBusTime !== weekendBackBusTime){
                        $direction.click();
                    }
                }
                console.log(position.coords);
            });
        } else {
            /* 地理位置服务不可用 */
            console.log("地理位置不可用");
            return true;
        }
    }



    window.today = today;
})();