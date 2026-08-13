class CVoxelParser {
    constructor() {
        this.variables = new Map();
        this.gstats = new Map();
        this.blocks = new Map();
        
        // Configuração do Mundo 2D
        this.width = 10;
        this.height = 10;
        this.player = {
            x: 0,
            y: 0,
            health: 100
        };
    }

    // Desenha o mapa 2D no terminal em formato de grade ASCII
    renderMap() {
        console.clear(); // Limpa a tela para dar efeito de jogo rodando
        console.log(`=== C-VOXEL 2D ENGINE ===`);
        console.log(`Vida: ${this.player.health} | Posição: X=${this.player.x}, Y=${this.player.y}\n`);

        for (let y = 0; y < this.height; y++) {
            let row = "";
            for (let x = 0; x < this.width; x++) {
                if (x === this.player.x && y === this.player.y) {
                    row += "[P] "; // Posição do Jogador
                } else {
                    row += ".   "; // Espaço vazio
                }
            }
            console.log(row);
        }
        console.log("\n-------------------------");
    }

    parse(code) {
        const lines = code.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();

            // Print simples
            const printMatch = line.match(/^print\("(.*)"\)$/);
            if (printMatch) {
                console.log(printMatch[1]);
            }

            // Movimento do Jogador
            const playerMoveMatch = line.match(/^player\.Move\(([a-zA-Z]+)\)$/);
            if (playerMoveMatch) {
                const [, direction] = playerMoveMatch;
                const dir = direction.toLowerCase();

                if (dir === 'right' && this.player.x < this.width - 1) this.player.x += 1;
                if (dir === 'left' && this.player.x > 0) this.player.x -= 1;
                if (dir === 'up' && this.player.y > 0) this.player.y -= 1;
                if (dir === 'down' && this.player.y < this.height - 1) this.player.y += 1;

                // Renderiza o mapa após cada movimento
                this.renderMap();
            }
        }
    }
}

module.exports = CVoxelParser;
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
