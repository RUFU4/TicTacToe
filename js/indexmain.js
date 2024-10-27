const WIN_POSITIONS = [0b111000000,
    0b000111000,
    0b000000111,
    0b100100100,
    0b010010010,
    0b001001001,
    0b100010001,
    0b001010100
];
const PLAYERSPNG = `'url("../img/circle.png")','url("../img/cross.png")'`;

try{
    localStorage.setItem('winpos', WIN_POSITIONS);
    localStorage.setItem('playerObj', PLAYERSPNG)
} catch (err){
    console.log(`Имеется ошибка в работе с localStorage: ${err}`)
}