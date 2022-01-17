require('../mocks/fetchSimulator');
const { fetchItem } = require('../helpers/fetchItem');
const item = require('../mocks/item');

describe('2 - Teste a função fecthItem', () => {
  // implemente seus testes aqui
  //fail('Teste vazio');
  it('Testa se fetchItem é uma função', () => {
    expect(typeof fetchItem).toBe('function');
  })

  it('Testa se a função fetch é chamada ao executar a função fetchItem com o argumento "MLB1615760527" ', async () => {
    await fetchItem('MLB1615760527');
    expect(fetch).toHaveBeenCalled();
  })

  it('Testa se a função fetch utiliza o endpoint ao executar a função fetchItem com o argumento "MLB1615760527" ', async () => {
    const endpoint = 'https://api.mercadolibre.com/items/MLB1615760527';
    await fetchItem('MLB1615760527');
    expect(fetch).toHaveBeenCalledWith(endpoint);
  })

  it('Testa se o retorno da função fetchItem com o argumento "MLB1615760527" é um objeto igual a item', async () => {
    const result = await fetchItem('MLB1615760527');
    expect(result).toEqual(item);
  })

  it('Testa se ao chamar a função fetchItem sem argumento, retorna um erro com a mensagem: You must provide an url.', async () => {
    const result = await fetchItem();
    expect(result).toEqual(new Error('You must provide an url'));
  })
});
