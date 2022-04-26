const container = document.querySelector(".container");
        const search = container.querySelector(".search input");
        const voice = container.querySelector(".word i");
        const meaning = container.querySelector(".content .meaning .details span");
        const word = container.querySelector(".word .details p");
        const partsOfSpeech = container.querySelector(".word .details span");
        const example = container.querySelector(".content .example .details span");
        const exampleNot  = container.querySelector(".content .example ");
        const clear  = container.querySelector(".search span");
        const synonyms  = container.querySelector(".synonyms span");
        const demoHeading  = container.querySelector(".demoHeading");
        
        const demoHeadingData = demoHeading.innerHTML;
        let audio = "";

        const loading = ()=>{        
            demoHeading.style = "color: rgb(0, 38, 255);"    
            demoHeading.innerHTML = `Searching meaning of <strong>${search.value}</strong>...`;           
        }

        const clearUL = ()=>{
            document.getElementById('ul').classList.remove('active');
            demoHeading.style = "color: #414040;";
            demoHeading.innerHTML = `<p>Welcome to <strong>Saurav Raj's</strong> Dictionary</p>`;
        }
        
        search.addEventListener("keyup", async key=>{
            clearUL();
            let answer = "";
            if(key.key == "Enter"){
                loading();
                
                let api = `https://api.dictionaryapi.dev/api/v2/entries/en/${search.value}`;
                
                
                try {
                    const data = await fetch(api);
                    answer = await data.json();
                    
                    // If data not fetch 
                    if(answer.title) {
                        
                        alert(`Meaning of '${search.value}' not found please enter another word.`)
                        search.value = "";
                        demoHeading.style = "color: #414040;";
                        demoHeading.innerHTML = `<p>Welcome to <strong>Saurav Raj's</strong> Dictionary</p>`;
                        return;
                    }

                    demoHeading.innerText= "";
                    demoHeading.style = "color: #414040;"
                } catch (error) {
                    console.log(error);
                }
                
                
                // Setting Audio URL 
                let audioURL= "";
                if(answer[0].phonetics.length > 0){
                    audioURL = answer[0].phonetics[0].audio;
                    if(audioURL== "" && answer[0].phonetics.length > 1) audioURL = answer[0].phonetics[1].audio;
                    if(audioURL== "" && answer[0].phonetics.length > 2) audioURL = answer[0].phonetics[2].audio;
                    
                }
                audio = new Audio(audioURL);


                if(answer[0].meanings[0].definitions[0].example === undefined){
                    example.innerText = "Example not available 😥";
                }
                else{
                    exampleNot.style = "display:block";
                    example.innerText = answer[0].meanings[0].definitions[0].example;
                }
                let idx = 1;
                if(answer[0].phonetics.length == 1) idx = 0;
                let posp = "";
                if(answer[0].phonetics.length > 0) posp = answer[0].phonetics[idx].text;

                partsOfSpeech.innerText = `${answer[0].meanings[0].partOfSpeech} ${posp}`;
                word.innerText = answer[0].word;
                meaning.innerText = answer[0].meanings[0].definitions[0].definition;

                idx = answer[0].meanings[0].synonyms.length;
                
                let txt = "";
                for(let i=0; i<idx; i++){
                    txt+=answer[0].meanings[0].synonyms[i] + ", "
                }
                txt = txt.slice(0, -1)
                txt = txt.slice(0, -1)
                if(txt==""){
                    synonyms.innerText = answer[0].word;
                }
                else{
                    synonyms.innerText = txt;
                }
                
                document.getElementById('ul').classList.add("active");
            }
        })

        voice.addEventListener("click",()=>{
            voice.classList.remove('fa-volume-down');
            voice.classList.add('fa-volume-up');
            voice.style = "color:rgb(0, 157, 255)";
            
            audio.play();
            setTimeout(function(){
                voice.style = "color:black";
                voice.classList.remove('fa-volume-up');
                voice.classList.add('fa-volume-down');
            }, 1200);
            
        })

        clear.addEventListener('click',()=>{
            search.value = "";
            document.getElementById('ul').classList.remove('active');
            demoHeading.innerHTML = `<p>Welcome to <strong>Saurav Raj's</strong> Dictionary</p>`;
        })