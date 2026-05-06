let filePath = "./database/dataset.v2.js";

async function updateSkills() {
    const mySkills = ["Styrka", "Kondition", "Teknik", "Logik", "Smidighet"];
    
    try {
        const data = await Deno.readTextFile(filePath);
        const skills = eval(data.match(/const skills = (.+);/s)[1]);
        for (let i = 0; i < skills.length; i++) {
            if (i < mySkills.length) {
                skills[i].name = mySkills[i]; 
            }
        }
        const updatedData = `const skills = ${JSON.stringify(skills, null, 2)};\n`;
        await Deno.writeTextFile(filePath, updatedData);
        console.log("Alla relevanta poster har uppdaterats!");


    } catch(error) {
        console.log(error)
    }
}
updateSkills();
