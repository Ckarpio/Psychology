const nameEmo = "Гнев"
const descriEmo = "Гнев — это энергия. Он показывает, что твои границы были нарушены. Важно не подавлять его, а научиться выражать конструктивно" 
let intensityEmo = 6
let powerEmo = 'false' 

const parsedIntensity = String(intensityEmo)
const parsedPower = Boolean(powerEmo)

console.log(`nameEmo: ${nameEmo}\ndescriEmo: ${descriEmo}\nintensityEmo: ${intensityEmo}\npowerEmo: ${powerEmo}\n`)
console.log(`nameEmo type: ${typeof nameEmo}\ndescriEmo type: ${typeof descriEmo}\nintensityEmo type: ${typeof intensityEmo}\npowerEmo type: ${typeof powerEmo}\n`)
console.log(`parsed intensityEmo value: ${parsedIntensity}\nparsed powerEmo value: ${parsedPower}\n`)
console.log(`parsed intensityEmo value type: ${typeof parsedIntensity}\nparsed powerEmoValue type: ${ typeof parsedPower}\n`)
