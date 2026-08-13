/**
 * C-Voxel Engine - parser.js
 * Interpretador oficial da linguagem C-Voxel baseado na nossa documentação e sintaxe.
 */

class CVoxelParser {
    constructor() {
        this.variables = new Map();
        this.gstats = new Map();
        this.blocks = new Map();
    }

    parse(sourceCode) {
        const lines = sourceCode.split('\n');
        let i = 0;

        while (i < lines.length) {
            let line = lines[i].trim();

            if (!line) {
                i++;
                continue;
            }

            // 1. Comentários: < comentário >
            if (line.startsWith('<') && line.endsWith('>')) {
                i++;
                continue;
            }

            // 2. Comando Print: print("Mensagem")
            const printMatch = line.match(/^print\s*\(\s*(['"])(.*?)\1\s*\)$/);
            if (printMatch) {
                console.log(printMatch[2]);
                i++;
                continue;
            }

            // 3. Criação de Blocos: block.Create:(Formato, Nome)
            const blockCreateMatch = line.match(/^block\.Create:\(([a-zA-Z]+),\s*([a-zA-Z0-9_]+)\)$/);
            if (blockCreateMatch) {
                const [, format, name] = blockCreateMatch;
                this.blocks.set(name, { format, color: '#FFFFFF' });
                i++;
                continue;
            }

            // 4. Cor do Bloco: block.Color:(Nome) = #HEX
            const blockColorMatch = line.match(/^block\.Color:\(([a-zA-Z0-9_]+)\)\s*=\s*(#[0-9a-fA-F]{6})$/);
            if (blockColorMatch) {
                const [, name, hex] = blockColorMatch;
                if (this.blocks.has(name)) {
                    this.blocks.get(name).color = hex;
                }
                i++;
                continue;
            }

            // 5. Variáveis: var.Add:(Nome) = Valor
            const varAddMatch = line.match(/^var\.Add:\(([a-zA-Z0-9_]+)\)\s*=\s*(.+)$/);
            if (varAddMatch) {
                const [, name, value] = varAddMatch;
                this.variables.set(name, eval(value));
                i++;
                continue;
            }

            // 6. GStats Globais: gstats.Add:(Nome, Valor)
            const gstatsAddMatch = line.match(/^gstats\.Add:\(([a-zA-Z0-9_]+),\s*(.+)\)$/);
            if (gstatsAddMatch) {
                const [, name, value] = gstatsAddMatch;
                this.gstats.set(name, Number(value));
                i++;
                continue;
            }

            // 7. Eventos: event.Start:(...)
            if (line.startsWith('event.Start:')) {
                i = this.parseEvent(lines, i);
                continue;
            }

            i++;
        }
    }

    parseEvent(lines, startIndex) {
        let i = startIndex;
        const eventLine = lines[i].trim();
        console.log(`[EVENTO ATIVADO]: ${eventLine}`);
        i++;

        let activated = true; 

        while (i < lines.length) {
            let line = lines[i].trim();

            // Fechamento do evento: event.End(close)
            if (line.startsWith('event.End(close)')) {
                console.log(`[EVENTO FINALIZADO]`);
                i++;
                break;
            }

            // Condicional: if event.Activated then
            if (line.startsWith('if event.Activated then')) {
                i++;
                continue;
            }

            // Decrementos/Modificadores de Jogador: player.Get:(Health) -= 10
            const statModMatch = line.match(/^player\.Get:\(([a-zA-Z0-9_.]+)\)\s*(-=|\+=|=)\s*(.+)$/);
            if (statModMatch && activated) {
                const [, target, op, val] = statModMatch;
                console.log(`[MODIFICAÇÃO DE STAT]: ${target} ${op} ${val}`);
            }

            // Adição de gstats pelo player
            const playerGetGstatsMatch = line.match(/^player\.Get:\((?:gstats|GameStats)\.Add:\(([a-zA-Z0-9_]+),\s*(.+)\)\)$/);
            if (playerGetGstatsMatch && activated) {
                const [, statName, val] = playerGetGstatsMatch;
                this.gstats.set(statName, Number(val));
                console.log(`[LEADERSTATS]: ${statName} inicializado com ${val}`);
            }

            i++;
        }

        return i;
    }
}

module.exports = CVoxelParser;
