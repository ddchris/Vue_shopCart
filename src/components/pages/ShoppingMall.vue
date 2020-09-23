<template>
  <div>
    <header>
      <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <a class="navbar-brand" href="#">Carousel</a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link" href="#"
                >Home <span class="sr-only">(current)</span></a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Link</a>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" href="#">Disabled</a>
            </li>
          </ul>
          <form class="form-inline mt-2 mt-md-0">
            <input
              class="form-control mr-sm-2"
              type="text"
              placeholder="Search"
              aria-label="Search"
            />
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
              Search
            </button>
          </form>
        </div>
      </nav>
    </header>
    <main role="main">
      <div class="row">
        <div class="col-2">
          <SideBar></SideBar>
        </div>
        <div class="col-10">
          <div id="myCarousel" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img
                  class="first-slide"
                  src="../../../static/imgs/banner1.jpg"
                  alt="First slide"
                />
                <div class="container">
                  <div class="carousel-caption text-left">
                    <h1>Example headline.</h1>
                    <p>
                      Cras justo odio, dapibus ac facilisis in, egestas eget
                      quam. Donec id elit non mi porta gravida at eget metus.
                      Nullam id dolor id nibh ultricies vehicula ut id elit.
                    </p>
                    <p>
                      <a class="btn btn-lg btn-primary" href="#" role="button"
                        >Sign up today</a
                      >
                    </p>
                  </div>
                </div>
              </div>
              <div class="carousel-item">
                <img
                  class="second-slide"
                  src="../../../static/imgs/banner2.jpg"
                  alt="Second slide"
                />
                <div class="container">
                  <div class="carousel-caption">
                    <h1>Another example headline.</h1>
                    <p>
                      Cras justo odio, dapibus ac facilisis in, egestas eget
                      quam. Donec id elit non mi porta gravida at eget metus.
                      Nullam id dolor id nibh ultricies vehicula ut id elit.
                    </p>
                    <p>
                      <a class="btn btn-lg btn-primary" href="#" role="button"
                        >Learn more</a
                      >
                    </p>
                  </div>
                </div>
              </div>
              <div class="carousel-item">
                <img
                  class="third-slide"
                  src="../../../static/imgs/banner3.jpg"
                  alt="Third slide"
                />
                <div class="container">
                  <div class="carousel-caption text-right">
                    <h1>One more for good measure.</h1>
                    <p>
                      Cras justo odio, dapibus ac facilisis in, egestas eget
                      quam. Donec id elit non mi porta gravida at eget metus.
                      Nullam id dolor id nibh ultricies vehicula ut id elit.
                    </p>
                    <p>
                      <a class="btn btn-lg btn-primary" href="#" role="button"
                        >Browse gallery</a
                      >
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <a
              class="carousel-control-prev"
              href="#myCarousel"
              role="button"
              data-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="sr-only">Previous</span>
            </a>
            <a
              class="carousel-control-next"
              href="#myCarousel"
              role="button"
              data-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="sr-only">Next</span>
            </a>
          </div>

          <div class="container marketing">
            <!-- Three columns of text below the carousel -->
            <div class="row">
              <div class="col-lg-4" v-for="item in products" :key="item.id">
                <img
                  :src="item.imageUrl"
                  alt="Generic placeholder image"
                  width="270"
                  height="170"
                  class="products"
                />
                <h5 class="mt-2">
                  <strong>{{ item.title }}</strong>
                </h5>
                <p>{{ item.description }}</p>
                <p>
                  <a class="btn btn-secondary" href="#" role="button"
                    >View details &raquo;</a
                  >
                </p>
              </div>
            </div>

            <!-- START THE FEATURETTES -->
            <hr class="featurette-divider" />

            <div class="row featurette">
              <div class="col-md-7">
                <h2 class="featurette-heading">
                  First featurette heading.
                  <span class="text-muted">It'll blow your mind.</span>
                </h2>
                <p class="lead">
                  Donec ullamcorper nulla non metus auctor fringilla. Vestibulum
                  id ligula porta felis euismod semper. Praesent commodo cursus
                  magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus
                  ac cursus commodo.
                </p>
              </div>
              <div class="col-md-5">
                <img
                  class="featurette-image img-fluid mx-auto"
                  data-src="holder.js/500x500/auto"
                  alt="Generic placeholder image"
                />
              </div>
            </div>

            <hr class="featurette-divider" />

            <div class="row featurette">
              <div class="col-md-7 order-md-2">
                <h2 class="featurette-heading">
                  Oh yeah, it's that good.
                  <span class="text-muted">See for yourself.</span>
                </h2>
                <p class="lead">
                  Donec ullamcorper nulla non metus auctor fringilla. Vestibulum
                  id ligula porta felis euismod semper. Praesent commodo cursus
                  magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus
                  ac cursus commodo.
                </p>
              </div>
              <div class="col-md-5 order-md-1">
                <img
                  class="featurette-image img-fluid mx-auto"
                  data-src="holder.js/500x500/auto"
                  alt="Generic placeholder image"
                />
              </div>
            </div>

            <hr class="featurette-divider" />

            <div class="row featurette">
              <div class="col-md-7">
                <h2 class="featurette-heading">
                  And lastly, this one.
                  <span class="text-muted">Checkmate.</span>
                </h2>
                <p class="lead">
                  Donec ullamcorper nulla non metus auctor fringilla. Vestibulum
                  id ligula porta felis euismod semper. Praesent commodo cursus
                  magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus
                  ac cursus commodo.
                </p>
              </div>
              <div class="col-md-5">
                <img
                  class="featurette-image img-fluid mx-auto"
                  data-src="holder.js/500x500/auto"
                  alt="Generic placeholder image"
                />
              </div>
            </div>

            <hr class="featurette-divider" />

            <!-- /END THE FEATURETTES -->
          </div>

          <footer class="container">
            <p class="float-right"><a href="#">Back to top</a></p>
            <p>
              &copy; 2017-2018 Company, Inc. &middot;
              <a href="#">Privacy</a> &middot; <a href="#">Terms</a>
            </p>
          </footer>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Alert from "../AlertMessage";
import SideBar from "../SideBar";
import { mapState, mapMutations } from 'vuex'
export default {
  name: "Login",
  components: {
    Alert,
    SideBar
  },
  data () {
    return {
      products: [],
      pagination: {},
      tempProduct: {
        title: "",
        category: "",
        origin_price: "",
        price: "",
        unit: "",
        image: "",
        description: "",
        content: "",
        is_enabled: 0,
        imageUrl: "",
        isNew: true,
        num: 1
      },
      status: {
        loadingItem: "",
        addItem: ""
      },
      carts: [],
      finalTotal: 0,
      showOrder: false
    };
  },
  created () {
    this.getProducts();
    // this.getCart();
  },
  computed: {
    ...mapState([
      'isLoading'
    ]),
  },
  methods: {
    ...mapMutations([
      'SETLOADING'
    ]),
    getProducts () {
      const vm = this;
      vm.SETLOADING(true);
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH
        }/products/all`;
      vm.axios
        .get(api)
        .then(response => {
          if (response.data.success) {
            vm.products = response.data.products;
            vm.pagination = response.data.pagination;
          } else {
            vm.$bus.$emit('message:push', data.message, 'danger');
          }
          vm.SETLOADING(false);
        })
        .catch(error => {
          console.log(error);
          vm.$bus.$emit('message:push', error.message, 'danger');
          vm.SETLOADING(false);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* GLOBAL STYLES
-------------------------------------------------- */
/* Padding below the footer and lighter body text */

body {
  padding-top: 3rem;
  padding-bottom: 3rem;
  color: #5a5a5a;
}

/* CUSTOMIZE THE CAROUSEL
-------------------------------------------------- */

/* Carousel base class */
.carousel {
  margin-bottom: 4rem;
}
/* Since positioning the image, we need to help out the caption */
.carousel-caption {
  bottom: 3rem;
  z-index: 10;
}

/* Declare heights because of positioning of img element */
.carousel-item {
  height: 32rem;
  background-color: #777;
}
.carousel-item > img {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  height: 32rem;
}

/* MARKETING CONTENT
-------------------------------------------------- */

/* Center align the text within the three columns below the carousel */
.marketing .col-lg-4 {
  margin-bottom: 1.5rem;
  text-align: center;
}
.marketing h2 {
  font-weight: 400;
}
.marketing .col-lg-4 p {
  margin-right: 0.75rem;
  margin-left: 0.75rem;
}

/* Featurettes
------------------------- */

.featurette-divider {
  margin: 5rem 0; /* Space out the Bootstrap <hr> more */
}

/* Thin out the marketing headings */
.featurette-heading {
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.05rem;
}

/* RESPONSIVE CSS
-------------------------------------------------- */

@media (min-width: 40em) {
  /* Bump up size of carousel content */
  .carousel-caption p {
    margin-bottom: 1.25rem;
    font-size: 1.25rem;
    line-height: 1.4;
  }

  .featurette-heading {
    font-size: 50px;
  }
}

@media (min-width: 62em) {
  .featurette-heading {
    margin-top: 7rem;
  }
}

.products {
  border-radius: 5%;
}
</style>
