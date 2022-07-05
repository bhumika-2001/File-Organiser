(function()
{
    let btn = document.querySelector("#b1");
    let container = document.querySelector(".container");
    let aRootpath = document.querySelector(".path");
    let template = document.querySelector("#temp1");
    let divBreadCrumb = document.querySelector("#divBreadCrumb");
    let fid =0;
    let cfid = -1; //id of the folder in which we are
    let folders = [];
    btn.addEventListener("click",addFolder);
    aRootpath.addEventListener("click",navigateBreadCrumb);
    function addFolder()
    {
        let fname = prompt("Enter folder name");
        if(!!fname)
        {
            let exists =folders.some(f => f.name == fname);
            if(exists == false)
            {
                fid++;
                folders.push({
                    id : fid,
                    name : fname,
                    pid : cfid

                });
                addFolderInPage(fname,fid,cfid);
                persistFolders();
            }
            else
            {
                alert(fname +" already exists");
            }
        }
        else
        {
            alert("Please enter a name");
        }   
    }
    function addFolderInPage(fname,fid,pid)
    {
        let divInsideTemplate = template.content.querySelector(".folder1");
        let divCopy = document.importNode(divInsideTemplate,true);
        let divName = divCopy.querySelector("[purpose='name']")

        divName.innerHTML = fname;
        divCopy.setAttribute("id",fid);
        divCopy.setAttribute("pid",pid);
        let spanDelete = divCopy.querySelector("[action='delete']");
        spanDelete.addEventListener("click",deleteFolder);
        let spanEdit = divCopy.querySelector("[action='edit']");
        spanEdit.addEventListener("click",editFolder);
        let spanView = divCopy.querySelector("[action='view']");
        spanView.addEventListener("click",viewFolder);
        
        container.appendChild(divCopy);
    }
    function editFolder(){
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let nfname = prompt("Enter new folder name");
        if(!!nfname )
        {
            if(nfname != divName.innerHTML)
            {
                let exists = folders.filter(f => f.pid == cfid).some(f => f.name == nfname);
                if(exists == false)
                {
                    divName.innerHTML = nfname;
                }
                else
                {
                    alert(nfname+" already exists");
                }
            }
            else
            {
                alert("This is previous name. Pls enter new name");
            }
        }
        else
        {
            alert("please enter a name");
        }
        let folder = folders.filter(f => f.pid == cfid).find(f => f.id == parseInt(divFolder.getAttribute("fid")));
        folder.name = nfname;
        persistFolders();
    }
    function deleteFolder(){
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let idtbd = divFolder.getAttribute("id");
        let flag = confirm("Delete the "+divName.innerHTML+" folder ?");
        if(flag == true)
        {
            let exists = folders.some(f => f.pid == idtbd);
            if(exists == false)
            {
                let idx = folders.findIndex(f => f.id == idtbd);
                 //ram
                folders.splice(idx,1);
                //html
                container.removeChild(divFolder);
                //storage
                persistFolders();
            }
            else
            {
                alert("Cant delete, Has children.");
            }
           
            
        }
    }
    function navigateBreadCrumb()
    {
        container.innerHTML = "";
        let cfid = parseInt(this.getAttribute("id"));
        folders.filter(f => f.pid == cfid).forEach(f =>{
            addFolderInPage(f.name,f.id,f.pid);
        });
        while(this.nextSibling)
        {
            this.parentNode.removeChild(this.nextSibling);
        }

    }
    function viewFolder(){
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        cfid = parseInt(divFolder.getAttribute("id"));
        let aPathTemplate = template.content.querySelector(".path");
        let aPath = document.importNode(aPathTemplate, true);
        aPath.innerHTML = divName.innerHTML;
        aPath.setAttribute("id",cfid);
        aPath.addEventListener("click",navigateBreadCrumb);
        divBreadCrumb.appendChild(aPath);
        container.innerHTML = "";
        folders.filter(f =>f.pid == cfid).forEach(f =>{
            addFolderInPage(f.name,f.id,f.pid);
        })
    }
    function persistFolders()
    {
        console.log(folders);
        let fjson = JSON.stringify(folders);
        localStorage.setItem("data",fjson);
    }
    function loadFoldersFromStorage()
    {
        let fjson = localStorage.getItem("data");
        if(!!fjson)
        {
            
            folders = JSON.parse(fjson);
            folders.forEach(f =>{
                if(f.id > fid){
                    fid = f.id;
                }
                if(f.pid == cfid)
                {
                    addFolderInPage(f.name,f.id);
                }
                
            });
        }
    }
    loadFoldersFromStorage();
})();