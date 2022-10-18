"use strict";

/* Время пути в одну сторону 50 минут. */

/* "из A в B" и "из B в A" стоимость одного билета 700р.
"из A в B и обратно в А" стоимость составного билета 1200р */

const timeTravel = 50;
const costAB = 700;
const costABA = 1200;

const form = document.querySelector(".form");
const selectRoute = document.querySelector(".route");
const selectAB = document.querySelector(".timesAB");

/* const abaRoute = document.querySelector("[data-aba]"); */
/* const abRoute = document.querySelector(".blockAB"); */
const baRoute = document.querySelector(".blockBA");

const selectBa = document.querySelector(".timesBA");

const infoCost = document.querySelector('.info__total-cost')
const infoCount = document.querySelector('.info__total-count')

//////
const timesAB = `
  2022-08-21 18:00:00
  2022-08-21 18:30:00
  2022-08-21 18:45:00
  2022-08-21 19:00:00
  2022-08-21 19:15:00
  2022-08-21 21:00:00
`;

const timesBA = `
  2022-08-21 18:30:00
  2022-08-21 18:45:00
  2022-08-21 19:00:00
  2022-08-21 19:15:00
  2022-08-21 19:35:00
  2022-08-21 21:50:00
  2022-08-21 21:55:00
`;

const parseTimes = (times) => {
    return times
        .trim()
        .split("\n")
        .map((str) => new Date(str.trim()));
};
//получаем дату
const datesAB = parseTimes(timesAB);
const datesBA = parseTimes(timesBA);

const el = Object.fromEntries(
    ["route", "timesAB", "timesBA", "blockAB", "blockBA", "info"].map(
        (className) => [className, document.querySelector(`.${className}`)]
    )
);

const oo = (n) => {
    return n.toString().padStart(2, "0");
};

//создаем options для ab ba
const createOptions = (datesArray, className) => {
    datesArray.forEach((time) => {
        const option = document.createElement("option");
        option.classList.add(`${className}__option`);
        option.value = time.getTime();
        option.innerText = `${time.getHours()}:${oo(time.getMinutes())}`;
        el[className].appendChild(option);
    });
};

createOptions(datesAB, "timesAB");
createOptions(datesBA, "timesBA");

form.addEventListener("submit", (e) => {
    e.preventDefault();
});

selectRoute.addEventListener("change", tripBack);


function tripBack(e) {
    if (selectRoute.value === "из A в B и обратно в А") {
        baRoute.style.display = "block";
    } else {
        baRoute.style.display = "none";
      /*   document.querySelector(".nice-select.blockAB").style.display = "none"; */
    }
}

selectAB.addEventListener("change", tripBackTime);





function tripBackTime() {
    let hours = new Date(Number(selectAB.value)).getHours();
    let minutes = new Date(Number(selectAB.value)).getMinutes();
    
    let date = {
        hours: hours,
        minutes: 0,
    };
    let Newminutes = minutes + timeTravel;
    let newHour = 0;
    if (Newminutes > 60) {
        newHour = Math.trunc(Newminutes / 60);
        Newminutes = Newminutes % 60;
    }
    date.minutes = Newminutes;
    date.hours = hours + newHour;

    filterTime(date);
}

function filterTime(date) {
    let optionsBA = Array.from(document.querySelectorAll(".timesBA__option"));

    let lowLimitDate = new Date(`2022-08-21 ${date.hours}:${date.minutes}:00`);
    let lowLimitHour = lowLimitDate.getHours();
    let lowLimitMinute = lowLimitDate.getMinutes();
    console.log(lowLimitHour, lowLimitMinute);

    optionsBA.forEach((option) => {
        let optionBAdate = new Date(Number(option.value));

        option.removeAttribute("disabled");

        if (optionBAdate.getHours() < lowLimitHour) {
            option.setAttribute("disabled", "disabled");
        } else if (
            optionBAdate.getHours() == lowLimitHour &&
            optionBAdate.getMinutes() < lowLimitMinute
        ) {
            option.setAttribute("disabled", "disabled");
        }
    });
}

tripBackTime();
///подсчет билетов и их стоимость
let tripInfo = {
    cost: 0,
    count: 0,
    where: "",
};

document.querySelector(".select__wrapper ").addEventListener("click", (e) => {
    if (e.target.closest(".add-btn")) {
        if (selectRoute.value == "из A в B") {
            tripInfo["count"] = tripInfo["count"] + 1;
            tripInfo["cost"] = costAB;
            tripInfo["where"] = "из A в B";
            bucket(tripInfo);
        } else if (selectRoute.value == "из A в B и обратно в А") {
            tripInfo["count"] = tripInfo["count"] + 1;
            tripInfo["cost"] = costABA;
            tripInfo["where"] = "из A в B и обратно в А";
            bucket(tripInfo);
        } else {
            tripInfo["count"] = tripInfo["count"] + 1;
            tripInfo["cost"] = costAB;
            tripInfo["where"] = "из B в A";
            bucket(tripInfo);
        }
    }
});

function bucket(tripInfo) {
    const bucketList = document.querySelector(".bucket");
    const dispatchHour = new Date(Number(selectAB.value)).getHours();
    const dispatchMinute = oo( new Date(Number(selectAB.value)).getMinutes());
    let arrivalHour = dispatchHour;
    let arrivalMin =  Number(dispatchMinute) + timeTravel;

//расчет врмени когда пользователь вернется
    const timeBackHour = new Date(Number(selectBa.value)).getHours();
    const timeBackMinute = oo( new Date(Number(selectBa.value)).getMinutes());
    let arrTimeBackHour = timeBackHour;
    let arrTimeBackMinute = Number(timeBackMinute) + timeTravel;

    if (arrivalMin > 60) {
        arrivalHour = Math.trunc(Number(arrivalMin) / 60) + arrivalHour;
        arrivalMin = oo(arrivalMin % 60);
    }

    if (arrTimeBackMinute > 60) {
        arrTimeBackHour = Math.trunc(Number(arrTimeBackMinute) / 60) + arrTimeBackHour;
        arrTimeBackMinute = oo(arrTimeBackMinute % 60);
    }
   
   
    if ((selectRoute.value == 'из A в B') || (selectRoute.value == 'из B в A')) {
        bucketList.innerHTML += `<li class="bucket__item">
        <div class="bucket__inner">
        <div class="bucket__cost"> ${tripInfo.cost}</div>
        <div class="bucket__where"> ${tripInfo.where}</div>
        <div class="bucket__dispatch">${dispatchHour}:${dispatchMinute} - ${arrivalHour}:${arrivalMin}</div>
        </div>
        <button class="bucket__btn">удалить</button>
       </li> `;
    }
    else{
        bucketList.innerHTML += `<li class="bucket__item">
        <div class="bucket__inner">
        <div class="bucket__cost"> ${tripInfo.cost}</div>
        <div class="bucket__where"> ${tripInfo.where}</div>
        <div class="bucket__dispatch">${dispatchHour}:${dispatchMinute} - ${arrivalHour}:${arrivalMin}</div>
        <div class="bucket__dispatch">${timeBackHour}:${timeBackMinute} - ${arrTimeBackHour}:${arrTimeBackMinute}</div>
        </div>
        <button class="bucket__btn">удалить</button>
       </li> `;
    }

   

   const tickets = Array.from(document.querySelectorAll(".bucket__item"));
   
    insertInfo(tickets)
    saveLocalStorage(tickets)
}


///was here
function insertInfo(tickets) {
    let sum = 0;
    tickets.forEach((ticket)=>{
       sum += Number( ticket.querySelector('.bucket__cost').textContent)
    })
    infoCost.innerText = `Общая стоимость билетов : ${sum}`;
    infoCount.innerText = `Количество билетов : ${tickets.length}`;

    document.querySelector('.info').classList.add('active')
}

///i am here
document.querySelector(".bucket").addEventListener("click", deleteFromBucket);

function deleteFromBucket(e) {
  
    if (e.target.closest(".bucket__btn")) {
        let li = e.target.closest(".bucket__item");
        li.classList.add("bucket__item--deleted");
        setTimeout(() => {
            li.remove();
        }, 500);
    }
    const tickets = Array.from(document.querySelectorAll(".bucket__item")).filter((ticket)=>{
        return !ticket.classList.contains('bucket__item--deleted')
    })
    
     insertInfo(tickets) 
     saveLocalStorage(tickets)
     if (!tickets.length) {
        document.querySelector('.info').classList.remove('active')
     }
     
  
}

function saveLocalStorage(tickets) {//доделать

    console.log(tickets)
}