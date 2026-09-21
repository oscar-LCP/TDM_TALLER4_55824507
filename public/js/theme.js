const themeToggle=document.getElementById("toggleThemeBtn");
const themeIcon=document.getElementById("themeIcon");
const themeLabel=document.getElementById("themeLabel");

function updateThemeButton(theme){
    const isDark = theme === "dark";

    if(themeIcon){
        themeIcon.textContent=isDark?"☀️":"🌙";
    }

    if(themeLabel){
        themeLabel.textContent=isDark?"Modo claro":"Modo oscuro";
    }

    if(themeToggle){
        themeToggle.setAttribute(
            "aria-label",
            isDark?"Activar modo claro":"Activar modo oscuro"
        );
    }
}

function applyTheme(theme){
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("tema", theme); 
    updateThemeButton(theme);
}

const guardado=localStorage.getItem("tema");
const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
const tema = guardado??(prefiereOscuro?"dark":"light");

applyTheme(tema);

themeToggle?.addEventListener("click", ()=>{
    const actual = document.documentElement.dataset.theme||"light";
    const nuevoTema=actual==="dark"?"light":"dark";

    applyTheme(nuevoTema);
});