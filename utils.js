utils = (function () {


    function getDayOfWeekByIndex(index, upperCase) {
        if (upperCase) {
            return (_getDayOfWeekByIndex(index).toUpperCase())
        } else {
            return _getDayOfWeekByIndex(index)
        }
    }

    function _getDayOfWeekByIndex(index) {
        switch (index) {
            case 0:
                return "Вс";
            case 1:
                return "Пн";
            case 2:
                return "Вт";
            case 3:
                return "Ср";
            case 4:
                return "Чт";
            case 5:
                return "Пт";
            case 6:
                return "Сб";
        }
    }

    function getMonthByIndex(index) {
        switch (index) {
            case 0:
                return "января";
            case 1:
                return "февраля";
            case 2:
                return "марта";
            case 3:
                return "апреля";
            case 4:
                return "мая";
            case 5:
                return "июня";
            case 6:
                return "июля";
            case 7:
                return "августа";
            case 8:
                return "сентября";
            case 9:
                return "октября";
            case 10:
                return "ноября";
            case 11:
                return "декабря";
        }

    }


    function getDayForTimeline(date, index) {
        var day = new Date(date.getTime() + 86400000 * index);
        var dayText;

        switch (index) {
            case 0:
                dayText = "СЕГОДНЯ";
                break;
            case 1:
                dayText = "ЗАВТРА";
                break;
            default:
                dayText = getDayOfWeekByIndex(day.getDay(), true)
        }

        return {
            date: day,
            dayText: dayText
        }

    }

    function configWeekTimeLine() {
        var curDate = new Date(),
            element,
            days = [];
        for (var i = -3; i <= 7; i++) {
            days.push(getDayForTimeline(curDate, i))
        }


        days.forEach(function (day) {
            element = document.createElement("div");
            element.style.display = undefined;
            // element.onclick=selectDay.call(this);
            element.onclick = function () {
                selectDay(this)
            };
            element.dataDate = day.date;
            element.innerHTML = day.dayText;
            element.classList.add("day_block");
            if (day.dayText === "СЕГОДНЯ" || day.dayText === "ЗАВТРА") {
                element.classList.add("long")
            } else {
                element.classList.add("short")
            }
            weekTimeLine.append(element);

        });
    }

    function configTopLeftTime() {
        var date = new Date();
        var day = date.getDate(),
            month = getMonthByIndex(date.getMonth()),
            dayOfWeek = getDayOfWeekByIndex(date.getDay()),
            time = _getHoursAndMinutes(date);//date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
        document.getElementsByClassName('main_time')[0].innerHTML = time.hours + ':' + time.minutes;
        document.getElementsByClassName('main_date')[0].innerHTML = day + ' ' + month + ', ' + dayOfWeek;
        window.setTimeout(arguments.callee, 1000);
    }


    function configTimeLine() {
        var element, i, time,
            nullDate = new Date("Thu Jan 01 1970 00:00:00 GMT+0500 (RTZ 4 (зима))"),
            curTime;

        timeLine.onmousedown = function (event) {
            _onDragTimeLine(this, event)
        };

        for (i = 0; i < 48; i++) {
            element = document.createElement("div");
            element.classList.add("time_label");
            curTime = new Date(nullDate.getTime() + i * 1800000);
            time = _getHoursAndMinutes(curTime);
            element.innerHTML = time.hours + ":" + time.minutes;
            timeLine.appendChild(element);
        }
        var baseTimeLineTranslate = (-(new Date().getHours() * 60 + new Date().getMinutes()) / 1440 * 11 * timeLine.offsetWidth + (timeLine.offsetWidth / 2.5)) + "px";
        timeLine.style.transform = "translateX(" + baseTimeLineTranslate + ")";
        programmScrollBlock.style.transform = "translate3d(" + baseTimeLineTranslate + ",0,0)";
        for (let i in descriptionBlocks) {
            if (descriptionBlocks[i].style) {
                descriptionBlocks[i].style.transform = "translate3d(" + baseTimeLineTranslate.slice(1) + ",0,0)";
            }
        }

        let daysArray = document.getElementsByClassName("day_block"),
            left = 0;
        for (let i=0; i<=2; i++) {
            left = left + daysArray[i].offsetWidth;

        }
        moveableLine.style.transform = "translateX(" + left + "px)";
    }

    function configChannelBlock() {
        channelScrollBlock.onmousedown = function (event) {
            _onDragChannelBlock(this, event)
        };
    }

    function _onDragChannelBlock(channelBlock, event) {
        var startY = event.pageY;
        var tr = channelBlock.style.transform;
        var oldTranslate = tr.slice(tr.indexOf("(") + 1, tr.indexOf(")"));


        function moveAt(e) {
            if (typeof oldTranslate === "string") {
                if (oldTranslate.indexOf("%") > -1) {
                    oldTranslate = +oldTranslate.slice(0, oldTranslate.length - 1) / 100 * channelBlock.offsetHeight
                } else {
                    oldTranslate = (+oldTranslate.slice(0, oldTranslate.length - 2));
                }
            }
            var newTranslate = oldTranslate + (e.pageY - startY);
            if (newTranslate > 0 || (newTranslate < (-channelBlock.offsetHeight * 11)))return;
            channelBlock.style.transform = "translateY(" + newTranslate + "px)";
            var tr = programmScrollBlock.style.transform;
            var programmXTransform = tr.slice(tr.indexOf("(") + 1, tr.indexOf("px") + 2);
            programmScrollBlock.style.transform = "translate3d(" + programmXTransform + "," + newTranslate + "px,0)";


        }

        document.onmousemove = function (e) {
            moveAt(e);
        };

        document.onmouseup = function () {
            document.onmousemove = null;
            channelBlock.onmouseup = null;
        }
    }

    function _onDragTimeLine(timeLine, event) {
        var startX = event.pageX;
        var tr = timeLine.style.transform;
        var oldTranslate = tr.slice(tr.indexOf("(") + 1, tr.indexOf(")"));


        function moveAt(e) {
            if (typeof oldTranslate === "string") {
                if (oldTranslate.indexOf("%") > -1) {
                    oldTranslate = +oldTranslate.slice(0, oldTranslate.length - 1) / 100 * timeLine.offsetWidth
                } else {
                    oldTranslate = (+oldTranslate.slice(0, oldTranslate.length - 2));
                }
            }
            var newTranslate = oldTranslate + (e.pageX - startX);
            if (newTranslate > 0 || (newTranslate < (-timeLine.offsetWidth * 11)))return;
            timeLine.style.transform = "translateX(" + newTranslate + "px)";

            var tr = programmScrollBlock.style.transform;
            var programmYTransform = tr.slice(tr.indexOf(",") + 2, tr.lastIndexOf(","));
            programmScrollBlock.style.transform = "translate3d(" + newTranslate + "px," + programmYTransform + ",0)";
            for (var i in descriptionBlocks) {
                if (descriptionBlocks[i].style) {
                    descriptionBlocks[i].style.transform = "translate3d(" + (-newTranslate) + "px,0,0)";
                }
            }

        }

        document.onmousemove = function (e) {
            moveAt(e);
        };

        document.onmouseup = function () {
            document.onmousemove = null;
            timeLine.onmouseup = null;
        }
    }


    function _getHoursAndMinutes(date) {
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
            hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        return {hours: hours, minutes: minutes}

    }

    function loadData() {

        for (var i in dataModule.channels) {
            var channel = _createChannel(dataModule.channels[i]);
            var programmRow = _createProgramRow(dataModule.channels[i].programms);
            channelScrollBlock.append(channel);
            programmScrollBlock.appendChild(programmRow);
        }
    }

    function _createProgramRow(programms) {
        var programmRow = document.createElement("div");
        var programmDescription = document.createElement("div");
        programmDescription.classList.add("description");
        programmRow.classList.add("programm_row");
        for (var i in programms) {
            var programm = document.createElement("div");
            var programmText = document.createElement("span");
            programm.classList.add("programm");
            programmText.classList.add("programm_text");
            programm.style.width = (programms[i].duration / 7200 * timeLine.offsetWidth - 30) + "px";
            programmText.innerHTML = programms[i].title;
            programm.title = programms[i].title;
            programm.appendChild(programmText);
            programm.dataChannelId = programms[i].channel_id;
            programm.dataDescription = programms[i].title+"\n"+", "+(programms[i].program.country ? programms[i].program.country.title:"")+", "+programms[i].program.genres[0].title+"\n" +programms[i].program.description;
            programm.onclick = function (event) {
                return onProgrammClick(event, this);
            };
            programmRow.appendChild(programm);
            programmRow.appendChild(programmDescription);
        }
        return programmRow
    }

    function _createChannel(channelRec) {
        var channel = document.createElement("div"),
            channelNumber = document.createElement("div"),
            channelName = document.createElement("div");
        channel.classList.add("channel");
        channelNumber.classList.add("channel_number");
        channelNumber.innerHTML = channelRec.er_lcn;
        channelName.classList.add("channel_name");
        channelName.innerHTML = channelRec.title;
        channel.appendChild(channelNumber);
        channel.appendChild(channelName);
        return channel
    }

    return {
        date: {
            getDayOfWeekByIndex: getDayOfWeekByIndex,
            getMonthByIndex: getMonthByIndex,
            getDayForTimeline: getDayForTimeline
        },
        config: {
            configWeekTimeLine: configWeekTimeLine,
            configTimeLine: configTimeLine,
            configChannelBlock: configChannelBlock,
            configTopLeftTime: configTopLeftTime,
            loadData: loadData
        }

    };
}());
