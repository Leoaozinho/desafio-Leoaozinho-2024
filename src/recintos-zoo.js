const recintos = [
  {
    numero: 1,
    bioma: "savana",
    tamanhoTotal: 10,
    animaisPresentes: [{ nome: "MACACO", quantidade: 3, dieta: "Herbívoro", tamanho: 1 }]
  },
  {
    numero: 2,
    bioma: "floresta",
    tamanhoTotal: 5,
    animaisPresentes: []
  },
  {
    numero: 3,
    bioma: "savana e rio",
    tamanhoTotal: 7,
    animaisPresentes: [{ nome: "GAZELA", quantidade: 1, dieta: "Herbívoro", tamanho: 2 }]
  },
  {
    numero: 4,
    bioma: "rio",
    tamanhoTotal: 8,
    animaisPresentes: []
  },
  {
    numero: 5,
    bioma: "savana",
    tamanhoTotal: 9,
    animaisPresentes: [{ nome: "LEÃO", quantidade: 1, dieta: "Carnívoro", tamanho: 3 }]
  }
];

// Constantes atualizadas dos novos animais (especificações)
const novosAnimais = {
  LEAO: { nome: "LEÃO", dieta: "Carnívoro", tamanho: 3, bioma: ["savana"] },
  LEOPARDO: { nome: "LEOPARDO", dieta: "Carnívoro", tamanho: 2, bioma: ["savana"] },
  CROCODILO: { nome: "CROCODILO", dieta: "Carnívoro", tamanho: 3, bioma: ["rio"] },
  MACACO: { nome: "MACACO", dieta: "Herbívoro", tamanho: 1, bioma: ["savana", "floresta"] },
  GAZELA: { nome: "GAZELA", dieta: "Herbívoro", tamanho: 2, bioma: ["savana"] },
  HIPOPOTAMO: { nome: "HIPOPOTAMO", dieta: "Herbívoro", tamanho: 4, bioma: ["savana", "rio"] }
};
function encontrarRecintoIdeal(tipoAnimal, quantidadeAnimais, recintos) {
  const tipoAnimalUpperCase = tipoAnimal.toUpperCase();
  const animal = novosAnimais[tipoAnimalUpperCase]; // Acessando diretamente o objeto

  if (!animal) {
      return { erro: "Animal inválido" };
  }

  if (!Number.isInteger(quantidadeAnimais) || quantidadeAnimais <= 0) {
      return { erro: "Quantidade inválida" };
  }

  const recintosViaveis = recintos
      .filter((recinto) => {
          // Verifica se o bioma do recinto é adequado para o animal
          const biomaAdequado = animal.bioma.some(bioma => recinto.bioma.includes(bioma));
          if (!biomaAdequado) return false;

          // Verificação de convivência correta para carnívoros
          const isCarnivoro = animal.dieta === "Carnívoro";
          
          // Carnívoros só podem conviver com a própria espécie
          if (isCarnivoro) {
              const onlySameSpecies = recinto.animaisPresentes.every(a => a.nome === animal.nome);
              if (!onlySameSpecies) return false;
          }

          // Garante que os herbívoros e outros animais fiquem confortáveis
          const confortoContinuo = [...recinto.animaisPresentes, ...Array(quantidadeAnimais).fill(animal)]
              .every(a => novosAnimais[a.nome]?.bioma.some(bioma => recinto.bioma.includes(bioma)));
          if (!confortoContinuo) return false;

          // Hipopótamos precisam de Savana e Rio para coexistir com outras espécies
          if (animal.nome === "HIPOPOTAMO" && recinto.animaisPresentes.length > 0) {
              const temSavanaERio = recinto.bioma.includes("savana") && recinto.bioma.includes("rio");
              if (!temSavanaERio) return false;
          }

          // Macacos precisam de companhia no recinto
          if (animal.nome === "MACACO" && recinto.animaisPresentes.length === 0 && quantidadeAnimais === 0) {
              return false;
          }

          // Verifica o espaço necessário, com 1 espaço extra caso tenha mais de uma espécie
          const numEspecies = new Set([...recinto.animaisPresentes.map(a => a.nome), animal.nome]).size;
          const espacoExtra = numEspecies > 1 ? 1 : 0;
          const espacoNecessario = (animal.tamanho * quantidadeAnimais) + espacoExtra;

          const espacoOcupadoAtual = recinto.animaisPresentes.reduce((total, a) => total + (a.tamanho * a.quantidade), 0);
          const espacoDisponivel = recinto.tamanhoTotal - espacoOcupadoAtual;

          if (espacoDisponivel < espacoNecessario) return false;

          recinto.espacoLivre = espacoDisponivel - espacoNecessario;
          return true;
      })
      .sort((a, b) => a.numero - b.numero);

  if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável" };
  }

  const recintosFormatados = recintosViaveis.map((recinto) => {
      return `Recinto ${recinto.numero} (espaço livre: ${recinto.espacoLivre} total: ${recinto.tamanhoTotal})`;
  });

  return { recintosViaveis: recintosFormatados };
}

export { RecintosZoo as RecintosZoo };
