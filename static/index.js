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

const baRoute = document.querySelector(".blockBA");

const selectBa = document.querySelector(".timesBA");

const infoCost = document.querySelector(".info__total-cost");
const infoCount = document.querySelector(".info__total-count");

//////
const timesAB = `
  2022-08-21T18:00:00
  2022-08-21T18:30:00
  2022-08-21T18:45:00
  2022-08-21T19:00:00
  2022-08-21T19:15:00
  2022-08-21T21:00:00
`;

const timesBA = `
  2022-08-21T18:30:00
  2022-08-21T18:45:00
  2022-08-21T19:00:00
  2022-08-21T19:15:00
  2022-08-21T19:35:00
  2022-08-21T21:50:00
  2022-08-21T21:55:00
`;


/////получение геопозиции пользователя
function geoLocation() {
    let geolocation = navigator.geolocation;

    return new Promise((resolve, reject) => {
        geolocation.getCurrentPosition(async (pos) => {
            let lat = pos.coords.latitude;
            let lon = pos.coords.longitude;
            resolve({
                lat,
                lon
            })
        })
    })
}

async function getLocalTIme() {
    const {
        lat,
        lon
    } = await geoLocation();
    const res = await fetch(`https://api.ipgeolocation.io/timezone?apiKey=b8d35f2579674b97ad705cd583b1de1c&lat=${lat}&long=${lon}`)
    return await res.json()
}

function foo() {

}
getLocalTIme().then((data) => {
    let tz = data.timezone_offset
    console.log(data)

})


const parseTimes = (times) => {
    return times
        .trim()
        .split("\n")
        .map((str) => {
            if (0) {
                return moment(str.trim()).utcOffset(tz)._d;
            } else {
                return moment(str.trim())._d;
            }
        });
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


    optionsBA.forEach((option) => {
        let optionBAdate = new Date(Number(option.value));

        option.removeAttribute("disabled");

        if (optionBAdate.getHours() < lowLimitHour) {
            option.setAttribute("disabled", "disabled");

        } else if (optionBAdate.getHours() == lowLimitHour && optionBAdate.getMinutes() < lowLimitMinute) {
            option.setAttribute("disabled", "disabled");

        }
    });
}

tripBackTime();

let tripInfo = {
    cost: 0,
    count: 0,
    where: "",
};


selectAB.addEventListener('click', clearSelectBa)

/// сброс селекта 
function clearSelectBa() {
    selectBa.options[0].selected = 'selected'
}

///подсчет билетов и их стоимость
document.querySelector(".select__wrapper ").addEventListener("click", (e) => {
    if (e.target.closest(".add-btn")) {

        if (selectRoute.value == "из A в B") {
            if (selectAB.value == '') {
                alert('выберите время')
            } else {
                tripInfo["count"] = tripInfo["count"] + 1;
                tripInfo["cost"] = costAB;
                tripInfo["where"] = "из A в B";
                bucket(tripInfo);
            }

        } else if (selectRoute.value == "из A в B и обратно в А") {
            if (selectBa.value == '' || selectAB.value == '') {
                alert('выберите время отправки')
            } else {
                tripInfo["count"] = tripInfo["count"] + 1;
                tripInfo["cost"] = costABA;
                tripInfo["where"] = "из A в B и обратно в А";
                bucket(tripInfo);
            }

        } else {
            if (selectAB.value == '') {
                alert('выберите время')
            } else {
                tripInfo["count"] = tripInfo["count"] + 1;
                tripInfo["cost"] = costAB;
                tripInfo["where"] = "из B в A";
                bucket(tripInfo);
            }
        }
    }
});

/// добавление билетов в корзину
function bucket(tripInfo) {
    const bucketList = document.querySelector(".bucket");
    const dispatchHour = new Date(Number(selectAB.value)).getHours();
    const dispatchMinute = oo(new Date(Number(selectAB.value)).getMinutes());
    let arrivalHour = dispatchHour;
    let arrivalMin = Number(dispatchMinute) + timeTravel;

    //расчет врмени когда пользователь вернется или уедет
    const timeBackHour = new Date(Number(selectBa.value)).getHours();
    const timeBackMinute = oo(new Date(Number(selectBa.value)).getMinutes());
    let arrTimeBackHour = timeBackHour;
    let arrTimeBackMinute = Number(timeBackMinute) + timeTravel;

    if (arrivalMin > 60) {
        arrivalHour = Math.trunc(Number(arrivalMin) / 60) + arrivalHour;
        arrivalMin = oo(arrivalMin % 60);
    }

    if (arrTimeBackMinute > 60) {
        arrTimeBackHour =
            Math.trunc(Number(arrTimeBackMinute) / 60) + arrTimeBackHour;
        arrTimeBackMinute = oo(arrTimeBackMinute % 60);
    }

    if (selectRoute.value == "из A в B" || selectRoute.value == "из B в A") {
        bucketList.innerHTML += `<li class="bucket__item">
        <div class="bucket__inner">
        <div class="bucket__cost"> ${tripInfo.cost}</div>
        <span>&#8381</span>
        <div class="bucket__where"> ${tripInfo.where}</div>
        <div class="bucket__dispatch">${dispatchHour}:${dispatchMinute} - ${arrivalHour}:${arrivalMin}</div>
        </div>
        <button class="bucket__btn">удалить</button>
       </li> `;
    } else {
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

    insertInfo(tickets);
}

///информация о билетах и их стоимости
function insertInfo(tickets) {
    let sum = 0;
    tickets.forEach((ticket) => {
        sum += Number(ticket.querySelector(".bucket__cost").textContent);
    });
    infoCost.innerText = `Общая стоимость билетов : ${sum} рублей`;
    infoCount.innerText = `Количество билетов : ${tickets.length}`;

    document.querySelector(".info").classList.add("active");
}

///удаление билетов из корзины
document.querySelector(".bucket").addEventListener("click", deleteFromBucket);

function deleteFromBucket(e) {
    if (e.target.closest(".bucket__btn")) {
        let li = e.target.closest(".bucket__item");
        li.classList.add("bucket__item--deleted");
        setTimeout(() => {
            li.remove();
        }, 500);
    }
    const tickets = Array.from(document.querySelectorAll(".bucket__item")).filter(
        (ticket) => {
            return !ticket.classList.contains("bucket__item--deleted");
        }
    );

    insertInfo(tickets);
    if (!tickets.length) {
        document.querySelector(".info").classList.remove("active");
    }
}

//input[name] с заглавной буквы  
function upperCase() {
    let input = document.querySelector('.form__item[name= "name"]');
    if (input.value) {
        let firstLetter = input.value[0].toUpperCase()
        let str = input.value.slice(1)
        input.value = firstLetter + str;

    }
}
document.querySelector('.form__item[name= "name"]').addEventListener('keyup', upperCase)

///отправляю информацию на сервер
async function sendData() {
    if (!document.querySelectorAll(".bucket__item").length) {
        alert("вы не купили ни одного билета");
    } else {
        const body = {
            name: document.querySelector('.form__item[name= "name"]').value,
            email: document.querySelector('.form__item[name= "email"]').value,
            cost: document.querySelector(".info__total-cost").textContent,
            count: document.querySelector(".info__total-count").textContent,
        };
        //проверка почты
        if (!validator.isEmail(body.email)) {
            document.querySelector('.form__error').classList.add('active')
            document.querySelector('.form__error').textContent = 'введите корректный email'
        }
        // проверка имени
        else if (!document.querySelector('.form__item[name= "name"]').textContent) {
            document.querySelector('.form__name-error').classList.add('active')
            document.querySelector('.form__name-error').textContent = 'введите ваше имя'
        } else {
            const res = await fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            alert("информация о билетах отправлена на почту");
        }
    }
}

document.querySelector('.form__btn[type="submit"]').addEventListener("click", sendData);