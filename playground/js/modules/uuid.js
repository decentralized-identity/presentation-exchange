
var UUID = {
  randomBytes(length = 16, format) {
    let bytes = crypto.getRandomValues(new Uint8Array(length));
    switch (format) {
      case 'raw': return bytes;
      case 'base64Url': return;
      default: return bytes.join('');
    }
  },
  v4() {
    function getRandomSymbol (symbol) {
        var array;
        if (symbol === 'y') {
            array = ['8', '9', 'a', 'b'];
            return array[Math.floor(Math.random() * array.length)];
        }
        array = new Uint8Array(1);
        window.crypto.getRandomValues(array);
        return (array[0] % 16).toString(16);
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, getRandomSymbol);
  } 
};

export {UUID}