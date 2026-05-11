const driver = () => {
    //Byter deltagarnas namn och sätter type

    for (i=0; i<participants.length; i++) {
        participants[i].name = characters[i].name;
        participants[i].type = characters[i].category;
    }
}

driver();
