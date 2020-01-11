class WidgetTest extends HTMLElement {
  shadowRoot = null

  constructor() {
    super();

    this.shadowRoot = this.attachShadow({mode: "closed"});
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          background-color: white !important;
          font-family: Arial !important;
          display: block !important;
        }
      </style>
      <input type="date" id="itemDate" />
      <a href="#" class="btn" id="addToCart">Add to cart</a>
      <a href="#" class="btn" id="clearCart">Clear cart</a>
      <ul id="cartItemsContainer" class="cartItemsContainer">
      </ul>
    `

    this.addToCart = this.addToCart.bind(this)
    this.clearCart = this.clearCart.bind(this)
    this.renderCartItems = this.renderCartItems.bind(this)

    this.shadowRoot.querySelector("#addToCart").onclick = this.addToCart
    this.shadowRoot.querySelector("#clearCart").onclick = this.clearCart

    this.renderCartItems()
  }



  getCartItems() {
    return JSON.parse(localStorage.getItem("cartItems")) || []
  }

  setCartItems(cartItems) {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }

  renderCartItems() {
    let cartItemsContainerElement =
      this.shadowRoot.querySelector("#cartItemsContainer")

    let cartItems = this.getCartItems()
    let html = ""

    for (let item of cartItems) {
      html += `<li>${item.date} - <a href="${item.url}">${item.url}</a></li>`
    }

    cartItemsContainerElement.innerHTML = html || "The cart is empty"
  }

  addToCart() {
    let itemDate = this.shadowRoot.querySelector("#itemDate").value

    if (itemDate) {
      let cartItems = this.getCartItems();
      cartItems.push({date: itemDate, url: window.location.pathname})
      this.setCartItems(cartItems)
      this.renderCartItems()
    }
  }

  clearCart() {
    this.setCartItems([])
    this.renderCartItems()
  }
}

window.customElements.define("widget-test", WidgetTest);

document.addEventListener("DOMContentLoaded", async function(){
  let responseJson = null

  // Stub server call for http/https and file protocol cases
  if (location.protocol == "file:") {
    responseJson = {"widgetContainerSelector": "#widgetplaceholder"}
  } else {
    let response = await fetch("./server.json")
    responseJson = await response.json()
  }

  let widgetContainerSelector = responseJson.widgetContainerSelector
  let widgetContainerElement = document.querySelector(widgetContainerSelector)

  widgetContainerElement.innerHTML = `
    <widget-test></widget-test>
  `
})
