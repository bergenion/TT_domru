(function (json) {

    var result = {};





    var channels = {};
    json.channels.forEach(function (item) {
        channels[item.epg_channel_id] = item;
    });

    json.channels.forEach(function (channel) {
        json.programms.forEach(function (programm) {
            if (programm.channel_id === channel.epg_channel_id) {
                channels[programm.channel_id].programms = channels[programm.channel_id].programms || [];
                channels[programm.channel_id].programms.push(programm);
            }
        })
    });


    return result;


}(dataModule));

var selectedDay = new Date();

function selectDay(clickedDay) {
    var daysArray = document.getElementsByClassName("day_block"),
        left = 0,
        width = clickedDay.classList.contains("short") ? "7%" : "18.5%";

    selectedDay = clickedDay.dataDate;


    for (var i in daysArray) {
        if (daysArray[i].dataDate < clickedDay.dataDate) {
            left = left + daysArray[i].offsetWidth;
        }
    }
    moveableLine.style.transform = "translateX(" + left + "px)";

    moveableLine.style.width = width;

}

function onProgrammClick(event,programm) {
    let i;
    var programms = document.getElementsByClassName("programm_row");
    var descriptionBlock = programm.parentElement.getElementsByClassName("description")[0];
    for (i in descriptionBlocks) {
        if (descriptionBlocks[i].classList) {
            descriptionBlocks[i].classList.remove("shown");
        }
    }
    for (i in programms){
        if (programms[i].classList) {
            programms[i].classList.remove("selected");
            for( var j in programms[i].childNodes){
                if (programms[i].childNodes[j].classList) {
                    programms[i].childNodes[j].classList.remove("selected");
                }
            }
        }
    }
    programm.parentElement.classList.add("selected");
    descriptionBlock.classList.add("shown");
    descriptionBlock.innerHTML = programm.dataDescription;
    programm.classList.add("selected")

}


window.onload = function () {
    (function () {
        timeLine = document.getElementsByClassName("moveable_timeline")[0];
        programmScrollBlock = document.getElementsByClassName("scrollable_programm_block")[0];
        channelScrollBlock = document.getElementsByClassName("scrollable_channel_block")[0];
        weekTimeLine = document.getElementsByClassName("week_timeline")[0];
        descriptionBlocks = document.getElementsByClassName("description");
        moveableLine = document.getElementsByClassName("moveable_underline")[0];
        utils.config.loadData();
        utils.config.configChannelBlock();
        utils.config.configTopLeftTime();
        utils.config.configWeekTimeLine();
        utils.config.configTimeLine();

    })();
};

