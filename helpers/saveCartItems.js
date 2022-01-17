const saveCartItems = (array) => {
  localStorage.setItem('cartItems', array);
};

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
