/* Insansu online shop: product list.
   To change a price, edit `price` (in Kwacha, a number) and `unit` (e.g. 'per head', 'per kg', 'per bunch').
   Leave price as null to show "Price on request". Set `available:false` to hide the Add button. */
window.INSANSU_SHOP = {
  whatsapp: '260760538552',
  pay543Code: '685332',          // Pay na 543 merchant code
  momoNumber: '0760538552',      // MTN MoMo number
  deliveryAreas: ['Kafue', 'Chilanga', 'Lusaka', 'Collect from the farm'],
  products: [
    {id:'cabbage',  name:'Cabbage',  img:'images/crops/cabbage.jpg',  desc:'Fresh from our drip-irrigated fields.', price:null, unit:'', available:true},
    {id:'onion',    name:'Onion',    img:'images/crops/onion.jpg',    desc:'Red onions, harvested to order.',       price:null, unit:'', available:true},
    {id:'tomatoes', name:'Tomatoes', img:'images/crops/tomato.jpg',   desc:'Field-grown and vine-ripened.',         price:null, unit:'', available:true},
    {id:'cucumber', name:'Cucumber', img:'images/crops/cucumber.jpg', desc:'Crisp cucumbers for fresh eating.',     price:null, unit:'', available:true},
    {id:'impwa',    name:'Impwa',    img:'images/crops/impwa.jpg',    desc:'Traditional indigenous vegetable.',     price:null, unit:'', available:true},
    {id:'leafy',    name:'Indigenous leafy vegetables', img:'images/crops/leafy-vegetables.jpg', desc:'Katapa, chibwabwa, kalembula and bondwe. Availability changes with the season.', price:null, unit:'', available:true},
    {id:'pumpkin-leaves', name:'Pumpkin leaves (chibwabwa)', img:'images/crops/pumpkin-leaves.jpg', desc:'Tender, nutritious leaves.', price:null, unit:'', available:true}
  ]
};
