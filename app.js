(function (json) {

    var result = {};





    var channels = {};
    json.channels.forEach(function (item) {
        channels[item.epg_channel_id] = item;
    });

    json.channels.forEach(function (channel) {
        json.programs.forEach(function (program) {
            if (program.channel_id === channel.epg_channel_id) {
                channels[program.channel_id].programs = channels[program.channel_id].programs || [];
                channels[program.channel_id].programs.push(program);
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

function onprogramClick(event,program) {
    let i;
    var programs = document.getElementsByClassName("program_row");
    var descriptionBlock = program.parentElement.getElementsByClassName("description")[0];
    for (i in descriptionBlocks) {
        if (descriptionBlocks[i].classList) {
            descriptionBlocks[i].classList.remove("shown");
        }
    }
    for (i in programs){
        if (programs[i].classList) {
            programs[i].classList.remove("selected");
            for( var j in programs[i].childNodes){
                if (programs[i].childNodes[j].classList) {
                    programs[i].childNodes[j].classList.remove("selected");
                }
            }
        }
    }
    program.parentElement.classList.add("selected");
    descriptionBlock.classList.add("shown");
    descriptionBlock.innerHTML = program.dataDescription;
    program.classList.add("selected")

}


window.onload = function () {
    (function () {
        timeLine = document.getElementsByClassName("moveable_timeline")[0];
        programScrollBlock = document.getElementsByClassName("scrollable_program_block")[0];
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

