const CVoxelParser = require('./parser.js');

// Código de teste da nossa linguagem C-Voxel
const codigoTeste = `
< Criando o nosso primeiro bloco de lava letal >
block.Create:(Square, Lava)
block.Color:(Lava) = #FF0000

event.Start:(PlayerTouched:(Lava))
if event.Activated then
player.Get:(Health) -= 10
event.End(close)
`;

console.log("--- INICIANDO COMPILAÇÃO C-VOXEL ---");
const parser = new CVoxelParser();
parser.parse(codigoTeste);
console.log("--- FIM DA EXECUÇÃO ---");
