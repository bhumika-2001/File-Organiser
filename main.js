(function(){
    let btn = document.querySelector("#b1"); //#-> for selectiong id and . for selecting class
    let h1 = document.querySelector("h1"); //simple tag access

    btn.addEventListener("click",function(){
        h1.style.color = "pink";
    });
    btn.addEventListener("mouseover",function(){
        h1.style.color = "blue";
    });
    btn.addEventListener("mouseout",function(){
        h1.style.color = "red";
    });

})();