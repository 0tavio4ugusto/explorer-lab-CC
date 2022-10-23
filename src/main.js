import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

// CVC
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "000",
}

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },

    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}

// CARD NUMBER

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },

    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],

  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    return foundMask
  },
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)
const securityCodeMasked = IMask(securityCode, securityCodePattern)
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  if (cardHolder.value.length == 0) ccHolder.innerText = "FULANO DA SILVA"
  else ccHolder.innerText = cardHolder.value
})

// CVC

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurityCode = document.querySelector(".cc-security .value")
  if (securityCodeMasked.value.length == 0) ccSecurityCode.innerText = "123"
  else ccSecurityCode.innerText = securityCodeMasked.value
}

// CARD NUMBER

cardNumberMasked.on("accept", () => {
  updateCardNumber(cardNumberMasked.value)
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-info .cc-number")
  if (cardNumberMasked.value.length == 0)
    ccNumber.innerText = "1234 5678 9012 3456"
  else ccNumber.innerText = cardNumberMasked.value
}

// EXPIRATION

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(expiration) {
  const ccExpiration = document.querySelector(".cc-extra .cc-expiration .value")
  if (expirationDateMasked.value.length == 0) ccExpiration.innerText = "01/01"
  else ccExpiration.innerText = expirationDateMasked.value
}

// LUHM

let addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  let num = document.querySelector(".cc-info .cc-number")
  let CardNumberStr = num.innerText.replace(/\s/g, "")
  let CardNumberNoSpaces = parseInt(CardNumberStr)

  function validate(n) {
    let digits = n.toString().split("").map(Number)

    if (digits.length % 2 == 0) {
      digits = digits.map((digit, idx) => (idx % 2 == 0 ? digit * 2 : digit))
    } else
      digits = digits.map((digit, idx) => (idx % 2 == 1 ? digit * 2 : digit))

    //double digits

    digits = digits.map((digit) => (digit > 9 ? digit - 9 : digit))

    const sum = digits.reduce((acc, digit) => (acc += digit), 0)
    console.log(sum)

    return sum % 10 === 0
  }

  if (validate(CardNumberNoSpaces)) {
    document.querySelector("#add-card").style.backgroundColor = "green"
    document.querySelector("#add-card").style.color = "white"
    document.querySelector("#add-card").innerText = "CARTÃO ADICIONADO"

    setTimeout(() => {
      alert(
        "Não se preocupe, isso é só um projeto e os dados do cartão não estão sendo enviados para lugar algum!"
      )
    }, 500)

    setTimeout(() => {
      location.reload()
    }, 5000)
  } else {
    document.querySelector("#add-card").style.backgroundColor = "red"
    document.querySelector("#add-card").style.color = "white"
    document.querySelector("#add-card").innerText = "NUMERO DE CARTÃO INVALIDO"
  }
})
