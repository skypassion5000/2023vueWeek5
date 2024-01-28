import userProductModal from './userProductModal.js';

// VeeValidate
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

// VeeValidate 定義規則
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// VeeValidate 加入多國語系
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
  // validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'vuejs';

const app = Vue.createApp({
  data() {
    return {
      loadingStatus: {
        loadingItem: '',
      },
      products: [],
      product: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      cart: {},
      // isLoading: true
    };
  },
  // VeeValidate 註冊元件
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  mounted() { // 初始化
    // loading
    // setTimeout(() => {
    //   this.isLoading = false;
    // },1000)
    // 渲染資料
    this.getProducts();
    this.getCart();
  },
  methods: {
    getProducts() {
      const url = `${apiUrl}/api/${apiPath}/products`;
      axios.get(url)
        .then((response) => {
          this.products = response.data.products;
        }).catch((err) => {
          alert(err.response.data.message);
        });
    },
    getProduct(id) {
      const url = `${apiUrl}/api/${apiPath}/product/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.get(url).then((response) => {
        this.loadingStatus.loadingItem = '';
        this.product = response.data.product;
        // 控制 Vue元件 <user-product-modal ref="userProductModal" :product="product" @add-to-cart="addToCart"></user-product-modal>
        this.$refs.userProductModal.openModal();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    getCart() {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios.get(url).then((response) => {
        this.cart = response.data.data;
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    addToCart(id, qty = 1) {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      this.loadingStatus.loadingItem = id;
      const cart = {
        product_id: id,
        qty,
      };
      // 隱藏 userProductModal
      this.$refs.userProductModal.hideModal();
      axios.post(url, { data: cart }).then((response) => {
        alert(response.data.message);
        this.loadingStatus.loadingItem = '';
        // 取得購物車資訊去渲染
        this.getCart();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    deleteAllCarts() {
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios.delete(url).then((response) => {
        alert(response.data.message);
        this.getCart();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    removeCartItem(id) {
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.delete(url)
        .then((response) => {
          alert(response.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        }).catch((err) => {
          alert(err.response.data.message);
        });
    },
    updateCart(data) {
      const url = `${apiUrl}/api/${apiPath}/cart/${data.id}`;
      this.loadingStatus.loadingItem = data.id;
      const cart = {
        product_id: data.product_id,
        qty: data.qty,
      }
      axios.put(url, { data: cart })
        .then((response) => {
          alert(response.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        }).catch((err) => {
          alert(err.response.data.message);
        });
    },
    createOrder() {
      // console.log(this.form.user,"form");
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      axios.post(url, { data: order })
        .then((response) => {
          alert(response.data.message);
          this.$refs.form.resetForm();
          this.getCart();
        }).catch((err) => {
          alert(err.response.data.message);
        });
    },
  }
});
app.component('userProductModal', userProductModal);
console.log(VueLoading);
app.component('loading', VueLoading.Component);

app.mount('#app');