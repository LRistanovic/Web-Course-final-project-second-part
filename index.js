// JSON BLOB

let obj = {products: []}

// let blobUrl

// async function postBlob() {
//     let request = await fetch("https://jsonblob.com/api/jsonBlob", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json",
//             "redirect": "follow"
//         },
//         body: JSON.stringify({products:[]})
//     })
//     blobUrl = await request.headers.get("Location")
//     localStorage.setItem("blobUrl", blobUrl)
// }

// async function putBlob(newBlob) {
//     let request = fetch(blobUrl, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(newBlob)
//     })
// }

// async function getBlob(url) {
//     let response = fetch(url)
//     let data = await response.json()
//     fillSecondColumn(data.products)
// }

// if (localStorage.getItem("blobUrl") === null)
//     postBlob()
// else {
//     getBlob(localStorage.getItem("blobUrl"))
// }

// FIRST COLUMN

let addButton = document.querySelector(".add-product button")
addButton.addEventListener("click", e => {
    e.preventDefault()
    let info = document.querySelectorAll(".add-product input, .add-product textarea")
    let newProduct = {}
    newProduct.bought = false

    let newArticle = document.createElement("div")
    newArticle.className = "product"

    let articleImg = document.createElement("img")
    articleImg.src = info[2].value
    newProduct.urlToImg = info[2].value
    newArticle.appendChild(articleImg)

    let articleName = document.createElement("p")
    articleName.textContent = info[0].value
    newProduct.name = info[0].value
    newArticle.appendChild(articleName)

    let articlePrice = document.createElement("p")
    articlePrice.textContent = "$" + info[3].value
    newProduct.price = info[3].value
    newArticle.appendChild(articlePrice)

    obj.products.push(newProduct)
    // putBlob(obj)

    let detailsButton = document.createElement("button")
    detailsButton.textContent = "Details"
    detailsButton.className = "details-button"
    detailsButton.addEventListener("click", detailsHandler)
    newArticle.appendChild(detailsButton)
    
    let buyButton = document.createElement("button")
    buyButton.textContent = "Buy"
    buyButton.className = "buy-button"
    buyButton.addEventListener("click", buyHandler)
    newArticle.appendChild(buyButton)

    document.querySelector(".list-products").appendChild(newArticle)
})


// SECOND COLUMN

function fillSecondColumn(products) {
    for (product of products) {
        let newArticle = document.createElement("div")
        newArticle.className = "product"

        newArticle.innerHtml = `
            <img src="${product.urlToImg}" />
            <p>${product.name}</p>
            <p>$${product.price}</p>
        `

        let detailsButton = document.createElement("button")
        detailsButton.textContent = "Details"
        detailsButton.className = "details-button"
        detailsButton.addEventListener("click", detailsHandler)
        newArticle.appendChild(detailsButton)
        
        let buyButton = document.createElement("button")
        buyButton.textContent = "Buy"
        buyButton.className = "buy-button"
        buyButton.addEventListener("click", buyHandler)
        newArticle.appendChild(buyButton)

        document.querySelector(".list-products").appendChild(newArticle)
    }
}


document.querySelector(".modal-leave").addEventListener("click", e => e.target.parentElement.style.display = "none")

function detailsHandler(e) {
    let modal = document.querySelector(".modal"),
        product = obj.products[getIndex(e.target)]
    
    modal.children[0].textContent = product.name
    modal.children[1].src = product.urlToImg
    modal.children[2].textContent = product.description

    modal.style.display = "block"
    modal.style.transition = "opacity 1s"
    modal.style.opacity = "100%"
}

let totalPrice = 0

function buyHandler(e) {
    let product = obj.products[getIndex(e.target)]
    if (!product.bought) {
        let newBoughtArticle = document.createElement("div")
        newBoughtArticle.class = "shopping-cart-product"
        newBoughtArticle.innerHTML = `
            <div class="product-info">
                <div>
                    <h3>${product.name}</h3>
                    <p>$${product.price} &times; 1</p>
                </div>
                <img src="${product.urlToImg}" />
            </div>
        `
        
        let productCount = document.createElement("div")
        productCount.className = "product-count"
        let minus = document.createElement("button")
        minus.textContent = "-"
        minus.addEventListener("click", reduceNum)
        productCount.appendChild(minus)
        let span = document.createElement("span")
        span.textContent = " 1 "
        productCount.appendChild(span)
        let plus = document.createElement("button")
        plus.textContent = "+"
        plus.addEventListener("click", enlargeNum)
        productCount.appendChild(plus)
        newBoughtArticle.appendChild(productCount)

        document.querySelector(".shopping-cart-products").appendChild(newBoughtArticle)
        totalPrice += parseFloat(product.price)
        document.querySelector(".shopping-cart-summary b").textContent = "$" + totalPrice
    }
    product.bought = true
}

function getIndex(element) {
    return Array.from(document.querySelectorAll(".product")).indexOf(element.parentElement)
}


// THIRD COLUMN

function reduceNum(e) {
    e.target.nextSibling.nextSibling.style.border = "1px solid #eee"
    let str = getStr(e.target)
    if (e.target.nextSibling.textContent !== " 1 ") {
        let num = parseInt(e.target.nextSibling.textContent) - 1
        e.target.nextSibling.textContent = ` ${num} `
        let str = getStr(e.target)
        let str1 = str.textContent.slice(0, str.textContent.indexOf("×"))
        let str2 = str.textContent.slice(str.textContent.indexOf("×") + 1)
        str.textContent = str1 + "× " + (parseInt(str2) - 1)
        
        totalPrice -= parseFloat(str.textContent.slice(1))
        document.querySelector(".shopping-cart-summary b").textContent = "$" + totalPrice
    } else {
        totalPrice -= parseFloat(str.textContent.slice(1))
        document.querySelector(".shopping-cart-summary b").textContent = "$" + totalPrice
        e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement)
    }
}

function enlargeNum(e) {
    if (e.target.previousSibling.textContent !== " 10 ") {
        let num = parseInt(e.target.previousSibling.textContent) + 1
        e.target.previousSibling.textContent = ` ${num} `
        let str = getStr(e.target)
        let str1 = str.textContent.slice(0, str.textContent.indexOf("×"))
        let str2 = str.textContent.slice(str.textContent.indexOf("×") + 1)
        str.textContent = str1 + "× " + (parseInt(str2) + 1)
        
        totalPrice += parseFloat(str.textContent.slice(1))
        document.querySelector(".shopping-cart-summary b").textContent = "$" + totalPrice
    } else {
        e.target.style.border = ".5px solid red"
    }
}

const getStr = button => str = button.parentElement.parentElement.firstElementChild.firstElementChild.lastElementChild

document.querySelector(".shopping-cart-summary").lastElementChild.firstElementChild.addEventListener("click", e => {
    
})