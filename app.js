// Define the Home component
const Home = {
  template: `
    <div>
      <h1 class="mb-4">Products</h1>
      <div class="row">
        <div class="col-md-4" v-for="product in products" :key="product.id">
          <div class="card mb-4">
            <img :src="product.image" class="card-img-top" :alt="product.title">
            <div class="card-body">
              <h5 class="card-title">{{ product.title }}</h5>
              <p class="card-text">{{ product.description.slice(0, 60) }}...</p>
              <div class="mt-3">
                <span class="rating">
                  <i v-for="star in 5" :key="star" :class="getStarClass(star, product.rating.rate)"></i>
                </span>
                <span>({{ product.rating.count }} reviews)</span>
              </div>
              <h4 class="card-text"><strong>$ {{ product.price }}</strong></h4>
              <router-link :to="'/product/' + product.id" class="btn btn-primary">View Details</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    `,
  data() {
    return {
      products: [],
    };
  },
  created() {
    $.LoadingOverlay("show");
    axios.get("https://fakestoreapi.com/products").then((response) => {
      this.products = response.data;
    });
    $.LoadingOverlay("hide");
  },
  filters: {
    currency(value) {
      if (!value) return "0.00";
      return `$${value.toFixed(2)}`;
    },
  },
  methods: {
    getStarClass(star, rate) {
      if (star <= Math.floor(rate)) {
        return "fas fa-star"; // Full star
      } else if (star - rate < 1) {
        return "fas fa-star-half-alt"; // Half star
      } else {
        return "far fa-star"; // Empty star
      }
    },
  },
};

// Define the Product component
const Product = {
  template: `
    <div class="row">
      <div class="col-md-6">
        <img :src="product.image" class="img-fluid" :alt="product.title">
      </div>
      <div class="col-md-6">
        <h1>{{ product.title }}</h1>
        <span class="badge badge-success">{{ product.category }}</span>
        <div class="mt-3">
          <span class="rating">
            <i v-for="star in 5" :key="star" :class="getStarClass(star, product.rating.rate)"></i>
          </span>
          <span>({{ product.rating.count }} reviews)</span>
        </div>
        <p class="mt-3">{{ product.description }}</p>
        <h2>$ {{ product.price }}</h2>
        <router-link :to="'/checkout/' + product.id" class="btn btn-primary btn-lg">Check out</router-link>
      </div>
    </div>
    `,
  data() {
    return {
      product: null,
    };
  },
  created() {
    const id = this.$route.params.id;
    axios.get(`https://fakestoreapi.com/products/${id}`).then((response) => {
      this.product = response.data;
    });
  },
  filters: {
    currency(value) {
      if (!value) return "0.00";
      return `$${value.toFixed(2)}`;
    },
  },
  methods: {
    getStarClass(star, rate) {
      if (star <= Math.floor(rate)) {
        return "fas fa-star"; // Full star
      } else if (star - rate < 1) {
        return "fas fa-star-half-alt"; // Half star
      } else {
        return "far fa-star"; // Empty star
      }
    },
  },
};

// Define the Checkout component
const Checkout = {
  template: `
      <div class="container">
        <div class="row">
          <div class="col-md-8">
            <h3>Product Information</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="product">
                  <td>1</td>
                                  <td>
                  <img :src="product.image" alt="Product Image" class="img-fluid" style="max-width: 50px;">
                </td>
                  <td>{{ product.title }}</td>
                  <td>$ {{ product.price }}</td>
                  <td>
                    <input type="number" v-model.number="quantity" min="1" class="form-control" style="width: 80px;">
                  </td>
                  <td>$ {{ (product.price * quantity).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-md-4">
            <h3>Customer Information</h3>
            <form id="checkout-form" @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" class="form-control" id="name" v-model="name" required>
              </div>
              <div class="form-group">
                <label for="phone_number">Phone Number</label>
                <input type="text" class="form-control" id="phone_number" v-model="phoneNumber" required>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" class="form-control" id="email" v-model="email" required>
              </div>
              <div class="form-group">
                <label for="address">Address</label>
                <textarea class="form-control" id="address" v-model="address" rows="3" required></textarea>
              </div>
              <button type="button" class="btn btn-danger" @click="cancelOrder">Cancel</button>
              <button type="submit" class="btn btn-primary">Checkout</button>
            </form>
          </div>
        </div>
      </div>
    `,
  data() {
    return {
      product: null,
      quantity: 1,
      name: "",
      phoneNumber: "",
      email: "",
      address: "",
      telegramBotToken: "6725914615:AAGjq2lsYm-Ql-C96KLRCqr3yO2yE0OLbfY", // Replace with your bot token
      telegramChatId: "-1002196840906", // Replace with your chat ID
    };
  },
  created() {
    const id = this.$route.params.id;
    axios.get(`https://fakestoreapi.com/products/${id}`).then((response) => {
      this.product = response.data;
    });
  },
  methods: {
    handleSubmit() {
      const total_price = this.product.price * this.quantity;
      const message = `<code>Order Details:</code>\n\nProduct: ${this.product.title}\nPrice: $${this.product.price}\nQuantity: ${this.quantity}\nTotal: $${total_price}\n\nCustomer Information:\nName: ${this.name}\nPhone Number: ${this.phoneNumber}\nEmail: ${this.email}\nAddress: ${this.address}`;

      axios
        .post(
          `https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`,
          {
            chat_id: this.telegramChatId,
            text: message,
            photo: this.product.image,
            parse_mode: "HTML",
          }
        )
        .then((response) => {
          alert("Thank you for your purchase!");
          this.$router.push("/");
        })
        .catch((error) => {
          console.error("Error sending order details to Telegram:", error);
        });
    },
    cancelOrder() {
      this.$router.push("/");
    },
  },
};

// Set up the Vue Router
const routes = [
  { path: "/", component: Home },
  { path: "/product/:id", component: Product },
  { path: "/checkout/:id", component: Checkout },
];

const router = new VueRouter({
  routes,
});

// Initialize Vue
new Vue({
  el: "#app",
  router,
});
