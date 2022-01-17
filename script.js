const cartList = document.querySelector('.cart__items');

// Recebe o array de objetos do localStorage
let cartItemsArr;
  if (getSavedCartItems() !== null) {
    cartItemsArr = JSON.parse(getSavedCartItems());
  } else {
    cartItemsArr = [];
  }

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerHTML = innerText;
  return e;
}

const newImage = (thumbnail) => {
  const newThumb = thumbnail.slice(0, 28);
  const newThumbEnd = thumbnail.slice(28, -5);
  const newLettersInicials = 'NQ_NP_';
  const newLettersEnd = 'W.webp';
  const image = `${newThumb}${newLettersInicials}${newThumbEnd}${newLettersEnd}`;
  return image;
};

function createCustomElementImage(element, className, image) {
  const e = document.createElement(element);
  e.className = className;
  e.style.backgroundImage = `url(${image})`;
  return e;
}

function createProductItemElement({ id: sku, title: name, price, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  const image = newImage(thumbnail);
  section.appendChild(createCustomElementImage('section', 'section__image', image));
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('span', 'item__price', `${(price).toLocaleString('pt-BR', 
    { style: 'currency', currency: 'BRL' })}`));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item, className, content) {
  return item.querySelector(className)[content];
}

// Função que cria um objeto e salva no localStorage
const createProductObject = ({ id, title, price, thumbnail }) => {
  const obj = {
    id,
    title,
    price,
    thumbnail,
  };
  cartItemsArr.push(obj);
  // Função que salva o array de objetos no localStorage
  saveCartItems(JSON.stringify(cartItemsArr));
};

// Função que soma os preços dos produtos contidos no carrinho
const sumPrices = () => {
  const total = cartItemsArr.reduce((acc, item) => acc + item.price, 0);
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = total.toLocaleString('pt-BR', 
    { style: 'currency', currency: 'BRL' });
};

// Função que remove o item do carrinho tanto na página como no localStorage
function cartItemClickListener(event) {
  const itemText = event.target.parentElement.childNodes[1].innerText;
  cartItemsArr.forEach(({ title }, index) => {
    if (itemText.includes(title)) cartItemsArr.splice(index, 1);
  });
  // Função que salva o array de objetos no localStorage
  saveCartItems(JSON.stringify(cartItemsArr));
  event.target.parentElement.remove();
  sumPrices();
}

// Função que remove todos os itens do carrinho tanto na página como no localStorage
const btnCleanTheCart = document.querySelector('.empty-cart');
btnCleanTheCart.addEventListener('click', () => {
  cartList.innerHTML = '';
  cartItemsArr = []; 
  saveCartItems(JSON.stringify(cartItemsArr));
  sumPrices();
});

function createCartItemElement({ title: name, price: salePrice, thumbnail }) {
  const image = newImage(thumbnail);
  const contentText = `${name} | ${(salePrice).toLocaleString('pt-BR', 
    { style: 'currency', currency: 'BRL' })}`;
  const li = document.createElement('li');
  li.appendChild(createCustomElementImage('div', 'div-img', image));
  li.appendChild(createCustomElement('div', 'div-content', contentText));
  li.innerHTML += '<ion-icon class="btn-icon" name="close-outline"></ion-icon>';
  li.className = 'cart__item';
  li.addEventListener('click', cartItemClickListener);
  sumPrices();
  return li;
}

// Função que adiciona 'carregando' à página
function addLoading(classe, element) {
  const itemsSection = document.querySelector(classe);
  const loadingElement = document.createElement(element);
  loadingElement.innerHTML = 'carregando...';
  loadingElement.className = 'loading';
  itemsSection.appendChild(loadingElement);
}

// Função que remove 'carregando' da página
function removeLoading() {
  const loadingElement = document.querySelector('.loading');
  loadingElement.remove();
}

// Função que insere os itens ao carrinho quando adicionados ou vindos do localStorage
const addItemToCart = () => {
  // Percorre cada objeto salvo no localStorage e passa como parâmetro
  cartItemsArr.forEach((obj) => cartList.appendChild(createCartItemElement(obj)));
  // Para cada botão cria um evento e armazena as informações do objeto correspondente
  const addButtons = document.querySelectorAll('.item__add');
  addButtons.forEach((element) => element.addEventListener('click', async () => {
    addLoading('.cart__items', 'span');
    const itemId = getSkuFromProductItem(element.parentElement, 'span.item__sku', 'innerText');
    const obj = await fetchItem(itemId);
    removeLoading();
    createProductObject(obj);
    cartList.appendChild(createCartItemElement(obj));
  }));
  sumPrices();
};

// Função que adiciona os produtos na página
const addProductsToPage = async () => {
  const { results } = await fetchProducts('computador');
  removeLoading();
  const itemsSection = document.querySelector('.items');
  results.forEach((obj) => {
    itemsSection.appendChild(createProductItemElement(obj));
  });
  addItemToCart();
};

window.onload = () => {
  addLoading('.items', 'span');
  addProductsToPage();
};
