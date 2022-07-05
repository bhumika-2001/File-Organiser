

(function(){
    let btnAddFolder = document.querySelector("#addFolder");
    let btnAddFile = document.querySelector("#addFile");
    let breadCrumb = document.querySelector("#breadCrumb");
    let aRootPath = breadCrumb.querySelector("a[purpose='path']");
    let templates = document.querySelector("#templates");
    let container = document.querySelector("#container");
    let resources = [];
    let cfid = -1;
    let rid = 0;
    btnAddFolder.addEventListener("click", addFolder);
    btnAddFile.addEventListener("click",addFile);
    aRootPath.addEventListener("click",viewFolderFromPath);

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
    function deleteFile(){}
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
    function editFile(){}
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
    function viewFile(){}
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