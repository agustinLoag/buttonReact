import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(200);
  const [shipping, setShipping] = useState(100);
  const [discount, setDiscount] = useState(0);
  //Listado de los productos
  const [products, setproducts] = useState([
    { name: "Test product", amount: 2000, quantity: 1 },
    { name: "Test product2", amount: 1500, quantity: 1 },
    { name: "Test product3", amount: 2500, quantity: 1 },
  ]);

  const [listItems, setListItems] = useState([]);
  // const [inputValue, setInputValue] = useState(initalValuesItem);

  // if (discount !== 0) {
  //   products.some((product, key) => {
  //     let total = product.quantity * product.amount;
  //     let dis;
  //     if (discount <= total) {
  //       // descuento para el producto de manera equitativa
  //       dis = discount / product.quantity;
  //       products[key].amount = product.amount - dis;
  //       return products;
  //     }
  //   });
  // }

  useEffect(() => {
    if (listItems.length === 0) {
      loadButton();
    } else {
      document.querySelectorAll(".slightpay-button").forEach(function (a) {
        a.remove();
      });
      loadButton();
      const total = calcTotalAmount();
      console.log(total);
      if (total > 5000) {
        console.log("entre al mayor a 5000");
        // var error = document.getElementById("alert--discount--slightpay");
        document.getElementById("button-container").innerHTML =
          "<p style='color: red'>El monto total de una compra con Slightpay va desde los $100 hasta los $6000, si su compra supera este monto porfavor notifique al comercio para retirar la orden de compra. </p>";
      }
    }
  }, [listItems]);

  const calcTotalAmount = () => {
    const totalAmount = listItems.reduce(
      (prev, cur) => prev + cur.amount * cur.quantity,
      0
    );
    return totalAmount;
  };

  function loadButton(discountId) {
    try {
      let Lightpay = window.Lightpay.default;
      let paymentButtonInstance = new Lightpay({
        onSucces: (resp) => {
          console.log("Aprobado");
        },
        onError: (error) => {
          console.error("error", error);
        },
        products: listItems,
        tax,
        shippingFee: shipping,
        idDiscountCode: discountId ? discountId : 0,
        orderId: 1789,
        urlPurchase: window.location.href,
        type: "default",
      }).render("button-container");
    } catch (e) {
      document.getElementById("button-container").innerHTML =
        "<p style='color: red'>El monto total de una compra con Slightpay va desde los $100 hasta los $6000, si su compra supera este monto porfavor notifique al comercio para retirar la orden de compra. </p>";
      console.error(e, "entre al error");
    }
  }
  const addToList = (item) => {
    console.log(item);
    setListItems((prev) => [item, ...prev]);
    console.log(listItems);
  };

  function onLoad() {
    var shippingFee = Number(shipping);
    var subTotal = subtotal;
    // loadButton();
    var error = document.getElementById("alert--discount--slightpay");
    error.innerHTML = "";
    error.style.display = "none";
    document
      .getElementById("button--discount-slightpay")
      .addEventListener("click", async () => {
        var discountId = null;
        error.style.backgroundColor = "red";
        var code = document.getElementById("input--discount--slightpay").value;
        console.log("object");
        document.querySelectorAll(".slightpay-button").forEach(function (a) {
          a.remove();
        });
        if (!code || code === "") {
          // alert("Hey")
          console.log("Entre al error");
          discountId = null;
          error.style.backgroundColor = "red";
          error.innerHTML =
            "Si vas aplicar un codigo de descuento, por favor ingresalo.";
          showError(error, discountId);
        } else {
          var req = await axios.get(
            `https://api-staging.slightpay.com/discount-code/${code}`
          );
          if (req.status === 200) {
            if (Object.keys(req.data).length > 0) {
              var discount = req.data;
              if (shippingFee + subTotal < discount.minAmount) {
                discountId = null;
                error.style.backgroundColor = "red";
                error.innerHTML = `Para aplicar el descuento debe ser un monto mínimo ${discount.minAmount}`;
              } else {
                discountId = discount.id;
                error.style.backgroundColor = "green";
                error.innerHTML = "Se aplico correctamente el descuento.";
              }
            } else {
              discountId = null;
              error.innerHTML = "El código de descuento no es valido.";
            }
          } else {
            discountId = null;
            error.innerHTML =
              "Error inesperado, por el momento no se puede aplicar el descuento.";
          }
          showError(error, discountId);
        }
      });
  }

  const showError = (error, discountId) => {
    error.style.display = "block";
    setTimeout(function () {
      error.style.display = "none";
    }, 3000);
    setTimeout(function () {
      loadButton(discountId);
    }, 2000);
  };

  return (
    <div className="App">
      <h2>Ejemplo de mi Carrito de Compras</h2>
      {/* VISUALIZAR LOS PRODUCTOS QUE ESTAN AGREGADOS AL CARRITO
      {listItems.map((value) => {
        return (
          <p>{value.name}</p>
        )
      })}
      */}

      <div className="container">
        <div className="row align-items-start">
          {products.map((item) => (
            <div class="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.amount}</p>
                  <p className="card-text">{item.quantity}</p>
                  <button
                    onClick={() => addToList(item)}
                    className="btn btn-primary"
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div>
            <div id="button-container" style={{ marginTop: "35px" }}>
              <div
                id="container--discount--slightpay"
                style={{ marginBottom: "10px", width: "50%" }}
              >
                <div
                  id="container--discount--slightpay"
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    width: "100%",
                  }}
                >
                  {" "}
                  <input
                    id="input--discount--slightpay"
                    placeholder="Código de descuento"
                    type="text"
                    style={{
                      width: "70%",
                      height: "35px",
                      border: "1px solid #c1c1c1",
                      borderRadius: "3px",
                      padding: "0px 10px",
                    }}
                  />{" "}
                  <button
                    id="button--discount-slightpay"
                    style={{
                      width: "30%",
                      borderRadius: "3px",
                      backgroundColor: "#1a4ccd",
                      height: "35px",
                      color: "white",
                      outline: "none",
                      marginLeft: "10px",
                    }}
                  >
                    Aplicar
                  </button>
                </div>
                <p
                  id="alert--discount--slightpay"
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    display: "none",
                    borderRadius: "3px",
                    padding: "3px 10px",
                    marginTop: "6px",
                  }}
                ></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
