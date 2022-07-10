(function(){
    let btnAddFolder = document.querySelector("#addFolder");
    let btnAddFile = document.querySelector("#addFile");
    let breadCrumb = document.querySelector("#breadCrumb");
    let aRootPath = breadCrumb.querySelector("a[purpose='path']");
    let templates = document.querySelector("#templates");
    let divApp = document.querySelector("#app");
    let divAppTitleBar = document.querySelector("#app-title-bar");
    let divAppTitle = document.querySelector("#app-title");
    let divAppMenuBar = document.querySelector("#app-menu-bar");
    let divAppBody = document.querySelector("#app-body");
    let appClose = document.querySelector("#app-close");
    let container = document.querySelector("#container");
    let resources = [];
    let cfid = -1;
    let rid = 0;
    btnAddFolder.addEventListener("click", addFolder);
    btnAddFile.addEventListener("click",addFile);
    aRootPath.addEventListener("click",viewFolderFromPath);
    appClose.addEventListener("click",closeApp);
    function closeApp()
    {
        divAppTitle.innerHTML = "title";
        divAppTitle.setAttribute("rid","");
        divAppMenuBar.innerHTML="";
        divAppBody.innerHTML ="";
    }
    function addFolder()
    {
        let rname = prompt("Enter folder name");
        if(rname == null) return;
        if(rname != null) rname = rname.trim();
        if(!!rname){
             
            
            let exists = resources.some(f => f.rname == rname && f.pid == cfid);
            if(exists == false)
            {
                let pid = cfid;
                rid++;
                addFolderToHTML(rname,rid,pid);
                resources.push({
                    rid: rid,
                    rname : rname,
                    rtype : "folder",
                    pid : cfid

                });
                saveToStorage();     
            }
            else
            {
                alert(rname +" is already used. try new one");
            }
            
        }
        else
        {
            alert("Empty name not allowed");
            return;
        }
        
    }
    function addFile()
    {
        let rname = prompt("Enter text file's name");
        if(rname == null) return;
        if(rname != null) rname = rname.trim();
        if(!!rname){
             
            let exists = resources.some(f => f.rname == rname && f.pid == cfid);
            if(exists == false)
            {
                let pid = cfid;
                rid++;
                addFileToHTML(rname,rid,pid);
                resources.push({
                    rid: rid,
                    rname : rname,
                    rtype : "text-file",
                    pid : cfid,
                    isBold :false,
                    isItalic : false,
                    isUnderline : false,
                    bgColor : "#000000",
                    textColor : "#FFFFFF",
                    fontFamily: "serif",
                    fontSize: 12,
                    content: "I am a new File."
                });
                saveToStorage();     
            }
            else
            {
                alert(rname +" is already used. try new one");
            }
            
        }
        else
        {
            alert("Empty name not allowed");
            return;
        }
        
    }
    function addFolderToHTML(rname,rid,pid)
    {
        let divInsideTemplates = templates.content.querySelector(".folder");
        let divCopy = document.importNode(divInsideTemplates,true);
        let divName = divCopy.querySelector("[purpose=name");
        let spanEdit = divCopy.querySelector("[action=edit");
        let spanDelete = divCopy.querySelector("[action=delete");
        let spanView = divCopy.querySelector("[action=view");
        spanEdit.addEventListener("click",editFolder);
        spanDelete.addEventListener("click",deleteFolder);
        spanView.addEventListener("click",viewFolder);
        divName.innerHTML = rname;
        divCopy.setAttribute("rid",rid);
        divCopy.setAttribute("pid",pid);


        container.appendChild(divCopy);
    }
    function addFileToHTML(rname,rid,pid)
    {
        let divInsideTemplates = templates.content.querySelector(".text-file");
        let divCopy = document.importNode(divInsideTemplates,true);
        let divName = divCopy.querySelector("[purpose=name");
        let spanEdit = divCopy.querySelector("[action=edit");
        let spanDelete = divCopy.querySelector("[action=delete");
        let spanView = divCopy.querySelector("[action=view");
        spanEdit.addEventListener("click",editFile);
        spanDelete.addEventListener("click",deleteFile);
        spanView.addEventListener("click",viewFile);
        divName.innerHTML = rname;
        divCopy.setAttribute("rid",rid);
        divCopy.setAttribute("pid",pid);


        container.appendChild(divCopy);
    }
    function deleteFolder(){
        let divCopy = this.parentNode;
        let divName = divCopy.querySelector("[purpose='name']");
        let fidTBD = parseInt(divCopy.getAttribute("rid"));
        let fname = divName.innerHTML;

        let sure = confirm("do u want to delete "+fname+" ?");
        if(!sure) return;
        container.removeChild(divCopy);
        deleteHelper(fidTBD);
        saveToStorage();
    }
    function deleteHelper(fidTBD)
    {
        let children = resources.filter(r => r.pid == fidTBD);
        for(let i=0;i<children.length;i++)
        {
            deleteHelper(children[i].rid);
        }
        let ridx = resources.findIndex(r => r.rid == fidTBD);
        resources.splice(ridx,1);
    }
    function deleteFile(){
        let divCopy = this.parentNode;
        let divName = divCopy.querySelector("[purpose='name']");
        let fidTBD = parseInt(divCopy.getAttribute("rid"));
        let fname = divName.innerHTML;

        let sure = confirm("do u want to delete "+fname+" ?");
        if(!sure) return;
        container.removeChild(divCopy);
        let ridx = resources.findIndex(r => r.rid == fidTBD);
        resources.splice(ridx,1);
        saveToStorage();
    }
    function editFolder(){
        let nrname = prompt("enter name");
        if(nrname == null) return;
        if(!nrname)
        {
            alert("empty name not allowed");
            return;
        }
        if(nrname != null)
        {
             nrname = nrname.trim();
        }
        let divCopy = this.parentNode;
        let divName = divCopy.querySelector("[purpose=name]");
        let oname = divName.innerHTML;
        let ridTbe = parseInt(divCopy.getAttribute("rid"));
        if(nrname == oname)
        {
            alert("enter a new name");
            return;
        }

        let exists = resources.some(r => r.rname == nrname && r.pid == cfid);
        if(exists == true)
        {
            alert(nrname+" already exists");
            return;
        }
        divName.innerHTML = nrname; //html
        let resource = resources.find(r => r.rid == ridTbe);
        resource.rname = nrname //ram
        saveToStorage(); //storage.

    }
    function editFile(){
        let nrname = prompt("enter file name");
        if(nrname == null) return;
        if(!nrname)
        {
            alert("empty name not allowed");
            return;
        }
        if(nrname != null)
        {
             nrname = nrname.trim();
        }
        let divCopy = this.parentNode;
        let divName = divCopy.querySelector("[purpose=name]");
        let oname = divName.innerHTML;
        let ridTbe = parseInt(divCopy.getAttribute("rid"));
        if(nrname == oname)
        {
            alert("enter a new name");
            return;
        }

        let exists = resources.some(r => r.rname == nrname && r.pid == cfid);
        if(exists == true)
        {
            alert(nrname+" already exists");
            return;
        }
        divName.innerHTML = nrname; //html
        let resource = resources.find(r => r.rid == ridTbe);
        resource.rname = nrname //ram
        saveToStorage(); //storage.
    }
    function viewFolder(){
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose = 'name']");
        let fname = divName.innerHTML;
        let fid = parseInt(divFolder.getAttribute("rid"));

        let aPathTemplate = templates.content.querySelector("a[purpose='path']");
        let aPath = document.importNode(aPathTemplate,true);
        aPath.innerHTML= fname;
        aPath.setAttribute("rid",fid);
        aPath.addEventListener("click",viewFolderFromPath);
        breadCrumb.appendChild(aPath);
        cfid = fid;
        container.innerHTML = "";
        for(let i=0;i<resources.length;i++)
        {
            if(resources[i].pid ==cfid)
            {
                if(resources[i].rtype == "folder")
                {
                    addFolderToHTML(resources[i].rname,resources[i].rid,resources[i].pid);

                }
                else if(resources[i].rtype == "text-file")
                {
                    addFileToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
                }
            }
        }
        
    }
    function viewFolderFromPath()
    {
        let fid = parseInt(this.getAttribute("rid"));

        while(this.nextSibling)
        {
            this.parentNode.removeChild(this.nextSibling);
        }
        cfid = fid;
        container.innerHTML="";
        for(let i=0;i<resources.length;i++)
        {
            if(resources[i].pid ==cfid)
            {
                if(resources[i].rtype == "folder")
                {
                    addFolderToHTML(resources[i].rname,resources[i].rid,resources[i].pid);

                }
                else if(resources[i].rtype == "text-file")
                {
                    addFileToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
                }
            }
        }

    }
    function viewFile(){
        let divTextFile = this.parentNode;
        let divName = divTextFile.querySelector("[purpose=name]");
        let fname = divName.innerHTML;
        let fid = parseInt(divTextFile.getAttribute("rid"));
        let divNotepadMenuTemplate = templates.content.querySelector("[purpose=notepad-menu]");
        let divNotepadMenu = document.importNode(divNotepadMenuTemplate,true); 
        let divNotepadBodyTemplate = templates.content.querySelector("[purpose=notepad-body]");
        let divNotepadBody = document.importNode(divNotepadBodyTemplate,true); 
        divAppMenuBar.innerHTML = "";
        divAppMenuBar.appendChild(divNotepadMenu);
        divAppBody.innerHTML = "";
        divAppBody.appendChild(divNotepadBody);
        divAppTitle.innerHTML = fname;
        divAppTitle.setAttribute("rid",fid);
        let spanSave = divAppMenuBar.querySelector("[action=save]");
        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
        let spanDownload = divAppMenuBar.querySelector("[action=download]");
        let inputUpload= divAppMenuBar.querySelector("input[action=upload]");
        let spanUpload = divAppMenuBar.querySelector("span[action=upload]");
        let textArea = divAppBody.querySelector("textArea");


        spanSave.addEventListener("click",saveNotepad);
        spanBold.addEventListener("click",makeNotepadBold);
        spanItalic.addEventListener("click",makeNotepadItalic);
        spanUnderline.addEventListener("click",makeNotepadUnderline);
        inputBGColor.addEventListener("change",changeNotepadBGColor);
        inputTextColor.addEventListener("change",changeNotepadTextColor);
        selectFontFamily.addEventListener("change",changeNotepadFontFamily);
        selectFontSize.addEventListener("change",changeNotepadFonySize);
        selectFontSize.addEventListener("change",changeNotepadFonySize);
        spanDownload.addEventListener("click",downloadNotepad);
        inputUpload.addEventListener("change",uploadNotepad);
        spanUpload.addEventListener("click",function(){
            inputUpload.click();
        });
    
        let resource = resources.find(r => r.rid == fid);
        spanBold.setAttribute("pressed",!resource.isBold);
        spanItalic.setAttribute("pressed",!resource.isItalic);
        spanUnderline.setAttribute("pressed",!resource.isUnderline);
        inputBGColor.value = resource.bgColor;
        inputTextColor.value = resource.textColor;
        selectFontFamily.value = resource.fontFamily;
        selectFontSize.value = resource.fontSize;
        textArea.value = resource.content;

        spanBold.dispatchEvent(new Event("click"));
        spanItalic.dispatchEvent(new Event("click"));
        spanUnderline.dispatchEvent(new Event("click"));
        inputBGColor.dispatchEvent(new Event("change"));
        inputTextColor.dispatchEvent(new Event("change"));
        selectFontFamily.dispatchEvent(new Event("change"));
        selectFontSize.dispatchEvent(new Event("change"));


    }
    function downloadNotepad()
    {
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.rid == fid);
        let divNotepadMenu = this.parentNode;
        let strForDownload = JSON.stringify(resource);
        let encodedData = encodeURIComponent(strForDownload);

        let aDownload = divNotepadMenu.querySelector("a[purpose=download]");
        aDownload.setAttribute("href","data:text/json; charset=utf-8, "+encodedData);
        aDownload.setAttribute("download",resource.rname+".json");
        aDownload.click();

    }
    function uploadNotepad()
    {
        let file = window.event.target.files[0];
        let reader = new FileReader();
        reader.addEventListener("load",function(){
            let data = window.event.target.result;
            let resource =JSON.parse(data);

            let spanBold = divAppMenuBar.querySelector("[action=bold]");
            let spanItalic = divAppMenuBar.querySelector("[action=italic]");
            let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
            let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
            let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
            let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
            let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
            
            let textArea = divAppBody.querySelector("textArea");

            spanBold.addEventListener("click",makeNotepadBold);
            spanItalic.addEventListener("click",makeNotepadItalic);
            spanUnderline.addEventListener("click",makeNotepadUnderline);
            inputBGColor.addEventListener("change",changeNotepadBGColor);
            inputTextColor.addEventListener("change",changeNotepadTextColor);
            selectFontFamily.addEventListener("change",changeNotepadFontFamily);
            selectFontSize.addEventListener("change",changeNotepadFonySize);
            selectFontSize.addEventListener("change",changeNotepadFonySize);
            
            spanBold.setAttribute("pressed",!resource.isBold);
            spanItalic.setAttribute("pressed",!resource.isItalic);
            spanUnderline.setAttribute("pressed",!resource.isUnderline);
            inputBGColor.value = resource.bgColor;
            inputTextColor.value = resource.textColor;
            selectFontFamily.value = resource.fontFamily;
            selectFontSize.value = resource.fontSize;
            textArea.value = resource.content;

            spanBold.dispatchEvent(new Event("click"));
            spanItalic.dispatchEvent(new Event("click"));
            spanUnderline.dispatchEvent(new Event("click"));
            inputBGColor.dispatchEvent(new Event("change"));
            inputTextColor.dispatchEvent(new Event("change"));
            selectFontFamily.dispatchEvent(new Event("change"));
            selectFontSize.dispatchEvent(new Event("change"));

        })
        reader.readAsText(file);
    }
    function saveNotepad(){
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.rid == fid);        
        
        let spanSave = divAppMenuBar.querySelector("[action=save]");
        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
        let textArea = divAppBody.querySelector("textArea");

        resource.isBold = spanBold.getAttribute("pressed") == "true";
        resource.isItalic = spanItalic.getAttribute("pressed") == "true";
        resource.isUnderline = spanUnderline.getAttribute("pressed") == "true";
        resource.bgColor = inputBGColor.value;
        resource.textColor= inputTextColor.value;
        resource.fontFamily = selectFontFamily.value;
        resource.fontSize = selectFontSize.value;
        resource.content = textArea.value;

        saveToStorage();


    }
    function makeNotepadBold(){
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";

        if(isPressed == false)
        {
            this.setAttribute("pressed",true);
            textArea.style.fontWeight = "bold";
        }
        else
        {
            this.setAttribute("pressed",false);
            textArea.style.fontWeight = "normal";
        }

    }
    function makeNotepadItalic(){
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if(isPressed == false)
        {
            this.setAttribute("pressed",true);
            textArea.style.fontStyle = "italic";
        }
        else
        {
            this.setAttribute("pressed",false);
            textArea.style.fontStyle = "normal";
        }

    }
    function makeNotepadUnderline(){
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";

        if(isPressed == false)
        {
            this.setAttribute("pressed",true);
            textArea.style.textDecoration = "underline";
        }
        else
        {
            this.setAttribute("pressed",false);
            textArea.style.textDecoration = "none";
        }

    }
    function changeNotepadBGColor(){
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.backgroundColor = color;

    }
    function changeNotepadTextColor(){
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.color = color;


    }
    function changeNotepadFontFamily(){
        let fontFamily = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontFamily = fontFamily;


    }
    function changeNotepadFonySize(){
        let fontSize = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontSize = fontSize;
        

    }

    
    function saveToStorage(){
        let rjson = JSON.stringify(resources); //used to convert a jso to json string which can be saved.
        localStorage.setItem("data",rjson);
    }
    function loadFromStorage(){
        let fjson = localStorage.getItem("data");
        //if(!fjson) return;
        if(!!fjson)
        {
            resources = JSON.parse(fjson);
            for(let i=0;i<resources.length;i++)
            {
                if(resources[i].pid ==cfid)
                {
                    if(resources[i].rtype == "folder")
                    {
                        addFolderToHTML(resources[i].rname,resources[i].rid,resources[i].pid);

                    }
                    else if(resources[i].rtype == "text-file")
                    {
                        addFileToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
                    }
                }
                if(resources[i].rid > rid)
                {
                    rid = resources[i].rid;
                }
            }
        }
        
    }
    loadFromStorage();


})();