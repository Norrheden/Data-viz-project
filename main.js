const characters = [
  { name: "Bigfoot", category: "Monster" },
  { name: "Alien", category: "Monster" },
  { name: "Tor", category: "Gud" },
  { name: "Jultomten", category: "Övrig" },
  { name: "Krampus", category: "Monster" },
  { name: "Slender Man", category: "Sagoväsen" },
  { name: "Borat", category: "Övrig" },
  { name: "Yeti", category: "Monster" },
  { name: "Troll", category: "Sagoväsen" },
  { name: "Ompa Lompa", category: "Sagoväsen" },
  { name: "Zeus", category: "Gud" },
  { name: "Hades", category: "Gud" },
  { name: "Anubis", category: "Gud" },
  { name: "Gandalf", category: "Sagoväsen" },
  { name: "Godzilla", category: "Monster" },
  { name: "Oni", category: "Monster" },
  { name: "Shiva", category: "Gud" },
  { name: "Tintin", category: "Sagoväsen" },
  { name: "Grip", category: "Monster" },
  { name: "Siren Head", category: "Övrig" },
  { name: "Medusa", category: "Gud" },
  { name: "Minion", category: "Övrig" },
  { name: "Shrek", category: "Sagoväsen" },
  { name: "Påskharen", category: "Övrig" },
  { name: "Tandfen", category: "Övrig" },
  { name: "Dracula", category: "Monster" },
  { name: "Garuda", category: "Monster" },
  { name: "King Kong", category: "Monster" },
  { name: "Frankenstein", category: "Monster" },
  { name: "Gammelsmurfen", category: "Sagoväsen" },
  { name: "Sjöjungfru", category: "Övrig" },
  { name: "Rödluvan", category: "Sagoväsen" },
  { name: "Poseidon", category: "Gud" },
  { name: "Horus", category: "Gud" },
  { name: "Goblin", category: "Sagoväsen" },
  { name: "Loch ness (Nessie)", category: "Monster" },
  { name: "Biggie Cheese", category: "Sagoväsen" },
  { name: "Spagettimonstret", category: "Monster" },
  { name: "Stora Morran", category: "Monster" },
  { name: "Varulv", category: "Monster" },
  { name: "Hydra", category: "Monster" },
  { name: "Rattata", category: "Sagoväsen" },
  { name: "Jack the Ripper", category: "Övrig" },
  { name: "Björne", category: "Sagoväsen" },
  { name: "Megalodon", category: "Monster" }
];

const driver = () => {
    //Byter deltagarnas namn och sätter type

    for (i=0; i<participants.length; i++) {
        participants[i].name = characters[i].name;
        participants[i].type = characters[i].category;
    }
}

driver();
