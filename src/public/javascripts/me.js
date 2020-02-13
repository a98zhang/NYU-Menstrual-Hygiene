/* 
Reference: 
https://codepen.io/tornord/pen/Qzmbbg
https://observablehq.com/@d3/calendar-view
https://bl.ocks.org/danbjoseph/3f42bb3f0ab6133cfc192e878c9030ed
*/


//const d3 = require('d3@5');

let data = [];


function drawCalendar() {
    const calendarRows = function(month) {
        const m = d3.timeMonth.floor(month);
        return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
    }
    
    const minDate = d3.min(data, function(d) { return new Date(d.date); });
    const maxDate = d3.max(data, function(d) { return new Date(d.date); });

    const cellMargin = 2,
        cellSize = 20;

    const day = d3.timeFormat("%w"),
        week = d3.timeFormat("%U"),
        format = d3.timeFormat("%Y-%m-%d"),
        titleFormat = d3.utcFormat("%a, %d-%b"),
        monthName = d3.timeFormat("%B"),
        months= d3.timeMonth.range(d3.timeMonth.floor(minDate), maxDate);
    
    const svg = d3.select("#calendar").selectAll("svg")
    .data(months)
    .enter().append("svg")
        .attr("class", "month")
        .attr("width", (cellSize * 7) + (cellMargin * 8) )
        .attr("height", function(d) {
        const rows = calendarRows(d);
        return (cellSize * rows) + (cellMargin * (rows + 1)) + 20; // the 20 is for the month labels
        })
    .append("g")

    svg.append("text")
    .attr("class", "month-name")
    .attr("x", ((cellSize * 7) + (cellMargin * 8)) / 2 )
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text(function(d) { return monthName(d); })
    
    const rect = svg.selectAll("rect.day")
    .data(function(d, i) {
        return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1));
    })
    .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("rx", 3).attr("ry", 3) // rounded corners
        .attr("fill", '#eaeaea') // default light grey fill
        .attr("x", function(d) {
        return (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin;
        })
        .attr("y", function(d) {
        return ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) +
                ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) +
                cellMargin + 20;
        })
        .on("mouseover", function(d) {
        d3.select(this).classed('hover', true);
        })
        .on("mouseout", function(d) {
        d3.select(this).classed('hover', false);
        })
        .datum(format);

    rect.append("title")
    .text(function(d) { return titleFormat(new Date(d)); });

    const lookup = d3.nest()
    .key(function(d) { return d.date; })
    .rollup(function(leaves) { return leaves.length; })
    .object(data);

    count = d3.nest()
    .key(function(d) { return d.date; })
    .rollup(function(leaves) { return leaves.length; })
    .entries(data);

    scale = d3.scaleLinear()
    .domain(d3.extent(count, function(d) { return d.value; }))
    .range([0.4,1]); // the interpolate used for color expects a number in the range [0,1] but i don't want the lightest part of the color scheme

}


function addData() {
    const date = document.getElementById("menstrualdate").value;
    const value = document.getElementById("menstrualflow").value;
    data.push({date: date, value: value-50});
    document.getElementById("menstrualdate").value = '';
    document.getElementById("menstrualflow").value = 50;
}

function closeData() {
    document.querySelector('#data').classList.add('hidden');
    drawCalendar();
}



function main() {
    const dataBlk = document.querySelector('#data');
    dataBlk.querySelector(".add").addEventListener('click', addData);
    dataBlk.querySelector(".close").addEventListener('click', closeData);
}

document.addEventListener("DOMContentLoaded", main);