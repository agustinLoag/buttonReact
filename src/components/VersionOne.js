import React, { useEffect, useState } from "react";
import axios from "axios";

const VersionOne = () => {
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(200);
  const [shipping, setShipping] = useState(100);
  const [discount, setDiscount] = useState(500);
  //Listado de los productos a comprar
  const [products, setProducts] = useState([
    { name: "Test product", amount: 2500, quantity: 1 },
    { name: "Test product2", amount: 1500, quantity: 1 },
    { name: "Test product3", amount: 2500, quantity: 1 },
  ]);

  const applyDiscount = () => {
    if (discount !== 0) {
      let tempArray = products;
      tempArray.some((product, key) => {
        let total = product.quantity * product.amount;
        let dis;
        if (discount <= total) {
          dis = discount / product.quantity;
          tempArray[key].amount = product.amount - dis;
        }
      });
      setProducts(tempArray);
    }
  };

  useEffect(() => {
    document.querySelectorAll(".slightpay-button").forEach(function (a) {
        a.remove();
      });
      loadButton();
      const total = calcTotalAmount();
      applyDiscount()
      console.log(total);
      if (total > 6000) {
        console.log("entre al mayor a 6000");
        document.getElementById("button-container").innerHTML =
          "<p style='color: red'>El monto total de una compra con Slightpay va desde los $100 hasta los $6000 </p>";
      }
  }, []);

  const calcTotalAmount = () => {
    const totalAmount = products.reduce(
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
        products,
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

  return (
    <div className="container">
      <h3>
        Pago con SlightPay
        <small class="text-muted"> total de Productos {products.length}</small>
      </h3>
      <div className="row align-items-start">
        {products.map((item) => (
          <div class="row">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Nombre del producto: {item.name}</h5>
                <p className="card-text">${item.amount} MXN</p>
                <p className="card-text">Cantidad: {item.quantity}</p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VersionOne;